import { api } from '../lib/axios';

export async function getAllUsers(
  usersPerPage = null,
  employersPerPage = null,
  employeePage = null,
  employerPage = null
) {
  try {
    const params = {};
    if (usersPerPage !== null) {
      params.users_per_page = usersPerPage;
    }
    if (employersPerPage !== null) {
      params.employers_per_page = employersPerPage;
    }
    if (employeePage !== null) {
      params.employee_page = employeePage;
    }
    if (employerPage !== null) {
      params.employer_page = employerPage;
    }

    const response = await api.get('/admin', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

export async function createUser(data) {
  try {
    const response = await api.post('/admin', data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id, data) {
  try {
    const response = await api.put(`/admin/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Job CRUD Operations
export async function getAllJobs() {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
}

export async function createJob(data) {
  try {
    const response = await api.post('/jobs', data);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
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

export async function getJobById(id) {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    throw error;
  }
}

export async function deleteJob(id) {
  try {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}

export async function updateJobStatus(id, status) {
  try {
    const response = await api.patch(`/jobs/${id}/status`, {
      life_cycle: status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
}
