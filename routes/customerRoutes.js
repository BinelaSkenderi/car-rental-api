import express from 'express';
import * as svc from '../services/customerService.js';
import { getAllBookings } from '../services/bookingService.js';

const router = express.Router();
const isInt = n => Number.isInteger(Number(n));
const isISO = s => /^\d{4}-\d{2}-\d{2}$/.test(s);

router.get('/', async (_req, res) => {
  res.json(await svc.getAllCustomers());
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!isInt(id))
    return res.status(400).json({ error: 'id måste vara heltal' });
  const c = await svc.getCustomerById(id);
  if (!c) return res.status(404).json({ error: 'Customer not found' });
  res.json(c);
});

// Kundens bokningar
router.get('/:id/bokningar', async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    if (!isInt(customerId))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const { from, to } = req.query;
    if (from && !isISO(from))
      return res.status(400).json({ error: 'from måste vara YYYY-MM-DD' });
    if (to && !isISO(to))
      return res.status(400).json({ error: 'to måste vara YYYY-MM-DD' });

    const data = await getAllBookings({ customerId, from, to });
    res.json(data);
  } catch (e) {
    console.error(`GET /api/customers/${req.params.id}/bokningar error:`, e);
    res.status(500).json({ error: 'Failed to fetch customer bookings' });
  }
});

// POST kund
router.post('/', async (req, res) => {
  try {
    const { fnamn, enamn, personnummer, telefon } = req.body || {};
    if (!fnamn || !enamn)
      return res.status(400).json({ error: 'fnamn och enamn krävs' });
    const c = await svc.createCustomer({ fnamn, enamn, personnummer, telefon });
    res.status(201).json(c);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res
        .status(409)
        .json({ error: 'personnummer är redan registrerat' });
    }
    console.error('POST /api/customers error:', e);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT kund
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });

    const { fnamn, enamn, personnummer, telefon } = req.body || {};
    if (!fnamn || !enamn)
      return res.status(400).json({ error: 'fnamn och enamn krävs' });

    const c = await svc.updateCustomer(id, {
      fnamn,
      enamn,
      personnummer,
      telefon,
    });
    if (!c) return res.status(404).json({ error: 'Customer not found' });
    res.json(c);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res
        .status(409)
        .json({ error: 'personnummer är redan registrerat' });
    }
    console.error(`PUT /api/customers/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE kund
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const ok = await svc.deleteCustomer(id);
    if (!ok) return res.status(404).json({ error: 'Customer not found' });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res
        .status(409)
        .json({ error: 'Kan ej radera kund som har bokningar' });
    }
    console.error(`DELETE /api/customers/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
