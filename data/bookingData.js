// data/bookingData.js
import { getConnection } from '../config/database.js';

export const findAll = async (filters = {}) => {
  const db = await getConnection();
  let sql = `
    SELECT b.id,
           b.bil_id      AS carId,
           b.kund_id     AS customerId,
           b.start_datum AS startDatum,
           b.slut_datum  AS slutDatum,
           b.total_pris  AS totalPris
    FROM bokningar b
    WHERE 1=1`;
  const params = [];
  if (filters.carId) {
    sql += ' AND b.bil_id = ?';
    params.push(Number(filters.carId));
  }
  if (filters.customerId) {
    sql += ' AND b.kund_id = ?';
    params.push(Number(filters.customerId));
  }
  if (filters.from) {
    sql += ' AND b.slut_datum >= ?';
    params.push(filters.from);
  }
  if (filters.to) {
    sql += ' AND b.start_datum <= ?';
    params.push(filters.to);
  }
  sql += ' ORDER BY b.start_datum DESC';
  const [rows] = await db.execute(sql, params);
  return rows;
};
