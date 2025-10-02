import 'dotenv/config';
import express from 'express';

import carRouter from './routes/carRoutes.js';
import customerRouter from './routes/customerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import metaStatsRouter from './routes/metaStatsRoutes.js';
import { getConnection } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routers
app.use('/api/cars', carRouter);
app.use('/api/customers', customerRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/meta/stats', metaStatsRouter);

// Health + root
app.get('/api/meta/health', async (_req, res) => {
  try {
    const db = await getConnection();
    await db.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: 'ok' });
  } catch (e) {
    console.error('Healthcheck DB error:', e);
    res.status(500).json({ status: 'error', db: 'fail', message: e.message });
  }
});
// app.get('/', (_req, res) => res.send('Welcome to the Car Rental API!'));

app.get(`/`, (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Welcome to the Car Rental API! 👋</title>
  <style>
    :root { --c1:#0ea5e9; --c2:#8b5cf6; --c3:#22c55e; }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      display:flex; align-items:center; justify-content:center;
      background:linear-gradient(135deg,var(--c1),var(--c2),var(--c3));
      background-size:600% 600%;
      animation:bg 12s ease infinite;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;
      color:#fff;
    }
    h1{
      font-size:clamp(34px,6vw,84px);
      letter-spacing:.04em;
      margin:0;
      text-align:center;
      filter:drop-shadow(0 8px 28px rgba(0,0,0,.35));
      animation:fade 900ms ease-out both;
    }
    .wave{display:inline-block; transform-origin:70% 70%; animation:wave 1.8s ease-in-out infinite}
    @keyframes bg{
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    @keyframes wave{
      0%{transform:rotate(0)}
      10%{transform:rotate(14deg)}
      20%{transform:rotate(-8deg)}
      30%{transform:rotate(14deg)}
      40%{transform:rotate(-4deg)}
      50%{transform:rotate(10deg)}
      60%,100%{transform:rotate(0)}
    }
    @keyframes fade{
      from{opacity:0; transform:translateY(8px) scale(.98)}
      to{opacity:1; transform:translateY(0) scale(1)}
    }
  </style>
</head>
<body>
  <h1>Welcome to the Car Rental API! <span class="wave">👋</span></h1>
</body>
</html>`);
});

// 404 sist
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Central felhanterare
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res
    .status(err.status || 500)
    .json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, async () => {
  console.log(`🚗 Server running on http://localhost:${PORT}`);
  try {
    await getConnection();
    console.log('✅ DB connected');
  } catch (e) {
    console.error('❌ DB connection failed:', e.message);
  }
});
