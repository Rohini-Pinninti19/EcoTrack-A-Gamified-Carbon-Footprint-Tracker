const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory store for demo purposes
const activities = [];

// Serve static files from project root
app.use(express.static(path.join(__dirname)));

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/activity', (req, res) => {
  try {
    const payload = req.body || {};
    const record = Object.assign({}, payload, {
      id: activities.length + 1,
      createdAt: new Date().toISOString()
    });
    activities.push(record);
    return res.status(201).json({ ok: true, activity: record });
  } catch (err) {
    console.error('Failed to save activity', err);
    return res.status(500).json({ ok: false, error: 'Failed to save activity' });
  }
});

app.get('/api/activities', (req, res) => {
  res.json({ activities });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for any other requests (serves index.html for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
