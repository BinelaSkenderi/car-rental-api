//routes/customerRoutes.js
import express from 'express';
import * as svc from '../services/customerService.js';
const router = express.Router();

router.get('/', async (_req, res) => {
  res.json(await svc.getAllCustomers());
});
router.get('/:id', async (req, res) => {
  const c = await svc.getCustomerById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Customer not found' });
  res.json(c);
});
export default router;
