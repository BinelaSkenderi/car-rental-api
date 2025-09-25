import express from 'express';

const router = express.Router();

// GET /api/cars - Enkel testendpoint för bilar
router.get('/', (req, res) => {
  res.send('Här kommer listan med bilar');
});

export default router;
