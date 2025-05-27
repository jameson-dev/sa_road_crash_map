require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Crash data route placeholder
app.get('/api/crashes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('crashes')
      .select('*')
      .limit(10);

    if (error) throw error;

    res.json({
      message: 'Database connection successful',
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Allow map to request data only from visible map area
app.get('/api/crashes/bounds', async (req, res) => {
  try {
    const { north, south, east, west, limit = 1000 } = req.query;
    
    let query = supabase
      .from('crashes')
      .select('unique_loc, longitude, latitude, total_crashes, properties');
    
    // Add bounding box filter if provided
    if (north && south && east && west) {
      query = query
        .gte('latitude', parseFloat(south))
        .lte('latitude', parseFloat(north))
        .gte('longitude', parseFloat(west))
        .lte('longitude', parseFloat(east));
    }
    
    const { data, error } = await query.limit(parseInt(limit));
    
    if (error) throw error;
    
    res.json({
      count: data.length,
      data: data
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});