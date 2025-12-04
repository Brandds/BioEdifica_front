import axios from 'axios';
import { URL_API } from '../../constants/URL_API.';
import { storage } from '../../utils/storage';

const apiClient = axios.create({
  baseURL: URL_API, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // URLs públicas que não devem incluir token
    const publicUrls = [
      '/usuarios/criaUsuario',
      '/usuarios/login'
    ];
    
    // Verifica se a URL atual é pública
    const isPublicUrl = publicUrls.some(publicUrl => 
      config.url?.includes(publicUrl)
    );
    
    // Apenas adiciona o token se não for uma rota pública
    if (!isPublicUrl) {
      const token = storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
