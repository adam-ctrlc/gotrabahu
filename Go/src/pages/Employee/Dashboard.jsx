import React, { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
  MoreVertical,
  FileText,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Building2,
  Phone,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Jobs } from './Jobs';
import { useEmployeeJob } from '../../contexts/EmployeeJobProvider';
import {
  getUserAppliedJobs,
  getJobById,
  getJob,
} from '../../helper/Jobs/Employee';

export function Dashboard() {
  const {
    jobs,
    loading,
    error,
    applyJob,
    cancelJob,
    profile,
    setJobs,
    setError,
  } = useEmployeeJob();
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Map());
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const activeJobs = jobs.filter((job) => job.life_cycle === 'active');

  const handleJobClick = (jobId) => {
    setSelectedJobId(jobId);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedJobId(null);
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salary) => {
    return `₱${parseInt(salary).toLocaleString()}`;
  };

  const loadAppliedJobs = async () => {
    try {
      setLoadingApplications(true);
      const response = await getUserAppliedJobs();
      if (response && response.success) {
        const appliedJobsMap = new Map(
          response.data.map((job) => [job.job_id, job])
        );
        setAppliedJobs(appliedJobsMap);
      } else {
        setAppliedJobs(new Map());
      }
    } catch (error) {
      console.error('Error loading applied jobs:', error);
      setAppliedJobs(new Map());
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    if (applyingJobId || !jobId) return;

    try {
      setApplyingJobId(jobId);
      const response = await applyJob(jobId);
      if (response && response.success) {
        await loadAppliedJobs(); // Refresh the applied jobs list
      }
      // Removed the unnecessary individual job status refresh
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job. Please try again.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleCancelApplication = async (jobId) => {
    if (applyingJobId || !jobId) return;

    try {
      setApplyingJobId(jobId);
      const response = await cancelJob(jobId);
      if (response && response.success) {
        await loadAppliedJobs(); // Refresh the applied jobs list
      }
      // Removed the unnecessary individual job status refresh
    } catch (error) {
      console.error('Error canceling application:', error);
      alert('Failed to cancel application. Please try again.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.get(jobId);
  };

  const getApplicationStatus = (jobId) => {
    const application = isJobApplied(jobId);
    return application ? application.status : null;
  };

  useEffect(() => {
    if (profile) {
      loadAppliedJobs();
    }
  }, [profile]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJob(searchTerm);
        if (response && response.success) {
          setJobs(response.data);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err);
      }
    };

    fetchJobs();
  }, [searchTerm, setJobs, setError]);

  // Removed the useEffect hook that iterated through jobs to load individual application statuses.

  return (
    <article className='w-full'>
      <header className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          Available Jobs
        </h1>
        <p className='text-gray-600'>Browse and apply for job opportunities</p>
      </header>

      <section className='grid gap-4 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className='flex items-center gap-2'>
              <FileText className='w-5 h-5 text-accent-600' />
              <span className='text-sm font-medium text-gray-600'>
                Total Jobs
              </span>
            </div>
            <p className='text-2xl font-bold text-gray-800 mt-2'>
              {jobs.length}
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-accent-600' />
              <span className='text-sm font-medium text-gray-600'>
                Active Jobs
              </span>
            </div>
            <p className='text-2xl font-bold text-gray-800 mt-2'>
              {activeJobs.length}
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className='flex items-center gap-2'>
              <MapPin className='w-5 h-5 text-accent-600' />
              <span className='text-sm font-medium text-gray-600'>
                Locations
              </span>
            </div>
            <p className='text-2xl font-bold text-gray-800 mt-2'>
              {new Set(jobs.map((job) => job.location)).size}
            </p>
          </div>
        </div>
      </section>

      <section className='bg-white rounded-lg border border-gray-200 overflow-hidden mb-6'>
        <div className='p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h2 className='text-lg font-semibold text-gray-800'>
              Job Listings
            </h2>
            <p className='text-gray-500 text-sm'>
              {activeJobs.length} active job opportunities available
            </p>
          </div>

          <div className='flex flex-col md:flex-row gap-3 w-full md:w-auto'>
            <div className='relative flex-1 md:flex-none'>
              <input
                type='text'
                placeholder='Search jobs...'
                className='w-full md:w-64 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className='grid gap-4 p-4 md:p-6'>
          {loading && (
            <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6 text-center col-span-full'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto mb-2'></div>
              <p className='text-gray-600'>Loading jobs...</p>
            </div>
          )}

          {!loading && error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3 mt-2 col-span-full'>
              <p className='text-red-600 text-sm mb-2'>
                Error loading jobs: {error.message || error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 text-sm'
              >
                Retry
              </button>
            </div>
          )}

          {!loading && jobs.length === 0 && !error && (
            <div className='text-center py-12 col-span-full'>
              <FileText className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <h2 className='text-xl font-semibold text-gray-600 mb-2'>
                No Jobs Available
              </h2>
              <p className='text-gray-500'>
                There are no job opportunities available at the moment.
              </p>
            </div>
          )}

          {!loading &&
            jobs.length > 0 &&
            jobs.map((job) => (
              <div
                key={job.id}
                className='border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer'
                onClick={() => handleJobClick(job.id)}
              >
                <div className='flex flex-col lg:flex-row lg:items-start gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                          {job.title}
                        </h3>
                        <div className='flex items-center gap-2 text-gray-600 mb-2'>
                          <Building2 className='w-4 h-4' />
                          <span className='font-medium'>{job.company}</span>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                            job.type
                          )}`}
                        >
                          {getTypeLabel(job.type)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            job.life_cycle
                          )}`}
                        >
                          {job.life_cycle === 'active' ? 'Active' : 'Ended'}
                        </span>
                      </div>
                    </div>

                    <p className='text-gray-700 mb-4 line-clamp-2'>
                      {job.description}
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <MapPin className='w-4 h-4' />
                        <span>{job.location}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <DollarSign className='w-4 h-4' />
                        <span>{job.salary}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Users className='w-4 h-4' />
                        <span>Max {job.max_applicants} applicants</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Calendar className='w-4 h-4' />
                        <span>Until {job.duration}</span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-600 mb-4'>
                      <Phone className='w-4 h-4' />
                      <span>{job.contact}</span>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2 lg:w-auto w-full'>
                    {job.life_cycle === 'active' ? (
                      <>
                        {(() => {
                          const application = isJobApplied(job.id);
                          if (application) {
                            const statusText =
                              application.status.charAt(0).toUpperCase() +
                              application.status.slice(1);
                            const statusColorClass =
                              {
                                applied: 'bg-green-100 text-green-800',
                                accepted: 'bg-blue-100 text-blue-800',
                                rejected: 'bg-red-100 text-red-800',
                                done: 'bg-purple-100 text-purple-800', // Assuming 'done' status exists
                              }[application.status] ||
                              'bg-gray-100 text-gray-800';
                            const StatusIcon =
                              {
                                applied: CheckCircle,
                                accepted: CheckCircle,
                                rejected: XCircle,
                                done: Clock, // Assuming 'done' status exists
                              }[application.status] || FileText;

                            return (
                              <>
                                <div
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusColorClass}`}
                                >
                                  <StatusIcon className='w-4 h-4' />
                                  <span className='text-sm font-medium'>
                                    {statusText}
                                  </span>
                                </div>
                                {application.status === 'applied' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelApplication(job.id);
                                    }}
                                    disabled={applyingJobId === job.id}
                                    className='flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                  >
                                    {applyingJobId === job.id ? (
                                      <Loader2 className='w-4 h-4 animate-spin' />
                                    ) : (
                                      <XCircle className='w-4 h-4' />
                                    )}
                                    <span>Cancel Application</span>
                                  </button>
                                )}
                              </>
                            );
                          } else {
                            return (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplyJob(job.id);
                                  }}
                                  disabled={applyingJobId === job.id}
                                  className='flex items-center justify-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                  {applyingJobId === job.id ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                  ) : (
                                    <Plus className='w-4 h-4' />
                                  )}
                                  <span>Apply Now</span>
                                </button>
                              </>
                            );
                          }
                        })()}
                      </>
                    ) : (
                      <>
                        <button
                          className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'
                          disabled
                        >
                          Job Ended
                        </button>
                        {getApplicationStatus(job.id) && (
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                              getApplicationStatus(job.id) === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : getApplicationStatus(job.id) === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {getApplicationStatus(job.id) === 'accepted' && (
                              <CheckCircle className='w-4 h-4' />
                            )}
                            {getApplicationStatus(job.id) === 'rejected' && (
                              <XCircle className='w-4 h-4' />
                            )}
                            {getApplicationStatus(job.id) === 'done' && (
                              <Clock className='w-4 h-4' />
                            )}
                            <span className='font-medium capitalize'>
                              {getApplicationStatus(job.id)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className='py-3 px-4 border-t border-gray-200 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>
            Showing {jobs.length} of {jobs.length} jobs
          </div>
          <div className='flex gap-2'>
            <button
              className='px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50'
              disabled
            >
              Previous
            </button>
            <button
              className='px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50'
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Sidebar */}
      {sidebarOpen && selectedJobId && (
        <>
          {/* Overlay */}
          <div className='fixed inset-0 z-40' onClick={closeSidebar} />

          {/* Sidebar */}
          <aside className='fixed top-0 right-0 h-full w-full md:w-96 lg:w-[32rem] bg-white z-50 overflow-y-auto border border-gray-200'>
            <header className='sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-800'>
                Job Details
              </h2>
              <button
                onClick={closeSidebar}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </header>

            <div className='h-full'>
              <Jobs
                jobId={selectedJobId}
                onClose={closeSidebar}
                isSidebar={true}
              />
            </div>
          </aside>
        </>
      )}
    </article>
  );
}
