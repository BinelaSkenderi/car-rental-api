// server.js
import 'dotenv/config';
import express from 'express';
import carRouter from './routes/carRoutes.js';
import customerRouter from './routes/customerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { getConnection } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Bas-middleware
app.use(express.json());

// API-routes
app.use('/api/cars', carRouter);
app.use('/api/customers', customerRouter);
app.use('/api/bookings', bookingRouter);

// Healthcheck (snabb DB-ping)
app.get('/api/meta/health', async (_req, res) => {
  try {
    const db = await getConnection();
    await db.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: 'ok' });
  } catch (e) {
    console.error('Healthcheck DB error:', e);
    res.status(500).json({ status: 'error', db: 'fail', message: e.message });
  }
});

// Root
app.get('/', (_req, res) => res.send('Welcome to the Car Rental API!'));

// 404 för övriga vägar (JSON)
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Central felhanterare
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res
    .status(err.status || 500)
    .json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, async () => {
  console.log(`🚗 Server running on http://localhost:${PORT}`);
  try {
    await getConnection();
    console.log('✅ DB connected');
  } catch (e) {
    console.error('❌ DB connection failed:', e.message);
  }
});
