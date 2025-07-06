import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  PhilippinePeso,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Building2,
  Phone,
  Mail,
  User,
  CreditCard,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { useEmployeeJob } from '../../contexts/EmployeeJobProvider';
import { history } from '../../helper/Profile';

export function History() {
  const { profile, subscriptions, loading, error } = useEmployeeJob();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);

  // Load applied jobs
  const loadAppliedJobs = async () => {
    try {
      setLoadingApplications(true);
      setApplicationsError(null);
      const response = await history();
      if (response.success) {
        setAppliedJobs(response.jobs || []);
        console.log('API response:', response);
        console.log('Applied jobs after setting state:', response.jobs);
      } else {
        setApplicationsError(response.message || 'Failed to load applied jobs');
      }
    } catch (error) {
      console.error('Error loading applied jobs:', error);
      setApplicationsError('Failed to load applied jobs');
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    loadAppliedJobs();
  }, [profile?.id]);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'full_time':
        return 'Full Time';
      case 'part_time':
        return 'Part Time';
      case 'order':
        return 'Per Order';
      default:
        return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'full_time':
        return 'bg-green-100 text-green-800';
      case 'part_time':
        return 'bg-yellow-100 text-yellow-800';
      case 'order':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (lifecycle) => {
    return lifecycle === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (salary) => {
    return `₱${parseInt(salary).toLocaleString()}`;
  };

  const formatPrice = (price) => {
    return `₱${parseInt(price).toLocaleString()}`;
  };

  const getPlanLabel = (plan) => {
    switch (plan) {
      case '20_token':
        return '20 Token Plan';
      default:
        return plan;
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className='w-4 h-4 text-green-600' />;
      case 'rejected':
        return <XCircle className='w-4 h-4 text-red-600' />;
      case 'pending':
        return <Clock className='w-4 h-4 text-yellow-600' />;
      default:
        return <AlertCircle className='w-4 h-4 text-gray-600' />;
    }
  };

  if (loading) {
    return (
      <div className='w-full p-4 md:p-6'>
        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 text-center'>
          <p className='text-gray-600'>Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full flex items-center justify-center py-12'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Error loading history</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className='w-full p-4 md:p-6'>
      <header className='mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
          History
        </h1>
        <p className='text-gray-600'>
          Track your subscription and job applications
        </p>
      </header>

      {subscriptions && subscriptions.length > 0 && (
        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Subscription History
          </h2>
          <article className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
            <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
              <div className='flex-1'>
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-1'>
                      {getPlanLabel(subscriptions[0].plan || 'N/A')}
                    </h3>
                    <div className='flex items-center gap-2 text-gray-600 mb-2'>
                      <User className='w-4 h-4' />
                      <span className='font-medium'>
                        {profile?.name || subscriptions[0].full_name || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    {subscriptions[0].status === 'active' ? (
                      <CheckCircle className='w-5 h-5 text-green-600' />
                    ) : (
                      <XCircle className='w-5 h-5 text-red-600' />
                    )}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        subscriptions[0].status || 'inactive'
                      )}`}
                    >
                      {subscriptions[0].status === 'active'
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className='mb-4'>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    Plan Features:
                  </h4>
                  <ul className='space-y-1'>
                    {subscriptions[0].description ? (
                      Array.isArray(subscriptions[0].description) ? (
                        subscriptions[0].description.map((feature, index) => (
                          <li
                            key={index}
                            className='flex items-center gap-2 text-sm text-gray-600'
                          >
                            <Star className='w-3 h-3 text-yellow-500' />
                            <span>{feature}</span>
                          </li>
                        ))
                      ) : (
                        JSON.parse(subscriptions[0].description).map(
                          (feature, index) => (
                            <li
                              key={index}
                              className='flex items-center gap-2 text-sm text-gray-600'
                            >
                              <Star className='w-3 h-3 text-yellow-500' />
                              <span>{feature}</span>
                            </li>
                          )
                        )
                      )
                    ) : (
                      <li className='flex items-center gap-2 text-sm text-gray-600'>
                        <Star className='w-3 h-3 text-yellow-500' />
                        <span>No features available</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-4'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <CreditCard className='w-4 h-4 text-accent-600' />
                    <span>{formatPrice(subscriptions[0].price || '0')}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Calendar className='w-4 h-4 text-accent-600' />
                    <span>
                      Started{' '}
                      {formatDate(
                        subscriptions[0].created_at || new Date().toISOString()
                      )}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Clock className='w-4 h-4 text-orange-600' />
                    <span>
                      Updated{' '}
                      {formatDate(
                        subscriptions[0].updated_at || new Date().toISOString()
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      <div className='mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Job Application History
        </h2>
        {loadingApplications ? (
          <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 text-center mt-2'>
            <p className='text-gray-600'>Loading applications...</p>
          </div>
        ) : applicationsError ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3 mt-2'>
            <p className='text-red-600 text-sm'>{applicationsError}</p>
          </div>
        ) : appliedJobs && appliedJobs.length > 0 ? (
          <section className='mt-2 grid gap-4 grid-cols-1 md:grid-cols-2'>
            {appliedJobs.map((job) => {
              return (
                <article
                  key={job.id}
                  className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-colors'
                >
                  <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <h2 className='text-xl font-semibold text-gray-800 mb-1'>
                            {job.title}
                          </h2>
                          <div className='flex items-center gap-2 text-gray-600 mb-2'>
                            <Building2 className='w-4 h-4' />
                            <span className='font-medium'>{job.company}</span>
                          </div>
                          <div className='flex items-center gap-2 text-gray-600 mb-3'>
                            <User className='w-4 h-4' />
                            <span className='text-sm'>
                              Employer: {job.employer_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className='text-gray-700 mb-4 line-clamp-2'>
                        {job.description}
                      </p>

                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <MapPin className='w-4 h-4 text-accent-600' />
                          <span>{job.location}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <PhilippinePeso className='w-4 h-4 text-accent-600' />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Phone className='w-4 h-4 text-purple-600' />
                          <span>{job.contact}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Calendar className='w-4 h-4 text-orange-600' />
                          <span>Until {formatDate(job.duration)}</span>
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-2'>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                            job.type
                          )}`}
                        >
                          <Briefcase className='w-3 h-3 mr-1' />
                          {getTypeLabel(job.type)}
                        </span>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800'>
                          <Clock className='w-3 h-3 mr-1' />
                          Applied {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 lg:w-auto w-full'></div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className='grid gap-4 grid-cols-1 md:grid-cols-2'>
            <div className='text-center py-12 col-span-full'>
              <Briefcase className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <h2 className='text-xl font-semibold text-gray-600 mb-2'>
                No Application History
              </h2>
              <p className='text-gray-500'>
                You haven\'t applied to any jobs yet. Start exploring
                opportunities!
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
