import * as carData from '../data/carData.js';

// Hjälp om du senare vill formatera datumfält
const toYMD = iso => (iso ? new Date(iso).toISOString().slice(0, 10) : null);

export const getAllCars = async (q = {}) => {
  const cars = await carData.findAll(q);

  return cars.map(c => ({
    ...c,
    // konvertera prisPerDag till Number
    prisPerDag: c.prisPerDag != null ? Number(c.prisPerDag) : null,
    // ev. konvertera datumfält så här:
    // registreradDatum: toYMD(c.registreradDatum),
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  }));
};

export const getCarById = async id => {
  const c = await carData.findById(id);
  if (!c) return null;

  return {
    ...c,
    prisPerDag: c.prisPerDag != null ? Number(c.prisPerDag) : null,
    // registreradDatum: toYMD(c.registreradDatum), // om du vill
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  };
};
