import axios from 'axios';

const API = axios.create({
  baseURL: 'http:
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getZones = () => API.get('/zones');
export const getZone = (id) => API.get(`/zones/${id}`);
export const createZone = (data) => API.post('/zones', data);
export const updateZone = (id, data) => API.put(`/zones/${id}`, data);
export const deleteZone = (id) => API.delete(`/zones/${id}`);

export const getSlotsByZone = (zoneId) => API.get(`/slots/${zoneId}`);
export const updateSlotStatus = (id, status) => API.patch(`/slots/${id}`, { status });

export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getAllBookings = () => API.get('/bookings');
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);

export default API;
