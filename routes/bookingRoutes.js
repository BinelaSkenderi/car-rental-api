import express from 'express';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/bookingService.js';

const router = express.Router();
const isInt = n => Number.isInteger(Number(n));
const isISO = s => /^\d{4}-\d{2}-\d{2}$/.test(s);

// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const { carId, customerId, from, to } = req.query;
    if (carId && !isInt(carId))
      return res.status(400).json({ error: 'carId måste vara heltal' });
    if (customerId && !isInt(customerId))
      return res.status(400).json({ error: 'customerId måste vara heltal' });
    if (from && !isISO(from))
      return res.status(400).json({ error: 'from måste vara YYYY-MM-DD' });
    if (to && !isISO(to))
      return res.status(400).json({ error: 'to måste vara YYYY-MM-DD' });

    const data = await getAllBookings({ carId, customerId, from, to });
    res.json(data);
  } catch (e) {
    console.error('GET /api/bookings error:', e);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { carId, customerId, startDatum, slutDatum, totalPris } =
      req.body || {};
    if (
      !isInt(carId) ||
      !isInt(customerId) ||
      !isISO(startDatum) ||
      !isISO(slutDatum)
    ) {
      return res
        .status(400)
        .json({
          error:
            'carId, customerId (heltal) och startDatum/slutDatum (YYYY-MM-DD) krävs',
        });
    }
    const b = await createBooking({
      carId: Number(carId),
      customerId: Number(customerId),
      startDatum,
      slutDatum,
      totalPris: Number(totalPris),
    });
    res.status(201).json(b);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.message });
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Okänd carId eller customerId' });
    }
    console.error('POST /api/bookings error:', e);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT /api/bookings/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });

    const { carId, customerId, startDatum, slutDatum, totalPris } =
      req.body || {};
    if (
      !isInt(carId) ||
      !isInt(customerId) ||
      !isISO(startDatum) ||
      !isISO(slutDatum)
    ) {
      return res
        .status(400)
        .json({
          error:
            'carId, customerId (heltal) och startDatum/slutDatum (YYYY-MM-DD) krävs',
        });
    }
    const b = await updateBooking(Number(id), {
      carId: Number(carId),
      customerId: Number(customerId),
      startDatum,
      slutDatum,
      totalPris: Number(totalPris),
    });
    if (!b) return res.status(404).json({ error: 'Booking not found' });
    res.json(b);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.message });
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Okänd carId eller customerId' });
    }
    console.error(`PUT /api/bookings/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const ok = await deleteBooking(Number(id));
    if (!ok) return res.status(404).json({ error: 'Booking not found' });
    res.status(204).send();
  } catch (e) {
    console.error(`DELETE /api/bookings/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
