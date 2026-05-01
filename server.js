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

// Load HTML
const htmlPath = path.join(__dirname, 'index.html');
let html = null;

try {
  html = fs.readFileSync(htmlPath, 'utf-8');
  console.log(`✓ Loaded HTML (${(html.length / 1024).toFixed(0)}KB)`);
} catch (err) {
  console.error('FATAL: Could not load index.html', err.message);
  process.exit(1);
}

// Routes
app.get('/', (req, res) => {
  res.type('text/html').send(html);
});

app.get('*', (req, res) => {
  res.type('text/html').send(html);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).type('text/plain').send('Server Error');
});

// Start
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✓ Paris Oven live on 0.0.0.0:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM - shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT - shutting down');
  server.close(() => process.exit(0));
});
