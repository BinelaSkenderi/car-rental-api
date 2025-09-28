import * as carData from '../data/carData.js';

export const getAllCars = async (q = {}) => {
  const cars = await carData.findAll(q);
  return cars.map(c => ({
    ...c,
    prisPerDag: Number(c.prisPerDag),
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  }));
};

export const getCarById = async id => {
  const c = await carData.findById(id);
  if (!c) return null;
  return {
    ...c,
    prisPerDag: Number(c.prisPerDag),
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  };
};
