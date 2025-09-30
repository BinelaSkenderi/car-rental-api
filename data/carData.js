import { getConnection } from '../config/database.js';

export const findAll = async (filters = {}) => {
  const db = await getConnection();

  let sql = `
    SELECT
      id,
      regnr,
      marke,
      modell,
      pris_per_dag AS prisPerDag
    FROM bilar
    WHERE 1=1
  `;
  const params = [];

  if (filters.minPris != null && filters.minPris !== '') {
    sql += ' AND pris_per_dag >= ?';
    params.push(Number(filters.minPris));
  }
  if (filters.maxPris != null && filters.maxPris !== '') {
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
  if (filters.q) {
    sql += ' AND (marke LIKE ? OR modell LIKE ?)';
    const like = `%${filters.q}%`;
    params.push(like, like);
  }

  // ledigaFran / ledigaTill
  const hasFrom = !!filters.ledigaFran;
  const hasTo = !!filters.ledigaTill;
  if (hasFrom && hasTo) {
    sql += `
      AND NOT EXISTS (
        SELECT 1 FROM bokningar b
        WHERE b.bil_id = bilar.id
          AND b.start_datum <= ?
          AND b.slut_datum  >= ?
      )
    `;
    params.push(filters.ledigaTill, filters.ledigaFran);
  } else if (hasFrom) {
    sql += `
      AND NOT EXISTS (
        SELECT 1 FROM bokningar b
        WHERE b.bil_id = bilar.id
          AND b.slut_datum >= ?
      )
    `;
    params.push(filters.ledigaFran);
  } else if (hasTo) {
    sql += `
      AND NOT EXISTS (
        SELECT 1 FROM bokningar b
        WHERE b.bil_id = bilar.id
          AND b.start_datum <= ?
      )
    `;
    params.push(filters.ledigaTill);
  }

  sql += ' ORDER BY id ASC';

  const [rows] = await db.execute(sql, params);
  return rows;
};

export const findById = async id => {
  const db = await getConnection();
  const [rows] = await db.execute(
    `
    SELECT
      id,
      regnr,
      marke,
      modell,
      pris_per_dag AS prisPerDag
    FROM bilar
    WHERE id = ?
    `,
    [Number(id)]
  );
  return rows[0] || null;
};

export const create = async ({ regnr, marke, modell, prisPerDag }) => {
  const db = await getConnection();
  const [result] = await db.execute(
    `INSERT INTO bilar (regnr, marke, modell, pris_per_dag) VALUES (?, ?, ?, ?)`,
    [regnr, marke ?? null, modell ?? null, prisPerDag ?? null]
  );
  return { id: result.insertId };
};

export const update = async (id, { regnr, marke, modell, prisPerDag }) => {
  const db = await getConnection();
  const [result] = await db.execute(
    `UPDATE bilar
       SET regnr = ?, marke = ?, modell = ?, pris_per_dag = ?
     WHERE id = ?`,
    [regnr, marke ?? null, modell ?? null, prisPerDag ?? null, Number(id)]
  );
  return result.affectedRows;
};

export const remove = async id => {
  const db = await getConnection();
  const [result] = await db.execute(`DELETE FROM bilar WHERE id = ?`, [
    Number(id),
  ]);
  return result.affectedRows;
};
