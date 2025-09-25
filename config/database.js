// config/database.js
import 'dotenv/config';
import mysql from 'mysql2/promise';

let connection;
export const getConnection = async () => {
  if (!connection) {
    const cfg = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, // <- kommer från .env
      database: process.env.DB_NAME,
    };
    console.log('DB cfg:', {
      user: cfg.user,
      hasPass: !!cfg.password,
      db: cfg.database,
    });
    connection = await mysql.createConnection(cfg);
    console.log(`✅ Connected to DB: ${cfg.database}`);
  }
  return connection;
};
