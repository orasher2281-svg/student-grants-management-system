// כל הקריאות למשאב /user בשרת (Api/routers/user.js) מרוכזות כאן.
import api from './axios.js';

export const register = async (payload) => {
  const { data } = await api.post('/user/register', payload);
  return data;
};

export const login = async (tz, password) => {
  const { data } = await api.post('/user/login', { tz, password });
  return data;
};

export const loginByToken = async () => {
  const { data } = await api.get('/user/loginByToken');
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get('/user/getUserProfile');
  return data;
};
