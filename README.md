# EcoTrack - Local Demo Server

This repository contains a small Express server used to serve the static client files and accept activity logs for demo/testing.

How to run (Windows PowerShell):

1. Install dependencies:

   npm install

2. Start server (serves `index.html` at http://localhost:3000):

   npm start

API endpoints (demo):

- GET /api/ping — health check
- POST /api/activity — accept JSON activity payload, returns created record
- GET /api/activities — get stored activities (in-memory)

Notes:
- This server uses an in-memory array for activities (demo only). For production use replace with a proper database.
"# EcoTrack-A-Gamified-Carbon-footprint-Tracker" 
