import { getConnection } from '../config/database.js';

export const findAll = async (filters = {}) => {
  const db = await getConnection();
  let sql = `
    SELECT id, regnr, marke, modell, pris_per_dag AS prisPerDag
    FROM bilar
    WHERE 1=1
  `;
  const params = [];

  if (filters.minPris) {
    sql += ' AND pris_per_dag >= ?';
    params.push(Number(filters.minPris));
  }
  if (filters.maxPris) {
    sql += ' AND pris_per_dag <= ?';
    params.push(Number(filters.maxPris));
  }
  if (filters.marke) {
    sql += ' AND marke = ?';
    params.push(filters.marke);
  }
  if (filters.modell) {
    sql += ' AND modell = ?';
    params.push(filters.modell);
  }

  sql += ' ORDER BY id ASC';

  const [rows] = await db.execute(sql, params);
  return rows;
};

export const findById = async id => {
  const db = await getConnection();
  const [rows] = await db.execute(
    `
    SELECT id, regnr, marke, modell, pris_per_dag AS prisPerDag
    FROM bilar
    WHERE id = ?
    `,
    [Number(id)]
  );
  return rows[0] || null;
};
