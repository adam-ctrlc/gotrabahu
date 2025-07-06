import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users as UsersIcon,
  Shield,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Phone,
  MapPin,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  Award,
  UserPlus,
  UserCheck,
  UserX,
  Lock,
  AtSign,
  Home,
  Building,
  Heart,
  Clock,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminProvider';
import Modal from '../../components/Modal';

export function Users() {
  const {
    loading,
    error,
    refetch,
    createNewUser,
    updateUserById,
    deleteUserById,
    getUserDetails,
    employeesData,
    employersData,
    adminsData,
    totalUsersCount,
    totalEmployersCount,
    totalAdminsCount,
    fetchAllAdmins,
    fetchAllEmployees,
    fetchAllEmployers,
  } = useAdmin();
  console.log('Users.jsx - totalAdminsCount:', totalAdminsCount);
  console.log('Users.jsx - totalUsersCount:', totalUsersCount);
  console.log('Users.jsx - totalEmployersCount:', totalEmployersCount);
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = '';
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    gender: '',
    birth_date: '',
    role: 'employee',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Reset current page when active tab changes
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    // Fetch data based on current page and active tab
    const fetchInitialData = async () => {
      if (activeTab === 'employees') {
        await refetch(10, undefined, true, currentPage, undefined);
      } else if (activeTab === 'employers') {
        await refetch(undefined, 10, true, undefined, currentPage);
      } else if (activeTab === 'admins') {
        await refetch('all', 'all', true, undefined, undefined);
      }
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    };
    fetchInitialData();
  }, [activeTab, currentPage, refetch, isInitialLoad]);

  // Loading state
  if (loading && isInitialLoad) {
    return (
      <div className='flex items-center justify-center min-h-screen w-full p-4 md:p-6'>
        <div className='text-center space-y-4 w-full px-4'>
          {/* Top stats section shimmer */}
          <section className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg border border-gray-200 p-4 animate-pulse w-full'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gray-200 rounded-lg'></div>
                  <div className='flex-1'>
                    <div className='h-6 bg-gray-200 rounded w-24 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-16'></div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Tabs and table section shimmer */}
          <div className='bg-white rounded-lg border border-gray-200 w-full animate-pulse'>
            <div className='border-b border-gray-200'>
              <nav className='flex px-4 py-3'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-8 bg-gray-200 rounded w-28 mx-2'
                  ></div>
                ))}
              </nav>
            </div>
            <div className='p-4 md:p-6'>
              <div className='h-10 bg-gray-200 rounded w-full mb-6'></div>{' '}
              {/* Search bar */}
              <div className='overflow-x-auto'>
                <div className='h-12 bg-gray-200 rounded w-full mb-4'></div>{' '}
                {/* Table header */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-20 bg-gray-100 rounded w-full mb-2'
                  ></div>
                ))}{' '}
                {/* Table rows */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for CRUD operations
  // if (loading && !isInitialLoad) {
  //   return (
  //     <div className='flex items-center justify-center min-h-screen'>
  //       <p className='text-gray-600'>Loading...</p>
  //     </div>
  //   );
  // }

  // Error state
  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 mx-auto mb-4 text-red-600' />
          <p className='text-gray-600 mb-4'>Failed to load users</p>
          <button
            onClick={refetch}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Create user data structure from context
  const userData = {
    success: true,
    message: 'Users fetched successfully',
    data: {
      admin: adminsData || [],
      users: {
        current_page: employeesData?.current_page || 1,
        data: employeesData?.data || [],
        last_page: employeesData?.last_page || 1,
        per_page: employeesData?.per_page || 0,
        total: employeesData?.total || 0,
      },
      employers: {
        current_page: employersData?.current_page || 1,
        data: employersData?.data || [],
        last_page: employersData?.last_page || 1,
        per_page: employersData?.per_page || 0,
        total: employersData?.total || 0,
      },
      total_users: totalUsersCount,
      total_employers: totalEmployersCount,
      total_admins: totalAdminsCount,
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const displayDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFullName = (user) => {
    return `${user.first_name} ${user.last_name}`;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className='w-4 h-4 text-red-600' />;
      case 'employee':
        return <User className='w-4 h-4 text-blue-600' />;
      case 'employeer':
        return <Briefcase className='w-4 h-4 text-green-600' />;
      default:
        return <User className='w-4 h-4 text-gray-600' />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'employee':
        return 'bg-accent-100 text-accent-800';
      case 'employeer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'employees':
        return {
          data: employeesData?.data || [],
          currentPage: employeesData?.current_page || 1,
          lastPage: employeesData?.last_page || 1,
          perPage: employeesData?.per_page || 0,
          total: employeesData?.total || 0,
        };
      case 'employers':
        return {
          data: employersData?.data || [],
          currentPage: employersData?.current_page || 1,
          lastPage: employersData?.last_page || 1,
          perPage: employersData?.per_page || 0,
          total: employersData?.total || 0,
        };
      case 'admins':
        return {
          data: adminsData || [],
          currentPage: 1,
          lastPage: 1,
          perPage: adminsData?.length || 0,
          total: adminsData?.length || 0,
        };
      default:
        return {
          data: [],
          currentPage: 1,
          lastPage: 1,
          perPage: 0,
          total: 0,
        };
    }
  };

  const getTabStats = () => {
    return {
      employees: totalUsersCount,
      employers: totalEmployersCount,
      admins: totalAdminsCount,
    };
  };

  const currentData = getCurrentData();
  const tabStats = getTabStats();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createNewUser(formData);
      if (result.success) {
        setShowCreateModal(false);
        setFormData({
          first_name: '',
          last_name: '',
          username: '',
          password: '',
          phone: '',
          address: '',
          city: '',
          gender: '',
          birth_date: '',
          role: 'employee',
        });
      }
    } catch (err) {
      console.error('Error creating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await updateUserById(selectedUser.id, formData);
      if (result.success) {
        setShowEditModal(false);
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error updating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setIsSubmitting(true);
      try {
        const result = await deleteUserById(userToDelete.id);
        if (result.success) {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }
      } catch (err) {
        console.error('Error deleting user:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleViewUser = async (user) => {
    try {
      const result = await getUserDetails(user.id);
      if (result) {
        setSelectedUser(result);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      gender: user.gender || '',
      birth_date: formatDate(user.birth_date) || '',
      role: user.role || 'employee',
      password: '', // Password should not be pre-filled for security
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className='w-full p-4 md:p-6'>
      <header className='mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
              User Management
            </h1>
            <p className='text-gray-600'>
              Manage and oversee all users, employees, and administrators
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium'
          >
            <Plus className='w-4 h-4' />
            Create New User
          </button>
        </div>
      </header>

      <section className='mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-accent-100 rounded-lg'>
                <UsersIcon className='w-6 h-6 text-accent-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Employees</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {tabStats.employees}
                </p>
              </div>
            </div>
          </article>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Briefcase className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Employers</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {tabStats.employers}
                </p>
              </div>
            </div>
          </article>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Shield className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Admins</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {tabStats.admins}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className='bg-white rounded-lg border border-gray-200'>
          <div className='border-b border-gray-200'>
            <nav className='flex'>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'employees'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Employees ({tabStats.employees})
              </button>
              <button
                onClick={() => setActiveTab('employers')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'employers'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Employers ({tabStats.employers})
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'admins'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Admins ({tabStats.admins})
              </button>
            </nav>
          </div>

          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='relative flex-1 md:max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search users...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                />
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Role
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Contact
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Location
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Birth Date
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentData.data.length === 0 && (
                  <tr>
                    <td colSpan='6' className='text-center py-12'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                          <UsersIcon className='w-8 h-8 text-gray-400' />
                        </div>
                        <div className='text-center'>
                          <p className='text-gray-500 font-medium'>
                            No users found
                          </p>
                          <p className='text-gray-400 text-sm mt-1'>
                            {searchTerm
                              ? 'Try adjusting your search terms'
                              : 'Get started by creating your first user'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {currentData.data.map((user) => (
                  <tr key={user.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <img
                            className='h-10 w-10 rounded-full object-cover'
                            src={
                              user.profile_picture
                                ? `http://localhost:8000${user.profile_picture}`
                                : `https://placehold.co/150x150/e2e8f0/808080?text=${user.first_name.charAt(
                                    0
                                  )}${user.last_name.charAt(0)}`
                            }
                            alt={`${getFullName(user)} profile`}
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {getFullName(user)}
                          </div>
                          <div className='text-sm text-gray-500'>
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 rounded-full ${getRoleBadgeColor(
                          user.role
                        )}
                          `}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex items-center gap-2'>
                        <Phone className='w-4 h-4 text-gray-400' />
                        {user.phone}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='w-4 h-4 text-gray-400' />
                        {user.city}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-gray-400' />
                        {displayDate(user.birth_date)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => handleViewUser(user)}
                          className='text-gray-400 hover:text-blue-600 transition-colors p-1'
                        >
                          <Eye className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className='text-gray-400 hover:text-green-600 transition-colors p-1'
                        >
                          <Edit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className='text-gray-400 hover:text-red-600 transition-colors p-1'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200 bg-white rounded-b-lg'>
            <p className='text-sm text-gray-600'>
              Showing {(currentPage - 1) * 10 + 1} to{' '}
              {Math.min(currentPage * 10, currentData.total)} of{' '}
              {currentData.total} entries
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isSubmitting}
                className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-9 h-9 flex items-center justify-center'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
              {Array.from({ length: currentData.lastPage }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  disabled={currentPage === index + 1 || isSubmitting}
                  className={`px-3 py-1 border rounded-lg text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-accent-600 text-white border-accent-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed w-9 h-9 flex items-center justify-center`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(currentData.lastPage, prev + 1)
                  )
                }
                disabled={currentPage === currentData.lastPage || isSubmitting}
                className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-9 h-9 flex items-center justify-center'
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onToggle={() => setShowCreateModal(false)}
        title={
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-accent-100 rounded-lg'>
              <UserPlus className='w-5 h-5 text-accent-600' />
            </div>
            <span>Create New User</span>
          </div>
        }
      >
        <form onSubmit={handleCreateUser} className='p-6 space-y-6'>
          <div className='space-y-6'>
            {/* Personal Information Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                <User className='w-4 h-4' />
                Personal Information
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='first_name'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <User className='w-4 h-4 text-gray-400' />
                    First Name
                  </label>
                  <input
                    type='text'
                    id='first_name'
                    name='first_name'
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    placeholder='Enter first name'
                  />
                </div>
                <div>
                  <label
                    htmlFor='last_name'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <User className='w-4 h-4 text-gray-400' />
                    Last Name
                  </label>
                  <input
                    type='text'
                    id='last_name'
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    placeholder='Enter last name'
                  />
                </div>
                <div>
                  <label
                    htmlFor='gender'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <Heart className='w-4 h-4 text-gray-400' />
                    Gender
                  </label>
                  <select
                    id='gender'
                    name='gender'
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                  >
                    <option value=''>Select Gender</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='birth_date'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <Calendar className='w-4 h-4 text-gray-400' />
                    Birth Date
                  </label>
                  <input
                    type='date'
                    id='birth_date'
                    name='birth_date'
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                  />
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                <Shield className='w-4 h-4' />
                Account Information
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <AtSign className='w-4 h-4 text-gray-400' />
                    Username
                  </label>
                  <input
                    type='text'
                    id='username'
                    name='username'
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    placeholder='Enter username'
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <Lock className='w-4 h-4 text-gray-400' />
                    Password
                    <span className='text-xs text-gray-500 ml-1'>
                      (Leave blank to keep current)
                    </span>
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    placeholder='Enter new password'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label
                    htmlFor='role'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <Shield className='w-4 h-4 text-gray-400' />
                    Role
                  </label>
                  <select
                    id='role'
                    name='role'
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                  >
                    <option value='employee'>Employee</option>
                    <option value='employeer'>Employer</option>
                    <option value='admin'>Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                <Phone className='w-4 h-4' />
                Contact Information
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <Phone className='w-4 h-4 text-gray-400' />
                    Phone
                  </label>
                  <input
                    type='text'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    placeholder='Enter phone number'
                  />
                </div>
                <div>
                  <label
                    htmlFor='city'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <Building className='w-4 h-4 text-gray-400' />
                    City
                  </label>
                  <input
                    type='text'
                    id='city'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    placeholder='Enter city'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label
                    htmlFor='address'
                    className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                  >
                    <Home className='w-4 h-4 text-gray-400' />
                    Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    placeholder='Enter full address'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={() => setShowCreateModal(false)}
              className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2'
            >
              <X className='w-4 h-4' />
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
            >
              {isSubmitting ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <UserPlus className='w-4 h-4' />
              )}
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onToggle={() => setShowEditModal(false)}
        title={
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-accent-100 rounded-lg'>
              <UserCheck className='w-5 h-5 text-accent-600' />
            </div>
            <span>Edit User</span>
          </div>
        }
      >
        {selectedUser && (
          <form onSubmit={handleEditUser} className='p-6 space-y-6'>
            <div className='space-y-6'>
              {/* Personal Information Section */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                  <User className='w-4 h-4' />
                  Personal Information
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='edit_first_name'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <User className='w-4 h-4 text-gray-400' />
                      First Name
                    </label>
                    <input
                      type='text'
                      id='edit_first_name'
                      name='first_name'
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='edit_last_name'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <User className='w-4 h-4 text-gray-400' />
                      Last Name
                    </label>
                    <input
                      type='text'
                      id='edit_last_name'
                      name='last_name'
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='edit_gender'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <Heart className='w-4 h-4 text-gray-400' />
                      Gender
                    </label>
                    <select
                      id='edit_gender'
                      name='gender'
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    >
                      <option value=''>Select Gender</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor='edit_birth_date'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <Calendar className='w-4 h-4 text-gray-400' />
                      Birth Date
                    </label>
                    <input
                      type='date'
                      id='edit_birth_date'
                      name='birth_date'
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    />
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                  <Shield className='w-4 h-4' />
                  Account Information
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='edit_username'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <AtSign className='w-4 h-4 text-gray-400' />
                      Username
                    </label>
                    <input
                      type='text'
                      id='edit_username'
                      name='username'
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='edit_password'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <Lock className='w-4 h-4 text-gray-400' />
                      Password
                      <span className='text-xs text-gray-500 ml-1'>
                        (Leave blank to keep current)
                      </span>
                    </label>
                    <input
                      type='password'
                      id='edit_password'
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                      placeholder='Enter new password'
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label
                      htmlFor='edit_role'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <Shield className='w-4 h-4 text-gray-400' />
                      Role
                    </label>
                    <select
                      id='edit_role'
                      name='role'
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    >
                      <option value='employee'>Employee</option>
                      <option value='employeer'>Employer</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                  <Phone className='w-4 h-4' />
                  Contact Information
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='edit_phone'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <Phone className='w-4 h-4 text-gray-400' />
                      Phone
                    </label>
                    <input
                      type='text'
                      id='edit_phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='edit_city'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <Building className='w-4 h-4 text-gray-400' />
                      City
                    </label>
                    <input
                      type='text'
                      id='edit_city'
                      name='city'
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label
                      htmlFor='edit_address'
                      className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
                    >
                      <Home className='w-4 h-4 text-gray-400' />
                      Address
                    </label>
                    <input
                      type='text'
                      id='edit_address'
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200'>
              <button
                type='button'
                onClick={() => setShowEditModal(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2'
              >
                <X className='w-4 h-4' />
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {isSubmitting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={showViewModal}
        onToggle={() => setShowViewModal(false)}
        title={
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-accent-100 rounded-lg'>
              <Eye className='w-5 h-5 text-accent-600' />
            </div>
            <span>User Details</span>
          </div>
        }
      >
        {selectedUser && (
          <div className='p-6 space-y-6'>
            {/* User Profile Header */}
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='relative'>
                <img
                  src={
                    selectedUser.profile_picture
                      ? `http://localhost:8000${selectedUser.profile_picture}`
                      : `https://placehold.co/150x150/e2e8f0/808080?text=${selectedUser.first_name.charAt(
                          0
                        )}${selectedUser.last_name.charAt(0)}`
                  }
                  alt={`${getFullName(selectedUser)} profile`}
                  className='w-20 h-20 rounded-full object-cover border-2 border-gray-200'
                />
                <div className='absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-gray-200'>
                  {getRoleIcon(selectedUser.role)}
                </div>
              </div>
              <div className='flex-1'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  {getFullName(selectedUser)}
                </h3>
                <div className='flex items-center gap-2 mt-1'>
                  <AtSign className='w-4 h-4 text-gray-400' />
                  <p className='text-sm text-gray-600'>
                    {selectedUser.username}
                  </p>
                </div>
                <div className='mt-2'>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 rounded-full ${getRoleBadgeColor(
                      selectedUser.role
                    )}
                    `}
                  >
                    {getRoleIcon(selectedUser.role)}
                    <span className='ml-1'>{selectedUser.role}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* User Details Grid */}
            <div className='space-y-6'>
              {/* Contact Information */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                  <Phone className='w-4 h-4' />
                  Contact Information
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Phone className='w-4 h-4 text-gray-400' />
                      <p className='text-sm font-medium text-gray-500'>Phone</p>
                    </div>
                    <p className='text-gray-900 font-medium'>
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div className='p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Building className='w-4 h-4 text-gray-400' />
                      <p className='text-sm font-medium text-gray-500'>City</p>
                    </div>
                    <p className='text-gray-900 font-medium'>
                      {selectedUser.city}
                    </p>
                  </div>
                  <div className='p-3 bg-gray-50 rounded-lg md:col-span-2'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Home className='w-4 h-4 text-gray-400' />
                      <p className='text-sm font-medium text-gray-500'>
                        Address
                      </p>
                    </div>
                    <p className='text-gray-900 font-medium'>
                      {selectedUser.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2'>
                  <User className='w-4 h-4' />
                  Personal Information
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Heart className='w-4 h-4 text-gray-400' />
                      <p className='text-sm font-medium text-gray-500'>
                        Gender
                      </p>
                    </div>
                    <p className='text-gray-900 font-medium'>
                      {selectedUser.gender.charAt(0).toUpperCase() +
                        selectedUser.gender.slice(1)}
                    </p>
                  </div>
                  <div className='p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Calendar className='w-4 h-4 text-gray-400' />
                      <p className='text-sm font-medium text-gray-500'>
                        Birth Date
                      </p>
                    </div>
                    <p className='text-gray-900 font-medium'>
                      {displayDate(selectedUser.birth_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200'>
              <button
                type='button'
                onClick={() => setShowViewModal(false)}
                className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium flex items-center gap-2'
              >
                <X className='w-4 h-4' />
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onToggle={() => setShowDeleteModal(false)}
        title={
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-100 rounded-lg'>
              <AlertTriangle className='w-5 h-5 text-red-600' />
            </div>
            <span>Confirm Delete</span>
          </div>
        }
      >
        <div className='p-6'>
          <div className='text-center space-y-4'>
            <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
              <UserX className='w-8 h-8 text-red-600' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Delete User Account
              </h3>
              <p className='text-gray-600'>
                Are you sure you want to delete{' '}
                <span className='font-semibold text-gray-900'>
                  {userToDelete && getFullName(userToDelete)}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          <div className='mt-6 flex justify-center gap-4'>
            <button
              onClick={() => setShowDeleteModal(false)}
              className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2'
            >
              <X className='w-4 h-4' />
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
            >
              {isSubmitting ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Trash2 className='w-4 h-4' />
              )}
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
