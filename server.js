const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: false
}));

// Read HTML once on startup
const htmlPath = path.join(__dirname, 'index.html');
let cachedHtml = null;

try {
  cachedHtml = fs.readFileSync(htmlPath, 'utf-8');
  console.log(`✓ Loaded index.html (${(cachedHtml.length / 1024 / 1024).toFixed(2)}MB)`);
} catch (err) {
  console.error('ERROR loading index.html:', err.message);
  process.exit(1);
}

// Routes
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(cachedHtml);
});

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(cachedHtml);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✓ Paris Oven is live on port ${port}`);
  console.log(`✓ http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
