import * as carData from '../data/carData.js';

export const getAllCars = async () => {
  const cars = await carData.findAll();
  return cars.map(c => ({
    ...c,
    prisPerDag: c.prisPerDag != null ? Number(c.prisPerDag) : null,
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  }));
};

export const getCarById = async id => {
  const c = await carData.findById(id);
  if (!c) return null;
  return {
    ...c,
    prisPerDag: c.prisPerDag != null ? Number(c.prisPerDag) : null,
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  };
};
