import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'CASCADE // AI Telemetry Server', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`[CASCADE // AI Backend Server] Running on http://localhost:${PORT}`);
});
