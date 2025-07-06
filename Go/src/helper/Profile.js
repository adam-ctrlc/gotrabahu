import { api } from '../lib/axios';

export async function me() {
  try {
    const response = await api.get('auth/me');
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching profile information:', error);
    throw error;
  }
}

export async function forgotPassword() {
  try {
    const response = await api.get('auth/forgot-password');
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching profile information:', error);
    throw error;
  }
}

export async function update(id, data) {
  try {
    const response = await api.put(`auth/update/${id}`, data);
    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error('Error updating profile information:', error);
    throw error;
  }
}

export async function history() {
  try {
    const response = await api.get(`auth/history`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error updating profile information:', error);
    throw error;
  }
}

export async function uploadProfilePicture(file) {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await api.post('auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}
