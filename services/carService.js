// services/carService.js
import * as carData from '../data/carData.js';

export const getAllCars = async (q = {}) => {
  const cars = await carData.findAll(q);
  return cars.map(c => ({
    ...c,
    prisPerDag: c.prisPerDag != null ? Number(c.prisPerDag) : null,
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  }));
};

export const getCarById = async id => {
  const c = await carData.findById(id); // ⬅️ kräver att findById finns!
  if (!c) return null;
  return {
    ...c,
    prisPerDag: c.prisPerDag != null ? Number(c.prisPerDag) : null,
    displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
  };
};
