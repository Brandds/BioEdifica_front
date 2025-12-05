import axios from 'axios';
import { storage } from '../../utils/storage';
import { URL_API } from '../../constants/URL_API.';

const apiClient = axios.create({
  baseURL: URL_API, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Sessão expirada. Faça login novamente.');
      // Exemplo: redirecionar ou limpar storage
      // storage.clearAuth();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
