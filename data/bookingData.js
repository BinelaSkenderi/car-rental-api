import { getConnection } from '../config/database.js';

export const hasOverlap = async ({ carId, from, to, excludeId = null }) => {
  const db = await getConnection();
  let sql = `
    SELECT COUNT(*) AS cnt
    FROM bokningar
    WHERE bil_id = ?
      AND start_datum <= ?
      AND slut_datum  >= ?
  `;
  const params = [Number(carId), to, from];

  if (excludeId) {
    sql += ' AND id <> ?';
    params.push(Number(excludeId));
  }

  const [rows] = await db.execute(sql, params);
  return Number(rows[0]?.cnt ?? 0) > 0;
};

export const create = async ({
  carId,
  customerId,
  startDatum,
  slutDatum,
  totalPris,
}) => {
  const db = await getConnection();
  const [result] = await db.execute(
    `INSERT INTO bokningar (bil_id, kund_id, start_datum, slut_datum, total_pris)
     VALUES (?, ?, ?, ?, ?)`,
    [Number(carId), Number(customerId), startDatum, slutDatum, totalPris]
  );
  return { id: result.insertId };
};

export const update = async (
  id,
  { carId, customerId, startDatum, slutDatum, totalPris }
) => {
  const db = await getConnection();
  const [result] = await db.execute(
    `UPDATE bokningar
       SET bil_id = ?, kund_id = ?, start_datum = ?, slut_datum = ?, total_pris = ?
     WHERE id = ?`,
    [
      Number(carId),
      Number(customerId),
      startDatum,
      slutDatum,
      totalPris,
      Number(id),
    ]
  );
  return result.affectedRows;
};

export const remove = async id => {
  const db = await getConnection();
  const [result] = await db.execute(`DELETE FROM bokningar WHERE id = ?`, [
    Number(id),
  ]);
  return result.affectedRows;
};

export const findById = async id => {
  const db = await getConnection();
  const [rows] = await db.execute(
    `
    SELECT
      id,
      bil_id      AS carId,
      kund_id     AS customerId,
      start_datum AS startDatum,
      slut_datum  AS slutDatum,
      total_pris  AS totalPris
    FROM bokningar
    WHERE id = ?
    `,
    [Number(id)]
  );
  return rows[0] || null;
};
