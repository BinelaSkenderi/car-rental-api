import express from 'express';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/bookingService.js';

const router = express.Router();
const isISO = s => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isInt = n => Number.isInteger(Number(n));

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
