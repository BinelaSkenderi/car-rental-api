import * as repo from '../data/bookingData.js';

const toYMD = iso => (iso ? new Date(iso).toISOString().slice(0, 10) : null);
const norm = r =>
  r && {
    ...r,
    totalPris: r.totalPris != null ? Number(r.totalPris) : null,
    startDatum: toYMD(r.startDatum),
    slutDatum: toYMD(r.slutDatum),
  };

export const getAllBookings = async (q = {}) => {
  const rows = await repo.findAll(q);
  return rows.map(norm);
};

export const createBooking = async payload => {
  const { carId, customerId, startDatum, slutDatum, totalPris } = payload;

  if (!carId || !customerId || !startDatum || !slutDatum || totalPris == null) {
    const err = new Error(
      'carId, customerId, startDatum, slutDatum, totalPris krävs'
    );
    err.status = 400;
    throw err;
  }
  if (startDatum > slutDatum) {
    const err = new Error('startDatum får inte vara efter slutDatum');
    err.status = 400;
    throw err;
  }
  const overlap = await repo.hasOverlap({
    carId,
    from: startDatum,
    to: slutDatum,
  });
  if (overlap) {
    const err = new Error('Överlappande bokning finns redan för denna bil');
    err.status = 409;
    throw err;
  }

  const { id } = await repo.create({
    carId,
    customerId,
    startDatum,
    slutDatum,
    totalPris,
  });
  const row = await repo.findById(id);
  return norm(row);
};

export const updateBooking = async (id, payload) => {
  const { carId, customerId, startDatum, slutDatum, totalPris } = payload;

  if (!carId || !customerId || !startDatum || !slutDatum || totalPris == null) {
    const err = new Error(
      'carId, customerId, startDatum, slutDatum, totalPris krävs'
    );
    err.status = 400;
    throw err;
  }
  if (startDatum > slutDatum) {
    const err = new Error('startDatum får inte vara efter slutDatum');
    err.status = 400;
    throw err;
  }
  const overlap = await repo.hasOverlap({
    carId,
    from: startDatum,
    to: slutDatum,
    excludeId: id,
  });
  if (overlap) {
    const err = new Error('Överlappande bokning finns redan för denna bil');
    err.status = 409;
    throw err;
  }

  const changed = await repo.update(id, {
    carId,
    customerId,
    startDatum,
    slutDatum,
    totalPris,
  });
  if (!changed) return null;
  const row = await repo.findById(id);
  return norm(row);
};

export const deleteBooking = async id => {
  const deleted = await repo.remove(id);
  return deleted > 0;
};
