import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'CASCADE // AI Telemetry Server', timestamp: new Date() });
});

// Production Static Assets & React SPA Fallback
const distPath = path.resolve(__dirname, '..', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    // Return 404 JSON for unmatched API calls instead of falling back to HTML
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, HOST, () => {
  console.log(`[CASCADE // AI Server] Running on http://${HOST}:${PORT}`);
});
