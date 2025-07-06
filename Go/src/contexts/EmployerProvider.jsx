import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useAuth } from './AuthProvider';
import {
  getEmployerJobs,
  createJob,
  updateJob,
  deleteJob,
  endJob,
  userApplied,
  getAllUserApplied,
  userAppliedById,
  getUserProfileDetails,
  updateUserApplied,
  getRateUserApplied,
  postRateUserApplied,
  updateRateUserApplied,
  deleteRateUserApplied,
  getUserApplications,
  getJobById,
} from '../helper/Jobs/Employeer';
import {
  getComments,
  createComment,
  deleteComment,
  deleteCommentAsPostOwner,
} from '../helper/Comment/Comment';

const EmployerContext = createContext();

export const useEmployer = () => {
  const context = useContext(EmployerContext);
  if (!context) {
    throw new Error('useEmployer must be used within an EmployerProvider');
  }
  return context;
};

export const EmployerProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedUsers, setAppliedUsers] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentJobApplicants, setCurrentJobApplicants] = useState(null);

  const fetchData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const [jobsResponse, appliedResponse] = await Promise.all([
        getEmployerJobs(),
        userApplied().catch(() => ({ data: [] })),
      ]);

      const jobsData = Array.isArray(jobsResponse)
        ? jobsResponse
        : jobsResponse?.data?.data || jobsResponse?.data || [];
      setJobs(jobsData);
      setAppliedUsers(appliedResponse?.data || []);
    } catch (err) {
      console.error('Error fetching employer data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  // Job CRUD operations
  const handleCreateJob = async (jobData) => {
    try {
      setLoading(true);
      const response = await createJob(jobData);
      if (response?.data) {
        setJobs((prevJobs) => [...prevJobs, response.data]);
      }
      await fetchData(); // Refresh the jobs list
      return response;
    } catch (error) {
      setError(error.message || 'Failed to create job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (jobId, jobData) => {
    try {
      setLoading(true);
      const response = await updateJob(jobId, jobData);
      if (response?.data) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, ...response.data } : job
          )
        );
      }
      await fetchData(); // Refresh the jobs list
      return response;
    } catch (error) {
      setError(error.message || 'Failed to update job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      setLoading(true);
      const response = await deleteJob(jobId);
      if (response.success) {
        await fetchData(); // Refresh data
        return response;
      }
      throw new Error(response.message || 'Failed to delete job');
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEndJob = async (jobId) => {
    try {
      setLoading(true);
      const response = await endJob(jobId);
      if (response.success) {
        await fetchData(); // Refresh data
        return response;
      }
      throw new Error(response.message || 'Failed to end job');
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User application management
  const handleUpdateUserApplication = async (applicationId, statusData) => {
    try {
      const response = await updateUserApplied(applicationId, statusData);
      if (response.success) {
        // After updating, refetch the specific job's applicants to ensure consistency
        // Use job_id from the response root level (not response.data.job_id)
        const jobId = response.job_id || response.data?.job_id;
        if (jobId) {
          await fetchJobApplicants(jobId);
        }
        return response;
      }
      throw new Error(response.message || 'Failed to update application');
    } catch (error) {
      console.error('Error updating user application:', error);
      throw error;
    }
  };

  const handleGetUserDetails = async (userId) => {
    try {
      const response = await userAppliedById(userId);
      return response;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  const handleGetUserProfileDetails = async (userId) => {
    try {
      const response = await getUserProfileDetails(userId);
      return response;
    } catch (error) {
      console.error('Error fetching user profile details:', error);
      throw error;
    }
  };

  // Rating management
  const handleRateUser = async (jobId, userId, ratingData) => {
    try {
      setLoading(true);
      const response = await postRateUserApplied(jobId, userId, ratingData);
      await fetchData(); // Refresh data
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRating = async (jobId, userId, ratingData) => {
    try {
      setLoading(true);
      const response = await updateRateUserApplied(jobId, userId, ratingData);
      await fetchData(); // Refresh data
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (jobId, userId) => {
    try {
      setLoading(true);
      const response = await deleteRateUserApplied(jobId, userId);
      await fetchData(); // Refresh data
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Comment management
  const handleGetComments = async (jobId) => {
    try {
      const response = await getComments(jobId);
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const handleCreateComment = async (jobId, comment) => {
    try {
      const response = await createComment(jobId, comment);
      if (response.success) {
        return response;
      }
      throw new Error(response?.message || 'Failed to create comment');
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        return response;
      }
      throw new Error(response?.message || 'Failed to delete comment');
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  const handleDeleteCommentAsPostOwner = async (commentId) => {
    try {
      const response = await deleteCommentAsPostOwner(commentId);
      if (response.success) {
        return response;
      }
      throw new Error(
        response?.message || 'Failed to delete comment as post owner'
      );
    } catch (error) {
      console.error('Error deleting comment as post owner:', error);
      throw error;
    }
  };

  // Get user applications for a specific job
  const handleGetUserApplications = useCallback(async (jobId) => {
    try {
      setLoading(true);
      const response = await getUserApplications(jobId);
      if (response.success) {
        setUserApplications(response.data);
        return response;
      }
      throw new Error(response?.message || 'Failed to fetch user applications');
    } catch (error) {
      console.error('Error fetching user applications:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetchJobById = async (jobId) => {
    try {
      setLoading(true);
      const response = await getJobById(jobId);
      if (response?.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch job details');
    } catch (error) {
      setError(error.message || 'Failed to fetch job details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch a single job with its applied users
  const fetchJobApplicants = useCallback(async (jobId) => {
    setLoading(true);
    try {
      const response = await getJobById(jobId);
      if (response.success) {
        setCurrentJobApplicants(response.data);

        // Fetch ratings for each applied user
        const applicantsWithRatings = await Promise.all(
          (response.applied_users || []).map(async (applicant) => {
            try {
              const ratingResponse = await getRateUserApplied(
                jobId,
                applicant.user_id
              );
              return {
                ...applicant,
                rating: ratingResponse?.data?.rating || 0, // Default to 0 if no rating
              };
            } catch (ratingError) {
              console.warn(
                `Failed to fetch rating for user ${applicant.user_id}:`,
                ratingError
              );
              return { ...applicant, rating: 0 }; // Return applicant with default rating on error
            }
          })
        );

        setUserApplications(applicantsWithRatings);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch job applicants');
        return null;
      }
    } catch (err) {
      console.error('Error fetching job applicants:', err);
      setError(err.message || 'Failed to fetch job applicants');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      jobs,
      appliedUsers,
      userApplications,
      loading,
      error,
      fetchData,
      refetch: fetchData, // Alias fetchData as refetch for consistency
      createJob: handleCreateJob,
      updateJob: handleUpdateJob,
      deleteJob: handleDeleteJob,
      endJob: handleEndJob,
      updateUserApplication: handleUpdateUserApplication,
      getUserDetails: handleGetUserDetails,
      getUserProfileDetails: handleGetUserProfileDetails,
      rateUser: handleRateUser,
      updateRating: handleUpdateRating,
      deleteRating: handleDeleteRating,
      getComments: handleGetComments,
      createComment: handleCreateComment,
      deleteComment: handleDeleteComment,
      deleteCommentAsPostOwner: handleDeleteCommentAsPostOwner,
      fetchJobById: handleFetchJobById,
      currentJobApplicants, // Expose currentJobApplicants
      fetchJobApplicants, // Expose fetchJobApplicants
    }),
    [
      jobs,
      appliedUsers,
      userApplications,
      loading,
      error,
      fetchData,
      handleCreateJob,
      handleUpdateJob,
      handleDeleteJob,
      handleEndJob,
      handleUpdateUserApplication,
      handleGetUserDetails,
      handleGetUserProfileDetails,
      handleRateUser,
      handleUpdateRating,
      handleDeleteRating,
      handleGetComments,
      handleCreateComment,
      handleDeleteComment,
      handleDeleteCommentAsPostOwner,
      handleFetchJobById,
      currentJobApplicants, // Add to dependency array
      fetchJobApplicants, // Add to dependency array
    ]
  );

  return (
    <EmployerContext.Provider value={contextValue}>
      {children}
    </EmployerContext.Provider>
  );
};

export default EmployerProvider;
