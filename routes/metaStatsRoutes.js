import express from 'express';
import {
  getBookingsPerMonth,
  getAvgPricePerDay,
  getAvailableCount,
} from '../services/statsService.js';

// en miniatyr-app som hanterar routes
const router = express.Router();
const isISO = s => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isYear = s => /^\d{4}$/.test(s);

router.get('/bokningar-per-manad', async (req, res) => {
  try {
    const { year } = req.query;
    if (!year || !isYear(year))
      return res.status(400).json({ error: 'year måste vara YYYY' });
    const data = await getBookingsPerMonth(year);
    res.json({ year: Number(year), data });
  } catch (e) {
    console.error('GET /api/meta/stats/bokningar-per-manad error:', e);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Endpoint: GET /snitt-pris-per-dag
router.get('/snitt-pris-per-dag', async (_req, res) => {
  try {
    const data = await getAvgPricePerDay();
    res.json(data);
  } catch (e) {
    console.error('GET /api/meta/stats/snitt-pris-per-dag error:', e);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/antal-lediga', async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to || !isISO(from) || !isISO(to)) {
      return res.status(400).json({ error: 'from/to måste vara YYYY-MM-DD' });
    }
    const data = await getAvailableCount(from, to);
    res.json({ from, to, ...data });
  } catch (e) {
    console.error('GET /api/meta/stats/antal-lediga error:', e);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
