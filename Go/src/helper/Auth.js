import { api } from '../lib/axios.js';

export async function login(data) {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      console.log('Error message:', error.response.data);
    }
    throw error;
  }
}

export async function register(data) {
  try {
    const response = await api.post('/auth/register', data);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.response?.data?.message) {
      console.log('Error message:', error.response.data);
    }
    throw error;
  }
}

export async function forgotPasswordStep1(data) {
  try {
    const response = await api.post('/auth/forgot-password', {
      ...data,
      step: 1
    });
    return response.data;
  } catch (error) {
    console.error('Error during forgot password step 1:', error);
    if (error.response?.data?.message) {
      console.log('Error message:', error.response.data);
    }
    throw error;
  }
}

export async function forgotPasswordStep2(data) {
  try {
    const response = await api.post('/auth/forgot-password', {
      ...data,
      step: 2
    });
    return response.data;
  } catch (error) {
    console.error('Error during forgot password step 2:', error);
    if (error.response?.data?.message) {
      console.log('Error message:', error.response.data);
    }
    throw error;
  }
}

export async function forgotPasswordStep3(data) {
  try {
    const response = await api.post('/auth/forgot-password', {
      ...data,
      step: 3
    });
    return response.data;
  } catch (error) {
    console.error('Error during forgot password step 3:', error);
    if (error.response?.data?.message) {
      console.log('Error message:', error.response.data);
    }
    throw error;
  }
}

export async function logout() {
  sessionStorage.removeItem('access_token');
  delete api.defaults.headers.common['Authorization'];
}
