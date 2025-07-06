import { api } from '../../lib/axios';

export async function getJob(searchTerm = '') {
  try {
    const response = await api.get(`/jobs`, {
      params: { search: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    throw error;
  }
}

export async function getJobById(id) {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    throw error;
  }
}

export async function applyJob(id) {
  try {
    const response = await api.post(`/jobs/${id}/apply`);
    return response.data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
}

export async function cancelJob(id) {
  try {
    const response = await api.post(`/jobs/${id}/cancel-apply`);
    return response.data;
  } catch (error) {
    console.error('Error canceling job:', error);
    throw error;
  }
}

export async function getUserAppliedJobs() {
  try {
    const response = await api.get('/jobs/user-applied');
    return response.data;
  } catch (error) {
    console.error('Error fetching user applied jobs:', error);
    throw error;
  }
}

export async function updateJobStatus(id, status) {
  try {
    const response = await api.post(`/jobs/user-applied/${id}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
}

export async function rateEmployee(id, rating) {
  try {
    const response = await api.post(`/jobs/user-applied/rate/${id}`, {
      rating: rating,
    });
    return response.data;
  } catch (error) {
    console.error('Error rating employee:', error);
    throw error;
  }
}

export async function get_user_details(id) {
  try {
    const response = await api.get(`/jobs/user-details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}
