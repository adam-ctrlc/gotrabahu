import { createContext, useContext, useState, useEffect } from 'react';
import {
  getJob,
  applyJob,
  cancelJob,
  getUserAppliedJobs,
  updateJobStatus,
} from '../helper/Jobs/Employee';
import { me } from '../helper/Profile';
import {
  getSubscriptionMethods,
  getUserSubscriptionHistory,
  getCurrentUserSubscription,
} from '../helper/SubscriptionMethods/SubscriptionMethods';
import {
  getComments,
  createComment,
  deleteComment,
} from '../helper/Comment/Comment';
import { useAuth } from './AuthProvider';

const EmployeeJobContext = createContext();

export function useEmployeeJob() {
  const context = useContext(EmployeeJobContext);
  if (!context) {
    throw new Error(
      'useEmployeeJob must be used within an EmployeeJobProvider'
    );
  }
  return context;
}

export function EmployeeJobProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Map());

  const fetchData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [
        jobsResponse,
        profileResponse,
        subscriptionsResponse,
        appliedJobsResponse,
      ] = await Promise.all([
        getJob(),
        me(),
        getCurrentUserSubscription(),
        getUserAppliedJobs(),
      ]);

      if (jobsResponse && jobsResponse.success && jobsResponse.data) {
        const jobsWithEmployerName = jobsResponse.data.map((job) => ({
          ...job,
          employer_full_name: job.employer
            ? `${job.employer.first_name} ${job.employer.last_name}`
            : null,
        }));
        setJobs(jobsWithEmployerName);
      }

      if (profileResponse && profileResponse.success) {
        setProfile(profileResponse.data);
      }

      if (subscriptionsResponse && subscriptionsResponse.success) {
        setSubscriptions(subscriptionsResponse.data);
      }

      if (appliedJobsResponse && appliedJobsResponse.success) {
        const appliedJobsMap = new Map(
          appliedJobsResponse.data.map((job) => [job.job_id, job])
        );
        setAppliedJobs(appliedJobsMap);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setError(error);
    } finally {
      setLoading(false);
      console.log('EmployeeJobProvider - Final loading state:', false);
      console.log(
        'EmployeeJobProvider - Final subscriptions state:',
        subscriptions
      );
      console.log('EmployeeJobProvider - Final jobs state:', jobs);
      console.log(
        'EmployeeJobProvider - Final appliedJobs state:',
        appliedJobs
      );
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      const response = await applyJob(jobId);
      if (response && response.success) {
        if (response.data) {
          setAppliedJobs((prevMap) =>
            new Map(prevMap).set(jobId, response.data)
          );
        } else {
          const appliedJobsResponse = await getUserAppliedJobs();
          if (appliedJobsResponse && appliedJobsResponse.success) {
            setAppliedJobs(
              new Map(appliedJobsResponse.data.map((job) => [job.job_id, job]))
            );
          }
        }
        console.log(
          'EmployeeJobProvider - appliedJobs after apply:',
          appliedJobs
        );
        return response;
      }
      throw new Error(response?.message || 'Failed to apply for job');
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  };

  const handleCancelJob = async (jobId) => {
    try {
      const response = await cancelJob(jobId);
      if (response && response.success) {
        setAppliedJobs((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.delete(jobId);
          return newMap;
        });
        console.log(
          'EmployeeJobProvider - appliedJobs after cancel:',
          appliedJobs
        );
        return response;
      }
      throw new Error(response?.message || 'Failed to cancel job application');
    } catch (error) {
      console.error('Error canceling job application:', error);
      throw error;
    }
  };

  const handleCreateComment = async (jobId, comment) => {
    try {
      const response = await createComment(jobId, comment);
      if (response && response.success) {
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
      if (response && response.success) {
        return response;
      }
      throw new Error(response?.message || 'Failed to delete comment');
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  const handleGetComments = async (jobId) => {
    try {
      const response = await getComments(jobId);
      if (response && response.success) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const handleUpdateJobStatus = async (jobId, status) => {
    try {
      setLoading(true);
      const response = await updateJobStatus(jobId, status);
      if (response && response.success) {
        await fetchData();
        return response;
      }
      throw new Error(response?.message || 'Failed to update job status');
    } catch (error) {
      console.error('Error updating job status:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  return (
    <EmployeeJobContext.Provider
      value={{
        jobs,
        setJobs,
        profile,
        subscriptions,
        loading,
        error,
        setError,
        appliedJobs,
        setAppliedJobs,
        applyJob: handleApplyJob,
        cancelJob: handleCancelJob,
        createComment: handleCreateComment,
        deleteComment: handleDeleteComment,
        getComments: handleGetComments,
        updateJobStatus: handleUpdateJobStatus,
      }}
    >
      {children}
    </EmployeeJobContext.Provider>
  );
}
