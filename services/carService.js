import * as carData from '../data/carData.js';

const normalize = c => ({
  ...c,
  prisPerDag: c.prisPerDag != null ? Number(c.prisPerDag) : null,
  displayName: `${c.marke ?? ''} ${c.modell ?? ''}`.trim(),
});

export const getAllCars = async (q = {}) => {
  const rows = await carData.findAll(q);
  return rows.map(normalize);
};

export const getCarById = async id => {
  const c = await carData.findById(id);
  return c ? normalize(c) : null;
};

export const createCar = async payload => {
  const { id } = await carData.create(payload);
  const c = await carData.findById(id);
  return normalize(c);
};

export const updateCar = async (id, payload) => {
  const changed = await carData.update(id, payload);
  if (!changed) return null;
  const c = await carData.findById(id);
  return normalize(c);
};

export const deleteCar = async id => {
  const deleted = await carData.remove(id);
  return deleted > 0;
};
