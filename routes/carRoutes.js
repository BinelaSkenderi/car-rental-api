// routes/carRoutes.js
import express from 'express';
import * as carService from '../services/carService.js';

const router = express.Router();

function isISODate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

// GET /api/cars
router.get('/', async (req, res) => {
  try {
    const { ledigaFran, ledigaTill } = req.query;

    if (ledigaFran && !isISODate(ledigaFran)) {
      return res
        .status(400)
        .json({ error: 'ledigaFran måste vara YYYY-MM-DD' });
    }
    if (ledigaTill && !isISODate(ledigaTill)) {
      return res
        .status(400)
        .json({ error: 'ledigaTill måste vara YYYY-MM-DD' });
    }

    const cars = await carService.getAllCars(req.query);
    res.json(cars);
  } catch (e) {
    console.error('GET /api/cars error:', e);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// GET /api/cars/:id (oförändrad)
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
    console.error(`GET /api/cars/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

export default router;
