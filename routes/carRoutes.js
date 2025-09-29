import express from 'express';
import * as carService from '../services/carService.js';

const router = express.Router();

const isInt = n => Number.isInteger(Number(n));
const isISO = s => /^\d{4}-\d{2}-\d{2}$/.test(s);

// GET /api/cars  (stöd för filter om du skickar ?minPris=...&maxPris=...&marke=...&modell=...&ledigaFran=YYYY-MM-DD&ledigaTill=YYYY-MM-DD)
router.get('/', async (req, res) => {
  try {
    const { ledigaFran, ledigaTill } = req.query;
    if (ledigaFran && !isISO(ledigaFran))
      return res
        .status(400)
        .json({ error: 'ledigaFran måste vara YYYY-MM-DD' });
    if (ledigaTill && !isISO(ledigaTill))
      return res
        .status(400)
        .json({ error: 'ledigaTill måste vara YYYY-MM-DD' });

    const cars = await carService.getAllCars(req.query);
    res.json(cars);
  } catch (e) {
    console.error('GET /api/cars error:', e);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });

    const car = await carService.getCarById(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    res.json(car);
  } catch (e) {
    console.error(`GET /api/cars/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// POST /api/cars
router.post('/', async (req, res) => {
  try {
    const { regnr, marke, modell, prisPerDag } = req.body || {};
    if (!regnr) return res.status(400).json({ error: 'regnr krävs' });
    const payload = {
      regnr: String(regnr).trim(),
      marke: marke ?? null,
      modell: modell ?? null,
      prisPerDag: prisPerDag != null ? Number(prisPerDag) : null,
    };
    const car = await carService.createCar(payload);
    res.status(201).json(car);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'regnr är redan upptaget' });
    }
    console.error('POST /api/cars error:', e);
    res.status(500).json({ error: 'Failed to create car' });
  }
});

// PUT /api/cars/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const { regnr, marke, modell, prisPerDag } = req.body || {};
    if (!regnr) return res.status(400).json({ error: 'regnr krävs' });

    const car = await carService.updateCar(Number(id), {
      regnr: String(regnr).trim(),
      marke: marke ?? null,
      modell: modell ?? null,
      prisPerDag: prisPerDag != null ? Number(prisPerDag) : null,
    });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'regnr är redan upptaget' });
    }
    console.error(`PUT /api/cars/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// DELETE /api/cars/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInt(id))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const ok = await carService.deleteCar(Number(id));
    if (!ok) return res.status(404).json({ error: 'Car not found' });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res
        .status(409)
        .json({ error: 'Kan ej radera bil som har bokningar' });
    }
    console.error(`DELETE /api/cars/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

export default router;
