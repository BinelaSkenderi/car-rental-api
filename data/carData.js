import { getConnection } from '../config/database.js';

export const findAll = async () => {
  const db = await getConnection();
  const [rows] = await db.execute(
    'SELECT id, regnr, marke, modell, pris_per_dag AS prisPerDag FROM bilar'
  );
  return rows;
};

export const findById = async id => {
  const db = await getConnection();
  const [rows] = await db.execute(
    'SELECT id, regnr, marke, modell, pris_per_dag AS prisPerDag FROM bilar WHERE id = ?',
    [Number(id)]
  );
  return rows[0] || null;
};
