import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminProvider';

export function Jobs() {
  const {
    jobs,
    loading,
    error,
    refetch,
    createNewJob,
    updateJobById,
    deleteJobById,
    getJobDetails,
    updateJobStatusById,
  } = useAdmin();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    type: 'full_time',
    max_applicants: '',
    duration: '',
    life_cycle: 'active',
  });

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen w-full p-4 md:p-6'>
        <div className='text-center space-y-4 w-full px-4'>
          {/* Top stats section shimmer */}
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

          {/* Tabs section shimmer */}
          <div className='bg-white rounded-lg border border-gray-200 mb-6 w-full animate-pulse'>
            <div className='border-b border-gray-200'>
              <nav className='flex px-4 py-3'>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-8 bg-gray-200 rounded w-24 mx-2'
                  ></div>
                ))}
              </nav>
            </div>
            <div className='p-4 md:p-6 space-y-4'>
              <div className='h-10 bg-gray-200 rounded w-full'></div>{' '}
              {/* Search bar */}
              {Array.from({ length: 3 }).map((_, index) => (
                <article
                  key={index}
                  className='bg-gray-50 rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse w-full'
                >
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
                  <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='h-4 bg-gray-200 rounded'></div>
                    <div className='h-4 bg-gray-200 rounded'></div>
                  </div>
                  <div className='flex gap-2'>
                    <div className='h-8 bg-gray-200 rounded w-20'></div>
                    <div className='h-8 bg-gray-200 rounded w-20'></div>
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
          <p className='text-gray-600 mb-4'>Failed to load jobs</p>
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

  // Create jobs data structure from context
  const jobsData = {
    success: true,
    jobs: jobs || [],
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (salary) => {
    return `$${parseInt(salary).toLocaleString()}`;
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
    switch (lifecycle) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (lifecycle) => {
    switch (lifecycle) {
      case 'active':
        return <CheckCircle className='w-4 h-4 text-green-600' />;
      case 'pending':
        return <AlertCircle className='w-4 h-4 text-yellow-600' />;
      case 'ended':
        return <XCircle className='w-4 h-4 text-red-600' />;
      default:
        return <AlertCircle className='w-4 h-4 text-gray-600' />;
    }
  };

  const getFilteredJobs = () => {
    let filtered = jobsData.jobs;

    if (activeTab !== 'all') {
      filtered = filtered.filter((job) => job.life_cycle === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getJobStats = () => {
    const jobs = jobsData.jobs;
    return {
      total: jobs.length,
      active: jobs.filter((job) => job.life_cycle === 'active').length,
      pending: jobs.filter((job) => job.life_cycle === 'pending').length,
      ended: jobs.filter((job) => job.life_cycle === 'ended').length,
    };
  };

  const stats = getJobStats();
  const filteredJobs = getFilteredJobs();

  // CRUD Handler Functions
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createNewJob(formData);
      setShowCreateModal(false);
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        salary: '',
        type: 'full_time',
        max_applicants: '',
        duration: '',
        life_cycle: 'active',
      });
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateJobById(selectedJob.id, formData);
      setShowEditModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJobById(jobId);
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleViewJob = async (jobId) => {
    try {
      const jobDetails = await getJobDetails(jobId);
      setSelectedJob(jobDetails);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const openEditModal = async (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title || '',
      company: job.company || '',
      description: job.description || '',
      location: job.location || '',
      salary: job.salary || '',
      type: job.type || 'full_time',
      max_applicants: job.max_applicants || '',
      duration: job.duration || '',
      life_cycle: job.life_cycle || 'active',
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatusById(jobId, newStatus);
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  return (
    <main className='w-full p-4 md:p-6'>
      <header className='mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
              Job Management
            </h1>
            <p className='text-gray-600'>
              Manage job postings and applications
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors lg:w-auto w-full justify-center'
          >
            <Plus className='w-4 h-4' />
            Post New Job
          </button>
        </div>
      </header>

      <section className='mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-accent-100 rounded-lg'>
                <Briefcase className='w-6 h-6 text-accent-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Jobs</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {stats.total}
                </p>
              </div>
            </div>
          </article>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <CheckCircle className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Active Jobs</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {stats.active}
                </p>
              </div>
            </div>
          </article>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <AlertCircle className='w-6 h-6 text-yellow-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Pending Jobs</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {stats.pending}
                </p>
              </div>
            </div>
          </article>
          <article className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <XCircle className='w-6 h-6 text-red-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Ended Jobs</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {stats.ended}
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
                All Jobs ({stats.total})
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
                onClick={() => setActiveTab('ended')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'ended'
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Ended ({stats.ended})
              </button>
            </nav>
          </div>

          <div className='p-4 md:p-6'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
              <div className='relative flex-1 md:max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search jobs...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                />
              </div>
              <div className='flex gap-2'>
                <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                  <Filter className='w-4 h-4' />
                  Filter
                </button>
              </div>
            </div>

            <div className='grid gap-4'>
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className='bg-gray-50 rounded-lg border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-colors'
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
                            <Users className='w-4 h-4' />
                            <span className='text-sm'>
                              Employer: {job.employer_name}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          {getStatusIcon(job.life_cycle)}
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              job.life_cycle
                            )}`}
                          >
                            {job.life_cycle.charAt(0).toUpperCase() +
                              job.life_cycle.slice(1)}
                          </span>
                        </div>
                      </div>

                      <p className='text-gray-700 mb-4 line-clamp-2'>
                        {job.description}
                      </p>

                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <MapPin className='w-4 h-4 text-blue-600' />
                          <span>{job.location}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <DollarSign className='w-4 h-4 text-green-600' />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Users className='w-4 h-4 text-purple-600' />
                          <span>
                            {job.current_applicants}/{job.max_applicants}{' '}
                            applicants
                          </span>
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
                          Posted {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 lg:w-auto w-full'>
                      <button
                        onClick={() => handleViewJob(job.id)}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openEditModal(job)}
                        className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'
                      >
                        Edit Job
                      </button>
                      {job.life_cycle === 'active' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'pending')}
                          className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm'
                        >
                          Pause Job
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className='px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm'
                      >
                        Delete Job
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className='text-center py-12'>
                <Briefcase className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <h2 className='text-xl font-semibold text-gray-600 mb-2'>
                  No Jobs Found
                </h2>
                <p className='text-gray-500'>
                  No jobs match your current filters. Try adjusting your search
                  criteria.
                </p>
              </div>
            )}

            {filteredJobs.length > 0 && (
              <div className='flex items-center justify-between mt-6'>
                <p className='text-sm text-gray-600'>
                  Showing {filteredJobs.length} of {stats.total} jobs
                </p>
                <div className='flex items-center gap-2'>
                  <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                    <ChevronLeft className='w-4 h-4' />
                  </button>
                  <span className='px-3 py-1 bg-accent-600 text-white rounded-lg text-sm'>
                    1
                  </span>
                  <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Create New Job
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>
              <form onSubmit={handleCreateJob} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Job Title
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Company
                    </label>
                    <input
                      type='text'
                      name='company'
                      value={formData.company}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                    required
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Location
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Salary
                    </label>
                    <input
                      type='number'
                      name='salary'
                      value={formData.salary}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Job Type
                    </label>
                    <select
                      name='type'
                      value={formData.type}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                    >
                      <option value='full_time'>Full Time</option>
                      <option value='part_time'>Part Time</option>
                      <option value='order'>Per Order</option>
                    </select>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Max Applicants
                    </label>
                    <input
                      type='number'
                      name='max_applicants'
                      value={formData.max_applicants}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Duration
                    </label>
                    <input
                      type='date'
                      name='duration'
                      value={formData.duration}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div className='flex justify-end gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => setShowCreateModal(false)}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50'
                  >
                    {isSubmitting ? 'Creating...' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && selectedJob && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Edit Job
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>
              <form onSubmit={handleEditJob} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Job Title
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Company
                    </label>
                    <input
                      type='text'
                      name='company'
                      value={formData.company}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                    required
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Location
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Salary
                    </label>
                    <input
                      type='number'
                      name='salary'
                      value={formData.salary}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Job Type
                    </label>
                    <select
                      name='type'
                      value={formData.type}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                    >
                      <option value='full_time'>Full Time</option>
                      <option value='part_time'>Part Time</option>
                      <option value='order'>Per Order</option>
                    </select>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Max Applicants
                    </label>
                    <input
                      type='number'
                      name='max_applicants'
                      value={formData.max_applicants}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Duration
                    </label>
                    <input
                      type='date'
                      name='duration'
                      value={formData.duration}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div className='flex justify-end gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => setShowEditModal(false)}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50'
                  >
                    {isSubmitting ? 'Updating...' : 'Update Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Job Modal */}
      {showViewModal && selectedJob && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Job Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Job Title
                    </label>
                    <p className='mt-1 text-gray-900'>{selectedJob.title}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Company
                    </label>
                    <p className='mt-1 text-gray-900'>{selectedJob.company}</p>
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <p className='mt-1 text-gray-900'>
                    {selectedJob.description}
                  </p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Location
                    </label>
                    <p className='mt-1 text-gray-900'>{selectedJob.location}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Salary
                    </label>
                    <p className='mt-1 text-gray-900'>
                      {formatSalary(selectedJob.salary)}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Job Type
                    </label>
                    <p className='mt-1 text-gray-900'>
                      {getTypeLabel(selectedJob.type)}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Applicants
                    </label>
                    <p className='mt-1 text-gray-900'>
                      {selectedJob.current_applicants}/
                      {selectedJob.max_applicants}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Status
                    </label>
                    <p className='mt-1 text-gray-900'>
                      {selectedJob.life_cycle}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Duration
                    </label>
                    <p className='mt-1 text-gray-900'>
                      {formatDate(selectedJob.duration)}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Posted Date
                    </label>
                    <p className='mt-1 text-gray-900'>
                      {formatDate(selectedJob.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex justify-end pt-6'>
                <button
                  onClick={() => setShowViewModal(false)}
                  className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
