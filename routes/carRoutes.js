//routes/carRoutes.js
import express from 'express';
import * as carService from '../services/carService.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cars = await carService.getAllCars(req.query);
    res.json(cars);
  } catch (e) {
    console.error('GET /api/cars error:', e);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: 'id måste vara heltal' });
    const car = await carService.getCarById(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (e) {
    console.error(`GET /api/cars/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

export default router;
