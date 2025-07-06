import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message;
      console.error(
        'Unauthorized access - Clearing token and redirecting to login:',
        errorMessage
      );
      sessionStorage.removeItem('access_token');
      // window.location.href = '/';
    } else {
      console.error(
        'API error:',
        error.response?.data?.message || error.message
      );
    }
    return Promise.reject(error);
  }
);
