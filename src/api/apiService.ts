import axios from 'axios';

const BASE_URL = 'http://localhost:5116/api'; 

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const apiService = {
  get: async (url: string, params?: any, headers?: any) => {
    try {
      const response = await api.get(url, {
        params,
        headers,
      });
      return response.data;
    } catch (error: any) {
      throw error.response || error;
    }
  },

  post: async (url: string, data: any, headers?: any) => {
    try {
      const response = await api.post(url, data, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      throw error.response || error;
    }
  },
};

export default apiService;
