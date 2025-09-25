import express from 'express';
import * as carService from '../services/carService.js';

const router = express.Router();

// GET /api/cars
router.get('/', async (_req, res) => {
  try {
    const cars = await carService.getAllCars();
    res.json(cars);
  } catch (e) {
    console.error('GET /api/cars error:', e); // <-- tydlig logg
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'id måste vara ett heltal' });
    }
    const car = await carService.getCarById(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (e) {
    console.error(`GET /api/cars/${req.params.id} error:`, e); // <-- tydlig logg
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

export default router;
