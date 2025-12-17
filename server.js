const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Catch all routes and return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example API endpoints
app.get('/api/health', (req, res) => res.send('OK'));
app.get('/api/calls', (req, res) => res.json([{ info: 'Test 911 call' }]));
app.post('/api/911', (req, res) => {
  const { info } = req.body;
  console.log('Received 911:', info);
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Fusion CAD running on port ${PORT}`));