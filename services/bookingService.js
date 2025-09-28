//bookingService.js
import * as repo from '../data/bookingData.js';
export const getAllBookings = (q = {}) => repo.findAll(q);
