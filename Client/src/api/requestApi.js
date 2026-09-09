// כל הקריאות למשאב /request בשרת (Api/routers/request.js) מרוכזות כאן.
import api from './axios.js';

export const saveDraft = async (formData) => {
  const { data } = await api.post('/request/saveDraft', formData);
  return data;
};

export const submitRequest = async (formData) => {
  const { data } = await api.post('/request/submitRequest', formData);
  return data;
};

export const getRequestStatus = async () => {
  const { data } = await api.get('/request/getRequestStatus');
  return data;
};

export const getActiveDraft = async () => {
  const { data } = await api.get('/request/getActiveDraft');
  return data;
};

export const getUnapprovedRequests = async (params) => {
  const { data } = await api.get('/request/getUnapprovedRequests', { params });
  return data;
};

export const getRequestDetails = async (requestId) => {
  const { data } = await api.get(`/request/getRequestDetails/${requestId}`);
  return data;
};

export const getRequestFile = async (requestId, fileKey) => {
  const { data } = await api.get(`/request/getRequestFile/${requestId}/${fileKey}`, {
    responseType: 'blob'
  });
  return data;
};

export const changeStatus = async (requestId, status) => {
  const { data } = await api.put(`/request/changeStatus/${requestId}`, { status });
  return data;
};
