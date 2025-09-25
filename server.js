import express from 'express';
import carRouter from './routes/carRoutes.js'; // importera din routerfil

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware om du behöver
app.use(express.json());

// Koppla router
app.use('/api/cars', carRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Car Rental API!');
});

// Enkel felhanterare (fångar throw eller next(error))
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`🚗 Server running on http://localhost:${PORT}`);
});
