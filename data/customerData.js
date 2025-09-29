import { getConnection } from '../config/database.js';

export const create = async ({ fnamn, enamn, personnummer, telefon }) => {
  const db = await getConnection();
  const [result] = await db.execute(
    `INSERT INTO kunder (fnamn, enamn, personnummer, telefon)
     VALUES (?, ?, ?, ?)`,
    [fnamn, enamn, personnummer ?? null, telefon ?? null]
  );
  return { id: result.insertId };
};

export const update = async (id, { fnamn, enamn, personnummer, telefon }) => {
  const db = await getConnection();
  const [result] = await db.execute(
    `UPDATE kunder
       SET fnamn = ?, enamn = ?, personnummer = ?, telefon = ?
     WHERE id = ?`,
    [fnamn, enamn, personnummer ?? null, telefon ?? null, Number(id)]
  );
  return result.affectedRows;
};

export const remove = async id => {
  const db = await getConnection();
  const [result] = await db.execute(`DELETE FROM kunder WHERE id = ?`, [
    Number(id),
  ]);
  return result.affectedRows;
};
