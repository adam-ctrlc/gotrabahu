import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileText,
  UserPlus,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminProvider';
import Modal from '../../components/Modal'; // Import Modal component
import UserView from '../UserView'; // Import UserView component

const getInitials = (firstName, lastName) => {
  return `${firstName ? firstName.charAt(0) : ''}${
    lastName ? lastName.charAt(0) : ''
  }`.toUpperCase();
};

export function Dashboard() {
  const {
    users,
    subscriptions,
    jobs,
    applications,
    loading,
    error,
    refetch,
    fetchAllAdmins,
    fetchAllEmployees,
    fetchAllEmployers,
    adminsData,
    employeesData,
    employersData,
    totalUsersCount,
    totalEmployersCount,
    totalAdminsCount,
  } = useAdmin();

  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingEmployers, setLoadingEmployers] = useState(false);

  const [showAllAdmins, setShowAllAdmins] = useState(false);
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [showAllEmployers, setShowAllEmployers] = useState(false);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  console.log('Dashboard  - users from useAdmin:', users); // Debug log

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen w-full'>
        <div className='text-center space-y-4 w-full px-4'>
          <div className='h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto'></div>
          <div className='h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto'></div>

          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse w-full'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'></div>
                  <div className='flex-1'>
                    <div className='h-6 bg-gray-200 rounded w-24 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-16'></div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse w-full'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'></div>
                  <div className='flex-1'>
                    <div className='h-6 bg-gray-200 rounded w-24 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-16'></div>
                    <div className='h-3 bg-gray-200 rounded w-20 mt-1'></div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <section
                key={sectionIndex}
                className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse w-full'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='h-6 bg-gray-200 rounded w-32'></div>
                  <div className='h-4 bg-gray-200 rounded w-16'></div>
                </div>
                <div className='space-y-4 w-full'>
                  {Array.from({ length: 3 }).map((_, cardIndex) => (
                    <div
                      key={cardIndex}
                      className='bg-gray-100 rounded-lg p-4 animate-pulse w-full'
                    >
                      <div className='flex items-start gap-3'>
                        <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                        <div className='flex-1 space-y-2'>
                          <div className='h-4 bg-gray-200 rounded w-40'></div>
                          <div className='h-3 bg-gray-200 rounded w-24'></div>
                          <div className='grid grid-cols-2 gap-2 w-full'>
                            <div className='h-3 bg-gray-200 rounded'></div>
                            <div className='h-3 bg-gray-200 rounded'></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 mt-6 animate-pulse w-full'>
            <div className='flex items-center justify-between mb-4'>
              <div className='h-6 bg-gray-200 rounded w-40'></div>
              <div className='h-4 bg-gray-200 rounded w-16'></div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div
                  key={cardIndex}
                  className='bg-gray-100 rounded-lg p-4 animate-pulse w-full'
                >
                  <div className='flex items-start gap-3'>
                    <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 bg-gray-200 rounded w-40'></div>
                      <div className='h-3 bg-gray-200 rounded w-24'></div>
                      <div className='grid grid-cols-2 gap-2 w-full'>
                        <div className='h-3 bg-gray-200 rounded'></div>
                        <div className='h-3 bg-gray-200 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 mx-auto mb-4 text-red-600' />
          <p className='text-gray-600 mb-4'>Failed to load admin dashboard</p>
          <button
            onClick={refetch}
            className='mt-4 px-4 py-2 bg-accent-600 text-white rounded hover:bg-accent-700 flex items-center gap-2'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Create dashboard data structure from context
  const dashboardData = {
    data: {
      admin: adminsData || [],
      users: employeesData.data || [],
      employers: employersData.data || [],
      total_users: totalUsersCount || 0,
      total_employers: totalEmployersCount || 0,
      total_jobs: jobs?.length || 0,
      total_applications: applications?.length || 0,
      new_users:
        (employeesData.data || []).filter((user) => {
          const createdDate = new Date(user.created_at);
          const currentDate = new Date();
          const monthAgo = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            currentDate.getDate()
          );
          return createdDate >= monthAgo;
        }).length || 0,
      new_jobs:
        jobs?.filter((job) => {
          const createdDate = new Date(job.created_at);
          const currentDate = new Date();
          const monthAgo = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            currentDate.getDate()
          );
          return createdDate >= monthAgo;
        }).length || 0,
      new_applications:
        applications?.filter((application) => {
          const createdDate = new Date(application.created_at);
          const currentDate = new Date();
          const monthAgo = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            currentDate.getDate()
          );
          return createdDate >= monthAgo;
        }).length || 0,
    },
  };

  console.log(
    'Dashboard - dashboardData.data.users:',
    dashboardData.data.users
  ); // Debug log
  console.log(
    'Dashboard - dashboardData.data.employers:',
    dashboardData.data.employers
  ); // Debug log

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGenderColor = (gender) => {
    return gender === 'male'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-pink-100 text-pink-800';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      case 'employeer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const UserCompactListItem = ({ user }) => (
    <div className='flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors text-sm w-full'>
      <div className='flex items-center gap-2'>
        <img
          src={
            user.profile_picture ||
            `https://placehold.co/32x32/e2e8f0/808080?text=${getInitials(
              user.first_name,
              user.last_name
            )}`
          }
          alt={`${user.first_name} ${user.last_name}`}
          className='w-8 h-8 rounded-full object-cover'
        />
        <div>
          <span className='font-medium text-gray-800 mr-1'>
            {user.first_name} {user.last_name}
          </span>
          <span className='text-gray-600'>@{user.username}</span>
        </div>
      </div>
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
          user.role
        )}`}
      >
        {user.role}
      </span>
    </div>
  );

  const UserCard = ({ user, showRole = true }) => {
    const profilePictureUrl = user.profile_picture
      ? user.profile_picture
      : `https://placehold.co/150x150/e2e8f0/808080?text=${getInitials(
          user.first_name,
          user.last_name
        )}`;

    return (
      <div className='bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors'>
        <div className='flex items-start gap-3'>
          <img
            src={profilePictureUrl}
            alt={`${user.first_name} ${user.last_name}`}
            className='w-12 h-12 rounded-full object-cover'
          />
          <div className='flex-1'>
            <div className='flex items-start justify-between mb-2'>
              <div>
                <h3 className='font-semibold text-gray-800'>
                  {user.first_name} {user.last_name}
                </h3>
                <p className='text-sm text-gray-600'>@{user.username}</p>
              </div>
              <div className='flex gap-1'>
                <button
                  className='p-1 text-gray-400 hover:text-accent-600 transition-colors'
                  onClick={() => {
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                >
                  <Eye className='w-4 h-4' />
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3'>
              <div>Phone: {user.phone}</div>
              <div>City: {user.city}</div>
              <div>Born: {formatDate(user.birth_date)}</div>
              <div className='flex gap-2'>
                {showRole && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(
                    user.gender
                  )}`}
                >
                  {user.gender}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleViewAll = async (type) => {
    try {
      if (type === 'admin') {
        if (!showAllAdmins) {
          setLoadingAdmins(true);
          await fetchAllAdmins();
          setShowAllAdmins(true);
        } else {
          setShowAllAdmins(false);
        }
      } else if (type === 'users') {
        if (!showAllEmployees) {
          setLoadingEmployees(true);
          await fetchAllEmployees();
          setShowAllEmployees(true);
        } else {
          setShowAllEmployees(false);
        }
      } else if (type === 'employers') {
        if (!showAllEmployers) {
          setLoadingEmployers(true);
          await fetchAllEmployers();
          setShowAllEmployers(true);
        } else {
          setShowAllEmployers(false);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch all ${type}:`, err);
    } finally {
      if (type === 'admin') {
        setLoadingAdmins(false);
      } else if (type === 'users') {
        setLoadingEmployees(false);
      } else if (type === 'employers') {
        setLoadingEmployers(false);
      }
    }
  };

  return (
    <main className='w-full p-4 md:p-6'>
      <header className='mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
          Admin Dashboard
        </h1>
        <p className='text-gray-600'>
          Manage users, employees, and employers across the platform
        </p>
      </header>

      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <Users className='w-6 h-6 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Users</p>
              <p className='text-2xl font-bold text-gray-800'>
                {dashboardData.data.total_users}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
              <Building2 className='w-6 h-6 text-orange-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Employers</p>
              <p className='text-2xl font-bold text-gray-800'>
                {dashboardData.data.total_employers}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center'>
              <Briefcase className='w-6 h-6 text-accent-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Jobs</p>
              <p className='text-2xl font-bold text-gray-800'>
                {dashboardData.data.total_jobs}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <FileText className='w-6 h-6 text-purple-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Applications</p>
              <p className='text-2xl font-bold text-gray-800'>
                {dashboardData.data.total_applications}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
              <UserPlus className='w-6 h-6 text-emerald-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>New Users</p>
              <p className='text-2xl font-bold text-gray-800'>
                {dashboardData.data.new_users}
              </p>
              <p className='text-xs text-emerald-600'>This month</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center'>
              <Plus className='w-6 h-6 text-cyan-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>New Jobs</p>
              <p className='text-2xl font-bold text-gray-800'>
                {dashboardData.data.new_jobs}
              </p>
              <p className='text-xs text-cyan-600'>This month</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center'>
              <TrendingUp className='w-6 h-6 text-indigo-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>New Applications</p>
              <p className='text-2xl font-bold text-gray-800'>
                {dashboardData.data.new_applications}
              </p>
              <p className='text-xs text-indigo-600'>This month</p>
            </div>
          </div>
        </div>
      </section>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <section className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-800'>Admin Users</h2>
            <span className='text-sm text-gray-500'>
              {totalAdminsCount} total
            </span>
          </div>
          <div className={`space-y-${showAllAdmins ? '3' : '4'}`}>
            {(showAllAdmins ? adminsData : adminsData?.slice(0, 3)).map(
              (admin) =>
                showAllAdmins ? (
                  <UserCompactListItem key={admin.id} user={admin} />
                ) : (
                  <UserCard key={admin.id} user={admin} showRole={false} />
                )
            )}
          </div>
          {adminsData?.length > 3 && (
            <div className='mt-4 text-center'>
              <button
                onClick={() => handleViewAll('admin')}
                className='text-blue-600 hover:text-blue-700 text-sm font-medium'
                disabled={loadingAdmins}
              >
                {loadingAdmins
                  ? 'Loading...'
                  : showAllAdmins
                  ? `View Less Admins`
                  : `View All Admins (${totalAdminsCount})`}
              </button>
            </div>
          )}
        </section>

        <section className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-800'>
              Recent Employees
            </h2>
            <span className='text-sm text-gray-500'>
              {totalUsersCount} total
            </span>
          </div>
          <div className={`space-y-${showAllEmployees ? '3' : '4'}`}>
            {(showAllEmployees
              ? employeesData.data
              : employeesData.data?.slice(0, 3)
            ).map((employee) =>
              showAllEmployees ? (
                <UserCompactListItem key={employee.id} user={employee} />
              ) : (
                <UserCard key={employee.id} user={employee} showRole={false} />
              )
            )}
          </div>
          <div className='mt-4 text-center'>
            <button
              onClick={() => handleViewAll('users')}
              className='text-blue-600 hover:text-blue-700 text-sm font-medium'
              disabled={loadingEmployees}
            >
              {loadingEmployees
                ? 'Loading...'
                : showAllEmployees
                ? `View Less Employees`
                : `View All Employees (${totalUsersCount})`}
            </button>
          </div>
        </section>
      </div>

      <section className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 mt-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>
            Recent Employers
          </h2>
          <span className='text-sm text-gray-500'>
            {totalEmployersCount} total
          </span>
        </div>
        <div
          className={`grid grid-cols-1 ${
            showAllEmployers
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-4`}
        >
          {(showAllEmployers
            ? employersData.data
            : employersData.data?.slice(0, 3)
          ).map((employer) =>
            showAllEmployers ? (
              <UserCompactListItem key={employer.id} user={employer} />
            ) : (
              <UserCard key={employer.id} user={employer} showRole={false} />
            )
          )}
        </div>
        <div className='mt-4 text-center'>
          <button
            onClick={() => handleViewAll('employers')}
            className='text-blue-600 hover:text-blue-700 text-sm font-medium'
            disabled={loadingEmployers}
          >
            {loadingEmployers
              ? 'Loading...'
              : showAllEmployers
              ? `View Less Employers`
              : `View All Employers (${totalEmployersCount})`}
          </button>
        </div>
      </section>

      {selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onToggle={() => setIsModalOpen(false)}
          title={`User Details: ${selectedUser.first_name} ${selectedUser.last_name}`}
        >
          <UserView user={selectedUser} />
        </Modal>
      )}
    </main>
  );
}
