//customerService.js
import * as repo from '../data/customerData.js';

export const getAllCustomers = () => repo.findALL();
export const getCustomerById = id => repo.findById(id);
