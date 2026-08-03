/**
 * VIMAL EYE HOSPITAL — BACKEND SERVER ENTRY POINT
 * Express + Resend API Service
 */
import express from 'express';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Vimal Eye Hospital API', timestamp: new Date() });
});

// API Routes
app.use('/api', appointmentRoutes);

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
