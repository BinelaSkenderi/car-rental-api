import * as repo from '../data/customerData.js';

export const createCustomer = async payload => {
  const { id } = await repo.create(payload);
  return repo.findById(id);
};

export const updateCustomer = async (id, payload) => {
  const changed = await repo.update(id, payload);
  if (!changed) return null;
  return repo.findById(id);
};

export const deleteCustomer = async id => {
  const deleted = await repo.remove(id);
  return deleted > 0;
};
