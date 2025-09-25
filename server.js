// server.js
import 'dotenv/config';
import express from 'express';
import carRouter from './routes/carRoutes.js'; // <— viktigt: rätt filnamn + .js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MONTERA routern här:
app.use('/api/cars', carRouter);

app.get('/', (_req, res) => res.send('Welcome to the Car Rental API!'));

// 404 fallback (valfritt)
app.use((_req, res) => res.status(404).send('Not found'));

app.listen(PORT, () => {
  console.log(`🚗 Server running on http://localhost:${PORT}`);
});
