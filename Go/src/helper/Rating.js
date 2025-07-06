import { api } from '../lib/axios';

export async function getRating(jobId, userId) {
  try {
    const response = await api.get(
      `/jobs/user-applied/rate/${jobId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    throw error;
  }
}

export async function submitRating(jobId, userId, rating) {
  try {
    const response = await api.post(
      `/jobs/user-applied/rate/${jobId}/${userId}`,
      {
        rating: String(rating),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting user rating:', error);
    throw error;
  }
}

export async function updateRating(jobId, userId, rating) {
  try {
    const response = await api.put(
      `/jobs/user-applied/rate/${jobId}/${userId}`,
      {
        rating: String(rating),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user rating:', error);
    throw error;
  }
}

export async function deleteRating(jobId, userId) {
  try {
    const response = await api.delete(
      `/jobs/user-applied/rate/${jobId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting user rating:', error);
    throw error;
  }
}
