import { getConnection } from '../config/database.js';

export const findALL = async () => {
  const db = await getConnection();
  const [rows] = await db.execute(
    'SELECT id, fnamn, enamn, personnummer, telefon FROM kunder ORDER BY id'
  );
  return rows;
};

export const findById = async id => {
  const db = await getConnection();
  const [rows] = await db.execute(
    'SELECT id, fnamn, enamn, personnummer, telefon FROM kunder WHERE id = ?',
    [Number(id)]
  );
  return rows[0] || null;
};
