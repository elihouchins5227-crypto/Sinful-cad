const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example API endpoint
app.get('/api/health', (req, res) => res.send('OK'));

// 911 calls API
app.get('/api/calls', (req, res) => {
  // You can connect this to your DB later
  res.json([{ info: 'Test call' }]);
});

app.post('/api/911', (req, res) => {
  const { info } = req.body;
  console.log('Received 911:', info);
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Fusion CAD running on port ${PORT}`));
