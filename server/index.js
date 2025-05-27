const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
app.get('/api/crashes', (req, res) => {
  res.json({ message: 'Crash data endpoint ready' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});