import express from 'express';
import { getConnection } from './config/database.js';

const app = express();
const PORT = 3000;

// Enkel route för att testa servern
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Enkel route för att testa databasen
app.get('/db-test', async (req, res) => {
  try {
    const db = await getConnection();
    const [rows] = await db.execute('SELECT NOW() AS now');
    res.json({ status: 'ok', time: rows[0].now });
  } catch (error) {
    console.error('DB error:', error.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // testa anslutningen direkt vid start
  try {
    const db = await getConnection();
    const [rows] = await db.execute('SELECT NOW() AS now');
    console.log('DB time:', rows[0].now);
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
});
