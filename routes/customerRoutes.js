import express from 'express';
import * as svc from '../services/customerService.js';
import { getAllBookings } from '../services/bookingService.js';

const router = express.Router();
const isInt = n => Number.isInteger(Number(n));

router.post('/', async (req, res) => {
  try {
    const { fnamn, enamn, personnummer, telefon } = req.body || {};
    if (!fnamn || !enamn) {
      return res.status(400).json({ error: 'fnamn och enamn krävs' });
    }
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

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const { fnamn, enamn, personnummer, telefon } = req.body || {};
    if (!fnamn || !enamn)
      return res.status(400).json({ error: 'fnamn och enamn krävs' });

    const c = await svc.updateCustomer(Number(id), {
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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const ok = await svc.deleteCustomer(Number(id));
    if (!ok) return res.status(404).json({ error: 'Customer not found' });
    res.status(204).send();
  } catch (e) {
    // FK: kunden har bokningar
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
