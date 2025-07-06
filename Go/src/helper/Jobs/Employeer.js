import { api } from '../../lib/axios';

// Get all jobs for employer
export async function getEmployerJobs() {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    throw error;
  }
}

// Create a new job
export async function createJob(data) {
  try {
    const response = await api.post('/jobs', data);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

// Get single job details
export async function getJobById(id) {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    throw error;
  }
}

// End a job
export async function endJob(id) {
  try {
    const response = await api.post(`/jobs/${id}/end`);
    return response.data;
  } catch (error) {
    console.error('Error ending job:', error);
    throw error;
  }
}
export async function updateJob(id, data) {
  try {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

export async function deleteJob(id) {
  try {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

export async function userApplied() {
  try {
    const response = await api.get('/jobs/user-applied');
    return response.data;
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    throw error;
  }
}

export async function userAppliedById(id) {
  try {
    const response = await api.get(`/jobs/user-details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applied job by ID:', error);
    throw error;
  }
}

export async function getUserProfileDetails(id) {
  try {
    const response = await api.get(`/jobs/user-profile/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile details:', error);
    throw error;
  }
}

// Get all users who applied to employer's jobs
export async function getAllUserApplied() {
  try {
    const response = await api.get('/jobs/user-applied');
    return response.data;
  } catch (error) {
    console.error('Error fetching all applied jobs:', error);
    throw error;
  }
}

export async function updateUserApplied(id, data) {
  try {
    // Ensure the status field is a string
    if (data && data.status && typeof data.status !== 'string') {
      data.status = String(data.status); // Convert to string if not already
    }
    const response = await api.post(`/jobs/user-applied/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating applied job:', error);
    throw error;
  }
}

export async function getRateUserApplied(jobId, userId) {
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

export async function postRateUserApplied(jobId, userId, data) {
  try {
    // Ensure the rating field is a string
    if (data && data.rating && typeof data.rating !== 'string') {
      data.rating = String(data.rating);
    }
    const response = await api.post(
      `/jobs/user-applied/rate/${jobId}/${userId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error posting user rating:', error);
    throw error;
  }
}

export async function updateRateUserApplied(jobId, userId, data) {
  try {
    // Ensure the rating field is a string
    if (data && data.rating && typeof data.rating !== 'string') {
      data.rating = String(data.rating);
    }
    const response = await api.put(
      `/jobs/user-applied/rate/${jobId}/${userId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user rating:', error);
    throw error;
  }
}

export async function deleteRateUserApplied(jobId, userId) {
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

// Get user applications for a specific job
export async function getUserApplications(jobId) {
  try {
    const response = await api.get('/jobs/user-applied');
    // Filter applications by job_id on the frontend since there's no specific backend endpoint
    // The API returns paginated data, so we need to access response.data.data.data
    const allApplications = response.data?.data?.data || [];
    console.log('Sample application object:', allApplications[0]);
    console.log('Looking for job_id:', jobId, 'Type:', typeof jobId);
    const jobApplications = allApplications.filter((app) => {
      console.log(
        'App job_id:',
        app.job_id,
        'Type:',
        typeof app.job_id,
        'Match:',
        app.job_id === parseInt(jobId)
      );
      return app.job_id === parseInt(jobId);
    });
    return {
      success: true,
      data: jobApplications,
    };
  } catch (error) {
    console.error('Error fetching user applications for job:', error);
    throw error;
  }
}

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
