import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthProvider';
import {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  getAllJobs,
  createJob,
  updateJob,
  getJobById,
  deleteJob,
  updateJobStatus,
} from '../helper/Admin';
import {
  getSubscriptions,
  approveSubscription,
  rejectSubscription,
  getSubscriptionById,
} from '../helper/Admin/GetSubscriptions';
import { userApplied } from '../helper/Jobs/Employeer';
import { getJob } from '../helper/Jobs/Employee';

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [adminsData, setAdminsData] = useState(null);
  const [employeesData, setEmployeesData] = useState(null);
  const [employersData, setEmployersData] = useState(null);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalEmployersCount, setTotalEmployersCount] = useState(0);
  const [totalAdminsCount, setTotalAdminsCount] = useState(0);

  const fetchData = useCallback(
    async (
      usersPerPage = 3,
      employersPerPage = 3,
      showGlobalLoading = true,
      employeePage = 1,
      employerPage = 1
    ) => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        if (showGlobalLoading) {
          setLoading(true);
        }
        setError(null);

        const [
          usersResponse,
          subscriptionsResponse,
          jobsResponse,
          applicationsResponse,
        ] = await Promise.all([
          getAllUsers(
            usersPerPage,
            employersPerPage,
            employeePage,
            employerPage
          ),
          getSubscriptions(),
          getJob(),
          userApplied(),
        ]);

        console.log('AdminProvider - usersResponse:', usersResponse); // Debug log
        console.log('AdminProvider - usersResponse.data:', usersResponse.data); // Debug log

        if (usersResponse && usersResponse.success) {
          const allUsers = [
            ...(usersResponse.data.admin || []),
            ...(Array.isArray(usersResponse.data.users)
              ? usersResponse.data.users
              : usersResponse.data.users.data || []),
            ...(Array.isArray(usersResponse.data.employers)
              ? usersResponse.data.employers
              : usersResponse.data.employers.data || []),
          ];
          setUsers(allUsers);
          setAdminsData(usersResponse.data.admin || []);
          setEmployeesData(
            usersResponse.data.users.data
              ? usersResponse.data.users
              : { data: usersResponse.data.users }
          );
          setEmployersData(
            usersResponse.data.employers.data
              ? usersResponse.data.employers
              : { data: usersResponse.data.employers }
          );
          setTotalUsersCount(usersResponse.data.total_users || 0);
          setTotalEmployersCount(usersResponse.data.total_employers || 0);
          setTotalAdminsCount(usersResponse.data.admin?.length || 0);
        }

        if (subscriptionsResponse && subscriptionsResponse.success) {
          setSubscriptions(subscriptionsResponse.data);
        }

        if (jobsResponse && jobsResponse.success) {
          setJobs(jobsResponse.data?.data || jobsResponse.data);
        }

        if (applicationsResponse && applicationsResponse.success) {
          setApplications(
            applicationsResponse.data?.data || applicationsResponse.data
          );
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error);
      } finally {
        if (showGlobalLoading) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated, getAllUsers, getSubscriptions, getJob, userApplied]
  );

  const fetchAllAdmins = async () => {
    await fetchData('all', null, false); // Fetch all admins, no pagination for employers, no global loading
  };

  const fetchAllEmployees = async () => {
    await fetchData('all', null, false); // Fetch all employees, no pagination for employers, no global loading
  };

  const fetchAllEmployers = async () => {
    await fetchData(null, 'all', false); // Fetch all employers, no pagination for users, no global loading
  };

  useEffect(() => {
    fetchData(3, 3, true);
  }, [isAuthenticated]);

  // CRUD operations for users
  const createNewUser = async (userData) => {
    try {
      setLoading(true);
      const response = await createUser(userData);
      if (response && response.success) {
        await fetchData(
          undefined,
          undefined,
          false,
          employeesData.current_page,
          employersData.current_page
        ); // Refresh data, keep current pagination
        return response;
      }
      throw new Error(response?.message || 'Failed to create user');
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserById = async (id, userData) => {
    try {
      setLoading(true);
      const response = await updateUser(id, userData);
      if (response && response.success) {
        await fetchData(
          undefined,
          undefined,
          false,
          employeesData.current_page,
          employersData.current_page
        ); // Refresh data, keep current pagination
        return response;
      }
      throw new Error(response?.message || 'Failed to update user');
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUserById = async (id) => {
    try {
      setLoading(true);
      const response = await deleteUser(id);
      if (response && response.success) {
        await fetchData(
          undefined,
          undefined,
          false,
          employeesData.current_page,
          employersData.current_page
        ); // Refresh data, keep current pagination
        return response;
      }
      throw new Error(response?.message || 'Failed to delete user');
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Job CRUD Operations
  const createNewJob = async (jobData) => {
    try {
      await createJob(jobData);
      await fetchData(
        undefined,
        undefined,
        false,
        employeesData.current_page,
        employersData.current_page
      ); // Refresh data after successful creation
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  const updateJobById = async (jobId, jobData) => {
    try {
      await updateJob(jobId, jobData);
      await fetchData(
        undefined,
        undefined,
        false,
        employeesData.current_page,
        employersData.current_page
      ); // Refresh data after successful update
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const deleteJobById = async (jobId) => {
    try {
      await deleteJob(jobId);
      await fetchData(
        undefined,
        undefined,
        false,
        employeesData.current_page,
        employersData.current_page
      ); // Refresh data after successful deletion
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const getJobDetails = async (jobId) => {
    try {
      const response = await getJobById(jobId);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  };

  const updateJobStatusById = async (jobId, status) => {
    try {
      await updateJobStatus(jobId, status);
      await fetchData(
        undefined,
        undefined,
        false,
        employeesData.current_page,
        employersData.current_page
      ); // Refresh data after successful status update
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  };

  // Subscription CRUD Operations
  const approveSubscriptionById = async (
    userId,
    subscriptionId,
    tokenCount
  ) => {
    try {
      const response = await approveSubscription(
        userId,
        subscriptionId,
        tokenCount
      );
      if (response.success) {
        // Optimistically update subscriptions or refetch
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId ? { ...sub, status: 'active' } : sub
          )
        );
        // Also refresh user data in case tokens were updated
        await fetchData(
          undefined,
          undefined,
          false,
          employeesData.current_page,
          employersData.current_page
        );
      }
      return response;
    } catch (error) {
      console.error('Error approving subscription:', error);
      throw error;
    }
  };

  const rejectSubscriptionById = async (
    userId,
    subscriptionId,
    status = 'inactive'
  ) => {
    try {
      const response = await rejectSubscription(userId, subscriptionId, status);
      if (response.success) {
        // Optimistically update subscriptions or refetch
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId ? { ...sub, status: 'inactive' } : sub
          )
        );
        await fetchData(
          undefined,
          undefined,
          false,
          employeesData.current_page,
          employersData.current_page
        ); // Refresh data
      }
      return response;
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      throw error;
    }
  };

  const getSubscriptionDetails = async (subscriptionId) => {
    try {
      const response = await getSubscriptionById(subscriptionId);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      throw error;
    }
  };

  const getUserDetails = async (id) => {
    try {
      const response = await getUserById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  const contextValue = {
    users,
    subscriptions,
    jobs,
    applications,
    loading,
    error,
    refetch: fetchData,
    createNewUser,
    updateUserById,
    deleteUserById,
    createNewJob,
    updateJobById,
    deleteJobById,
    getJobDetails,
    updateJobStatus: updateJobStatusById,
    approveSubscription: approveSubscriptionById,
    rejectSubscription: rejectSubscriptionById,
    getSubscriptionById: getSubscriptionDetails,
    getUserDetails,
    adminsData,
    employeesData,
    employersData,
    totalUsersCount,
    totalEmployersCount,
    totalAdminsCount,
    fetchAllAdmins,
    fetchAllEmployees,
    fetchAllEmployers,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}
