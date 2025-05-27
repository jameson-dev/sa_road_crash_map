require('dotenv').config();
const supabase = require('./supabase');
const fs = require('fs');

async function importCrashData() {
  try {
    console.log('Starting data import...');
    
    // Read GeoJSON file
    const rawData = fs.readFileSync('../data/crashes.geojson', 'utf8');
    const geoData = JSON.parse(rawData);
    
    console.log(`Found ${geoData.features.length} records to import`);
    
    // Process in batches of 100 to avoid memory issues
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < geoData.features.length; i += batchSize) {
      const batch = geoData.features.slice(i, i + batchSize);
      
      const processedBatch = batch.map(feature => ({
        unique_loc: feature.properties.UNIQUE_LOC,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        total_crashes: feature.properties.TOTAL_CRASHES || 0,
        properties: feature.properties
      }));
      
      const { error } = await supabase
        .from('crashes')
        .insert(processedBatch);
      
      if (error) throw error;
      
      imported += batch.length;
      console.log(`Imported ${imported}/${geoData.features.length} records`);
    }
    
    console.log('Data import completed successfully!');
    
  } catch (error) {
    console.error('Import failed:', error.message);
  }
}

importCrashData();