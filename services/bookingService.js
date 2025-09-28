import * as repo from '../data/bookingData.js';

// liten hjälpfunktion för att göra ISO-tid → "YYYY-MM-DD"
const toYMD = iso => (iso ? new Date(iso).toISOString().slice(0, 10) : null);

export const getAllBookings = async (q = {}) => {
  const rows = await repo.findAll(q);

  return rows.map(r => ({
    ...r,
    totalPris: r.totalPris != null ? Number(r.totalPris) : null,
    startDatum: toYMD(r.startDatum),
    slutDatum: toYMD(r.slutDatum),
  }));
};
