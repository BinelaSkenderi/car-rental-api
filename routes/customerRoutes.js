// routes/customerRoutes.js
import express from 'express';
import * as svc from '../services/customerService.js';
import { getAllBookings } from '../services/bookingService.js';

const router = express.Router();

function isISODate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

router.get('/', async (_req, res) => {
  res.json(await svc.getAllCustomers());
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'id måste vara heltal' });
  }
  const c = await svc.getCustomerById(id);
  if (!c) return res.status(404).json({ error: 'Customer not found' });
  res.json(c);
});

// NY: GET /api/customers/:id/bokningar
router.get('/:id/bokningar', async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    if (!Number.isInteger(customerId)) {
      return res.status(400).json({ error: 'id måste vara heltal' });
    }

    const { from, to } = req.query;
    if (from && !isISODate(from)) {
      return res.status(400).json({ error: 'from måste vara YYYY-MM-DD' });
    }
    if (to && !isISODate(to)) {
      return res.status(400).json({ error: 'to måste vara YYYY-MM-DD' });
    }

    const data = await getAllBookings({ customerId, from, to });
    res.json(data);
  } catch (e) {
    console.error(`GET /api/customers/${req.params.id}/bokningar error:`, e);
    res.status(500).json({ error: 'Failed to fetch customer bookings' });
  }
});

export default router;
