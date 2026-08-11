// Load environment variables before importing dependent services
try {
  process.loadEnvFile();
} catch (e) {
  // .env file optional in production environment
}

import express from 'express';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares — restrict CORS to localhost origins only (local dev server)
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000'] }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api', appointmentRoutes);
app.use('/api', enquiryRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏥 Vimal Eye Hospital API Server running on port ${PORT}`);
  console.log(`✉️ Resend Email Integration Active`);
  console.log(`====================================================`);
});
