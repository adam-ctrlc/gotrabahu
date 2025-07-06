import React, { useState } from 'react';
import {
  Search,
  Filter,
  Check,
  X,
  User,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Edit,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminProvider';
import { ViewSubscriptionModal } from './ViewSubscriptionModal';

const getInitials = (firstName, middleName, lastName) => {
  return `${firstName ? firstName.charAt(0) : ''}${
    middleName ? middleName.charAt(0) : ''
  }${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
};

export function Subscriptions() {
  const {
    subscriptions,
    loading,
    error,
    refetch,
    approveSubscription,
    rejectSubscription,
    getSubscriptionById,
  } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [customTokenCount, setCustomTokenCount] = useState(20);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingTokenValue, setEditingTokenValue] = useState(0);

  // Loading state
  if (loading && !isSubmitting) {
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

          {/* Search and filter section shimmer */}
          <div className='bg-white rounded-lg border border-gray-200 w-full animate-pulse mb-6'>
            <div className='p-4 md:p-6 border-b border-gray-200'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='h-10 bg-gray-200 rounded w-full md:max-w-md'></div>{' '}
                {/* Search bar */}
                <div className='h-10 bg-gray-200 rounded w-32'></div>{' '}
                {/* Filter select */}
              </div>
            </div>
            <div className='p-4 md:p-6 space-y-4'>
              {Array.from({ length: 3 }).map((_, index) => (
                <article
                  key={index}
                  className='bg-gray-50 rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse w-full'
                >
                  <div className='flex flex-col lg:flex-row gap-4'>
                    <div className='flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-6 bg-gray-200 rounded w-3/4'></div>
                      <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                      <div className='grid grid-cols-3 gap-3'>
                        <div className='h-4 bg-gray-200 rounded'></div>
                        <div className='h-4 bg-gray-200 rounded'></div>
                        <div className='h-4 bg-gray-200 rounded'></div>
                      </div>
                      <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                    </div>
                    <div className='flex flex-col gap-2 w-full lg:w-auto'>
                      <div className='h-10 bg-gray-200 rounded'></div>
                      <div className='h-10 bg-gray-200 rounded'></div>
                      <div className='h-10 bg-gray-200 rounded'></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
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
          <p className='text-gray-600 mb-4'>Failed to load subscriptions</p>
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

  // Create subscription data structure from context
  const pendingSubscriptions = {
    success: true,
    employees: subscriptions || [],
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date time:', error);
      return '';
    }
  };

  const getFullName = (employee) => {
    const parts = [
      employee.first_name,
      employee.middle_name,
      employee.last_name,
    ].filter(Boolean);
    return parts.join(' ');
  };

  const getPlanColor = (subscription) => {
    return subscription === '20_token'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredEmployees = () => {
    let filtered = pendingSubscriptions.employees;

    // Filter by tab status
    if (activeTab !== 'all') {
      filtered = filtered.filter((emp) => emp.status === activeTab);
    }

    if (filterPlan !== 'all') {
      const planType = filterPlan === '20' ? '20_token' : 'unlimited_token';
      filtered = filtered.filter((emp) => emp.subscription === planType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          getFullName(emp).toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getSubscriptionStats = () => {
    const employees = pendingSubscriptions.employees;
    return {
      total: employees.length,
      pending: employees.filter((emp) => emp.status === 'pending').length,
      active: employees.filter((emp) => emp.status === 'active').length,
      inactive: employees.filter((emp) => emp.status === 'inactive').length,
      tokenPlan: employees.filter((emp) => emp.subscription === '20_token')
        .length,
      unlimitedPlan: employees.filter(
        (emp) => emp.subscription === 'unlimited_token'
      ).length,
    };
  };

  const handleApprove = async (
    userId,
    subscriptionId,
    customTokenCount = null
  ) => {
    try {
      setIsSubmitting(true);
      await approveSubscription(userId, subscriptionId, customTokenCount);
      refetch();
    } catch (error) {
      console.error('Error approving subscription:', error);
    } finally {
      setIsSubmitting(false);
      // Re-fetch the specific subscription to update modal state if it's still open
      if (selectedSubscription) {
        await handleViewSubscription(selectedSubscription.id);
      }
      // Ensure the modal is closed after action
      setShowViewModal(false);
    }
  };

  const handleReject = async (userId, subscriptionId) => {
    try {
      setIsSubmitting(true);
      await rejectSubscription(userId, subscriptionId);
      refetch();
    } catch (error) {
      console.error('Error rejecting subscription:', error);
    } finally {
      setIsSubmitting(false);
      // Re-fetch the specific subscription to update modal state if it's still open
      if (selectedSubscription) {
        await handleViewSubscription(selectedSubscription.id);
      }
      setShowViewModal(false);
    }
  };

  const handleSaveToken = async (userId, subscriptionId) => {
    try {
      setIsSubmitting(true);
      console.log(
        'handleSaveToken: userId',
        userId,
        'subscriptionId',
        subscriptionId,
        'editingTokenValue',
        editingTokenValue
      );
      await approveSubscription(
        userId,
        subscriptionId,
        parseInt(editingTokenValue, 10)
      );
      setEditingEmployeeId(null);
      setEditingTokenValue(0);
      refetch();
    } catch (error) {
      console.error('Error updating token count:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
    setEditingTokenValue(0);
  };

  const handleViewSubscription = async (employeeId) => {
    try {
      console.log('Attempting to fetch subscription for ID:', employeeId); // Debug log
      const response = await getSubscriptionById(employeeId);
      console.log('Response from getSubscriptionById:', response); // Debug log
      if (response) {
        setSelectedSubscription(response);
        if (response.subscription === '20_token') {
          setCustomTokenCount(response.user_token ?? 20);
        } else {
          setCustomTokenCount(0);
        }
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error);
    }
  };

  const stats = getSubscriptionStats();
  const filteredEmployees = getFilteredEmployees();

  return (
    <main className='w-full p-4 md:p-6'>
      <header className='mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
              Subscription Management
            </h1>
            <p className='text-gray-600'>
              Review and manage pending employee subscription requests
            </p>
          </div>
        </div>
      </header>

      <section className='mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-accent-100 rounded-lg'>
                <CreditCard className='w-6 h-6 text-accent-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Pending</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {stats.pending}
                </p>
              </div>
            </div>
          </article>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-accent-100 rounded-lg'>
                <CreditCard className='w-6 h-6 text-accent-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>20 Token Plan</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {stats.tokenPlan}
                </p>
              </div>
            </div>
          </article>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <CreditCard className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Unlimited Plan</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {stats.unlimitedPlan}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className='bg-white rounded-lg border border-gray-200'>
          <div className='border-b border-gray-200'>
            <nav className='flex'>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'all'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pending'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'active'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'inactive'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Inactive ({stats.inactive})
              </button>
            </nav>
          </div>

          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='relative flex-1 md:max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search employees...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                />
              </div>
              <div className='flex gap-2'>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                >
                  <option value='all'>All Plans</option>
                  <option value='20'>20 Token Plan</option>
                  <option value='unlimited'>Unlimited Plan</option>
                </select>
              </div>
            </div>
          </div>

          <div className='p-4 md:p-6'>
            <div className='grid gap-4'>
              {filteredEmployees.map((employee) => (
                <article
                  key={employee.id}
                  className='bg-gray-50 rounded-lg border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-colors'
                >
                  <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
                    <div className='flex gap-4 flex-1'>
                      <div className='flex-shrink-0'>
                        <img
                          src={
                            employee.profile_picture ||
                            `https://placehold.co/150x150/e2e8f0/808080?text=${getInitials(
                              employee.first_name,
                              employee.middle_name,
                              employee.last_name
                            )}`
                          }
                          alt={`${getFullName(employee)} profile`}
                          className='w-16 h-16 rounded-lg object-cover border border-gray-200'
                        />
                      </div>

                      <div className='flex-1'>
                        <div className='flex items-start justify-between mb-3'>
                          <div>
                            <h2 className='text-xl font-semibold text-gray-800 mb-1'>
                              {getFullName(employee)}
                            </h2>
                            <div className='flex items-center gap-2 text-gray-600 mb-2'>
                              <User className='w-4 h-4' />
                              <span className='text-sm'>
                                @{employee.username}
                              </span>
                            </div>
                          </div>
                          <div className='flex flex-col items-end gap-2'>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                                employee.subscription
                              )}`}
                            >
                              <CreditCard className='w-3 h-3 mr-1' />
                              {employee.subscription === '20_token'
                                ? '20 Token Plan'
                                : 'Unlimited Token Plan'}
                            </span>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                employee.status
                              )}`}
                            >
                              {employee.status.charAt(0).toUpperCase() +
                                employee.status.slice(1)}
                            </span>
                            {employee.subscription === '20_token' &&
                              employee.status === 'active' && (
                                <div className='flex items-center gap-2 mt-2'>
                                  <label className='block text-xs font-medium text-gray-500 uppercase'>
                                    Tokens:
                                  </label>
                                  {editingEmployeeId === employee.id ? (
                                    <input
                                      type='number'
                                      value={editingTokenValue}
                                      onChange={(e) =>
                                        setEditingTokenValue(e.target.value)
                                      }
                                      className='w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-accent-500'
                                      min='0'
                                    />
                                  ) : (
                                    <span className='text-gray-900 font-semibold'>
                                      {employee.user_token}
                                    </span>
                                  )}

                                  {editingEmployeeId === employee.id ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleSaveToken(
                                            employee.user_id,
                                            employee.subscriptions_id
                                          )
                                        }
                                        disabled={isSubmitting}
                                        className='p-1 rounded-full text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                      >
                                        <Check className='w-4 h-4' />
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className='p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                      >
                                        <X className='w-4 h-4' />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setEditingEmployeeId(employee.id);
                                        setEditingTokenValue(
                                          employee.user_token
                                        );
                                      }}
                                      className='p-1 rounded-full text-accent-600 hover:bg-accent-100 transition-colors'
                                    >
                                      <Edit className='w-4 h-4' />
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Phone className='w-4 h-4 text-green-600' />
                            <span>{employee.phone}</span>
                          </div>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <MapPin className='w-4 h-4 text-accent-600' />
                            <span>{employee.city}</span>
                          </div>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Calendar className='w-4 h-4 text-purple-600' />
                            <span>Born {formatDate(employee.birth_date)}</span>
                          </div>
                        </div>

                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                          <Clock className='w-4 h-4' />
                          <span>
                            Requested on {formatDateTime(employee.requested_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 lg:w-auto w-full lg:min-w-[140px]'>
                      <button
                        onClick={() => handleViewSubscription(employee.id)}
                        className='flex items-center justify-center gap-2 px-4 py-2 border border-accent-600 text-accent-600 rounded-lg hover:bg-accent-600 hover:text-white transition-colors text-sm font-medium'
                      >
                        <User className='w-4 h-4' />
                        View Details
                      </button>
                      {employee.status === 'pending' && (
                        <>
                          <button
                            onClick={() =>
                              handleApprove(
                                employee.user_id,
                                employee.subscriptions_id,
                                employee.subscription === '20_token' ? 20 : null
                              )
                            }
                            disabled={isSubmitting}
                            className='flex items-center justify-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {isSubmitting ? (
                              <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                              <Check className='w-4 h-4' />
                            )}
                            {isSubmitting ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() =>
                              handleReject(
                                employee.user_id,
                                employee.subscriptions_id
                              )
                            }
                            disabled={isSubmitting}
                            className='flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {isSubmitting ? (
                              <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                              <X className='w-4 h-4' />
                            )}
                            {isSubmitting ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className='text-center py-12'>
                <CreditCard className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <h2 className='text-xl font-semibold text-gray-600 mb-2'>
                  No Pending Subscriptions
                </h2>
                <p className='text-gray-500'>
                  No subscription requests match your current filters.
                </p>
              </div>
            )}

            {filteredEmployees.length > 0 && (
              <div className='flex items-center justify-between mt-6'>
                <p className='text-sm text-gray-600'>
                  Showing {filteredEmployees.length} of {stats.total} pending
                  requests
                </p>
                <div className='flex items-center gap-2'>
                  <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-9 h-9 flex items-center justify-center'>
                    <ChevronLeft className='w-4 h-4' />
                  </button>
                  <span className='px-3 py-1 bg-white border border-accent-600 text-accent-600 rounded-lg text-sm w-9 h-9 flex items-center justify-center'>
                    1
                  </span>
                  <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-9 h-9 flex items-center justify-center'>
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ViewSubscriptionModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        selectedSubscription={selectedSubscription}
        isSubmitting={isSubmitting}
        handleApprove={handleApprove}
        handleReject={handleReject}
        customTokenCount={customTokenCount}
        setCustomTokenCount={setCustomTokenCount}
      />
    </main>
  );
}
