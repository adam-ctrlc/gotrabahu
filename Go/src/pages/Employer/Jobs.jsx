import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Users,
  Trash2,
  Eye,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  PauseCircle,
  Loader2,
  MessageSquare,
  Clock,
  AlertCircle,
  RefreshCw,
  Star,
} from 'lucide-react';
import { useEmployer } from '../../contexts/EmployerProvider';
import JobForm from '../../components/JobForm';
import { api } from '../../lib/axios';
import ViewUsersModal from '../../components/ViewUsersModal'; // Import the new modal
import {
  getRating,
  submitRating,
  updateRating,
} from '../../helper/Jobs/Employeer';

export function Jobs() {
  const navigate = useNavigate();
  const { jobs, loading, error, refetch, deleteJob, updateJob, endJob } =
    useEmployer();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState({});
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isEnding, setIsEnding] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({}); // This state will now control which job's users are viewed in the modal
  const [jobApplicants, setJobApplicants] = useState({}); // This state will likely move to ViewUsersModal
  const [isUpdatingApplicant, setIsUpdatingApplicant] = useState(null); // This state will likely move to ViewUsersModal
  const [showViewUsersModal, setShowViewUsersModal] = useState(false); // New state for ViewUsersModal
  const [selectedJobForUsers, setSelectedJobForUsers] = useState(null); // New state to store job data for ViewUsersModal
  const jobsPerPage = 6;

  // Transform API data to match migration schema
  const jobsData =
    jobs?.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      contact: job.contact,
      max_applicants: job.max_applicants || '20',
      type: job.type || 'full_time', // full_time, part_time, order
      status: job.life_cycle || 'active', // active, ended
      duration: job.duration,
      postedDate: job.created_at || new Date().toISOString(),
      applicants: job.applicants_count || 0,
      description: job.description,
      comments: job.comments || [],
    })) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-accent-100 text-accent-800';
      case 'ended':
        return 'bg-accent-100 text-accent-800'; // Changed from red to accent
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Play className='w-3 h-3 text-accent-600' />;
      case 'ended':
        return <Square className='w-3 h-3 text-accent-600' />;
      default:
        return <Clock className='w-3 h-3 text-gray-600' />;
    }
  };

  const getTypeDisplay = (type) => {
    switch (type) {
      case 'full_time':
        return 'Full-time';
      case 'part_time':
        return 'Part-time';
      case 'order':
        return 'Order-based';
      case 'contract':
        return 'Contract';
      case 'temporary':
        return 'Temporary';
      case 'internship':
        return 'Internship';
      case 'freelance':
        return 'Freelance';
      default:
        return 'Full-time';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJob(jobId, { life_cycle: newStatus });
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const handleEndJob = async (jobId) => {
    if (
      window.confirm(
        'Are you sure you want to end this job? This will close the job and mark all pending applications as done.'
      )
    ) {
      try {
        setIsEnding(jobId);
        await endJob(jobId);
      } catch (error) {
        console.error('Error ending job:', error);
        alert('Failed to end job');
      } finally {
        setIsEnding(null);
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        setIsDeleting(jobId);
        await deleteJob(jobId);
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleJobFormSuccess = () => {
    setShowJobForm(false);
    setEditingJob(null);
  };

  const toggleComments = (jobId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // Modified handleViewUsers to open the modal
  const handleViewUsers = (job) => {
    setSelectedJobForUsers(job);
    setShowViewUsersModal(true);
  };

  const handleCloseViewUsersModal = () => {
    setShowViewUsersModal(false);
    setSelectedJobForUsers(null);
    refetch(); // Refresh jobs after closing the modal, in case of status/rating changes
  };

  const handleUpdateApplicationStatus = async (
    jobId,
    applicationId,
    status
  ) => {
    if (
      window.confirm(`Are you sure you want to ${status} this application?`)
    ) {
      try {
        setIsUpdatingApplicant(applicationId);
        await api.post(`/jobs/user-applied/${applicationId}`, { status });
        // Refresh applicants for the specific job after update
        // This logic will move to ViewUsersModal
        alert(`Application ${status} successfully!`);
      } catch (error) {
        console.error(`Error ${status} application:`, error);
        alert(`Failed to ${status} application.`);
      } finally {
        setIsUpdatingApplicant(null);
      }
    }
  };

  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse'
          >
            <div className='p-6 border-b border-gray-200'>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3'>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                    <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                    <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                  </div>
                  <div className='bg-gray-50 rounded-lg p-3'>
                    <h4 className='font-medium text-gray-900 mb-1'>Company</h4>
                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                  </div>
                </div>
              </div>
            </div>

            <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
              <div className='flex flex-wrap gap-2'>
                <div className='h-8 bg-gray-200 rounded-md w-20'></div>
                <div className='h-8 bg-gray-200 rounded-md w-24'></div>
                <div className='h-8 bg-gray-200 rounded-md w-28'></div>
                <div className='h-8 bg-gray-200 rounded-md w-20'></div>
                <div className='h-8 bg-gray-200 rounded-md w-20'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 mx-auto mb-4 text-accent-600' />
          <p className='text-gray-600 mb-4'>Error loading jobs: {error}</p>
          <button
            onClick={refetch}
            className='bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors flex items-center gap-2 mx-auto'
          >
            <RefreshCw className='w-4 h-4' />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                My Posted Jobs
              </h1>
              <p className='text-gray-600 mt-1'>
                Manage your job postings and track applications
              </p>
            </div>
            <button
              onClick={handleCreateJob}
              className='bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors flex items-center gap-2'
            >
              <Plus className='w-4 h-4' />
              Post New Job
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search jobs by title or location...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
            >
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='ended'>Ended</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className='bg-white rounded-lg border border-gray-200 overflow-hidden'
            >
              {/* Job Header */}
              <div className='p-6 border-b border-gray-200'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h3 className='text-xl font-semibold text-gray-900'>
                        {job.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {getStatusIcon(job.status)}
                        {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)}
                      </span>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3'>
                      <div className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4 text-gray-500' />
                        {job.location}
                      </div>
                      <div className='flex items-center gap-1'>
                        <span className='w-4 h-4 mr-1 text-gray-500' />
                        {job.salary}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Briefcase className='w-4 h-4 text-gray-500' />
                        {getTypeDisplay(job.type)}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4 text-gray-500' />
                        Duration:{' '}
                        {job.duration
                          ? formatDate(job.duration)
                          : 'Not specified'}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Users className='w-4 h-4 text-gray-500' />
                        {job.applicants}/{job.max_applicants} applicants
                      </div>
                      <div className='flex items-center gap-1'>
                        <MessageSquare className='w-4 h-4 text-gray-500' />
                        Contact: {job.contact}
                      </div>
                    </div>
                    <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                      <h4 className='font-medium text-gray-900 mb-1'>
                        Company
                      </h4>
                      <p className='text-gray-700 mb-2'>{job.company}</p>
                      <h4 className='font-medium text-gray-900 mb-1'>
                        Description
                      </h4>
                      <p className='text-gray-700'>{job.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
                <div className='flex flex-wrap gap-2'>
                  <button
                    onClick={() => handleEditJob(job)}
                    disabled={job.status === 'ended'} // Disable if job is Ended
                    className='text-accent-600 hover:text-accent-800 p-1 transition-colors flex items-center gap-1 text-sm'
                    title='Edit Job'
                  >
                    <Edit className='w-3 h-3' />
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewUsers(job)}
                    className='text-accent-600 hover:text-accent-800 p-1 transition-colors flex items-center gap-1 text-sm'
                    title='View Applicants'
                  >
                    <Eye className='w-3 h-3' />
                    View Users
                  </button>
                  <button
                    onClick={() => toggleComments(job.id)}
                    className='text-gray-600 hover:text-gray-800 p-1 transition-colors flex items-center gap-1 text-sm'
                  >
                    <MessageSquare className='w-3 h-3' />
                    Comments ({job.comments.length})
                  </button>
                  {job.status === 'active' && (
                    <button
                      onClick={() => handleEndJob(job.id)}
                      disabled={isEnding === job.id}
                      className='text-accent-600 hover:text-accent-800 p-1 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isEnding === job.id ? (
                        <Loader2 className='w-3 h-3 animate-spin' />
                      ) : (
                        <PauseCircle className='w-3 h-3' />
                      )}
                      End Job
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={isDeleting === job.id || job.status === 'ended'} // Disable if job is Ended
                    className='text-accent-600 hover:text-accent-800 p-1 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Delete Job'
                  >
                    {isDeleting === job.id ? (
                      <Loader2 className='w-3 h-3 animate-spin' />
                    ) : (
                      <Trash2 className='w-3 h-3' />
                    )}
                    Delete
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {expandedComments[job.id] && (
                <div className='p-6 border-t border-gray-200'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                    Comments
                  </h4>
                  <div className='space-y-4'>
                    {job.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className='bg-gray-50 rounded-lg p-4 border border-gray-200'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                            {comment.avatar}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='font-medium text-gray-900'>
                                {comment.user}
                              </span>
                              <span className='text-sm text-gray-500'>
                                {formatDate(comment.date)}
                              </span>
                              <div className='flex items-center gap-1'>
                                <span className='text-accent-500'>★</span>
                                <span className='text-sm text-gray-600'>
                                  {comment.rating}
                                </span>
                              </div>
                            </div>
                            <p className='text-gray-700'>{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applied Users Section (removed from here) */}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='bg-white rounded-lg border border-gray-200 p-4 mt-6'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + jobsPerPage, filteredJobs.length)} of{' '}
                {filteredJobs.length} jobs
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className='p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
                <span className='px-3 py-1 text-sm font-medium'>
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className='p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Form Modal */}
        <JobForm
          editingJob={editingJob}
          isOpen={showJobForm}
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          onSuccess={handleJobFormSuccess}
        />

        {/* View Users Modal */}
        {showViewUsersModal && selectedJobForUsers && (
          <ViewUsersModal
            isOpen={showViewUsersModal}
            onClose={handleCloseViewUsersModal}
            jobData={selectedJobForUsers}
          />
        )}
      </div>
    </div>
  );
}
