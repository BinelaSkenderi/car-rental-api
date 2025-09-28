//routes/bookingRoutes.js
import express from 'express';
import { getAllBookings } from '../services/bookingService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { carId, customerId, from, to } = req.query;
    const data = await getAllBookings({ carId, customerId, from, to });
    res.json(data);
  } catch (e) {
    console.error('GET /api/bookings error:', e);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;
