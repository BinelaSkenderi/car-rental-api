import { getConnection } from '../config/database.js';

export const bookingsPerMonth = async year => {
  const db = await getConnection();
  const [rows] = await db.execute(
    `
    SELECT
      MONTH(start_datum) AS manad,
      COUNT(*)           AS antal
    FROM bokningar
    WHERE YEAR(start_datum) = ?
    GROUP BY MONTH(start_datum)
    ORDER BY MONTH(start_datum)
    `,
    [Number(year)]
  );
  return rows;
};

export const avgPricePerDay = async () => {
  const db = await getConnection();
  const [rows] = await db.execute(
    `SELECT AVG(pris_per_dag) AS snittPrisPerDag FROM bilar`
  );
  const val = rows[0]?.snittPrisPerDag;
  return { snittPrisPerDag: val != null ? Number(val) : null };
};

export const availableCountInRange = async (from, to) => {
  const db = await getConnection();
  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS antal
    FROM bilar c
    WHERE NOT EXISTS (
      SELECT 1
      FROM bokningar b
      WHERE b.bil_id = c.id
        AND b.start_datum <= ?
        AND b.slut_datum  >= ?
    )
    `,
    [to, from]
  );
  return { antalLediga: Number(rows[0]?.antal ?? 0) };
};
