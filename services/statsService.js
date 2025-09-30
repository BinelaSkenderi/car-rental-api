import * as repo from '../data/statsData.js';

export const getBookingsPerMonth = async year => {
  const y = Number(year);
  const list = await repo.bookingsPerMonth(y);
  const map = new Map(list.map(r => [Number(r.manad), Number(r.antal)]));
  const filled = [];
  for (let m = 1; m <= 12; m++)
    filled.push({ manad: m, antal: map.get(m) ?? 0 });
  return filled;
};

export const getAvgPricePerDay = async () => {
  const r = await repo.avgPricePerDay();
  return { snittPrisPerDag: r.snittPrisPerDag };
};

export const getAvailableCount = async (from, to) => {
  return repo.availableCountInRange(from, to);
};
