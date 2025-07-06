import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  MoreVertical,
  FileText,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  Play,
  X,
} from 'lucide-react';
import { useEmployer } from '../../contexts/EmployerProvider';
import JobForm from '../../components/JobForm';

export function Dashboard({ handleRoleChange }) {
  const navigate = useNavigate();
  const { jobs, loading, error, refetch, deleteJob, endJob, fetchJobById } =
    useEmployer();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobForm, setJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isEnding, setIsEnding] = useState(null);
  const [fetchingJobDetails, setFetchingJobDetails] = useState(false);

  function jobFormOnToggle(value) {
    setJobForm(value);
  }

  // Transform API data to match component expectations with proper error handling
  const posts = Array.isArray(jobs)
    ? jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: 'Full-time', // Default since not in API
        date: job.created_at
          ? new Date(job.created_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        status: job.life_cycle === 'active' ? 'Active' : 'Ended',
        applicants: job.applicants_count || job.total_applicants_count || 0,
        description: job.description,
      }))
    : [];

  // Show error state only when there's an error and no jobs are available
  if (error && jobs.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-8 gap-4'>
        <AlertCircle className='w-12 h-12 text-red-500' />
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-red-700'>
            Error Loading Jobs
          </h3>
          <p className='text-red-600 mt-2'>{error}</p>
          <button
            onClick={refetch}
            className='mt-4 px-4 py-2 bg-accent-500 text-white rounded hover:bg-accent-600 flex items-center gap-2'
          >
            <RefreshCw className='w-4 h-4' />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleCreateJob = () => {
    setEditingJob(null);
    setJobForm(true);
  };

  const handleEditJob = async (job) => {
    setEditingJob(job);
    setFetchingJobDetails(true);
    try {
      const fetchedJob = await fetchJobById(job.id);
      setEditingJob(fetchedJob);
      setJobForm(true);
    } catch (error) {
      console.error('Error fetching job details for editing:', error);
      alert('Failed to fetch job details for editing.');
    } finally {
      setFetchingJobDetails(false);
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

  const handleJobFormSuccess = () => {
    setJobForm(false);
    setEditingJob(null);
    refetch();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      post.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  let tableContent;

  if (loading && filteredPosts.length === 0) {
    tableContent = (
      <tr>
        <td colSpan='9' className='py-8 px-4 text-center text-gray-500'>
          <div className='flex items-center justify-center'>
            <Loader2 className='w-5 h-5 animate-spin mr-2' />
            <span>Loading jobs...</span>
          </div>
        </td>
      </tr>
    );
  } else if (filteredPosts.length === 0) {
    tableContent = (
      <tr>
        <td colSpan='9' className='py-8 px-4 text-center text-gray-500'>
          {searchTerm || statusFilter !== 'all'
            ? 'No jobs match your filters'
            : 'No jobs posted yet'}
        </td>
      </tr>
    );
  } else {
    tableContent = filteredPosts.map((post) => (
      <tr key={post.id} className='hover:bg-gray-50'>
        <td className='py-4 px-4 whitespace-nowrap'>
          <div className='flex items-center'>
            <FileText className='w-5 h-5 text-gray-400 mr-3' />
            <span className='font-medium text-gray-900'>{post.title}</span>
          </div>
        </td>
        <td className='py-4 px-4 text-gray-700 whitespace-nowrap'>
          {post.company}
        </td>
        <td className='py-4 px-4 whitespace-nowrap'>
          <div className='flex items-center text-gray-700'>
            <MapPin className='w-4 h-4 mr-1' />
            {post.location}
          </div>
        </td>
        <td className='py-4 px-4 whitespace-nowrap'>
          <div className='flex items-center text-gray-700'>
            <span className='mr-1'>₱</span>
            {post.salary}
          </div>
        </td>
        <td className='py-4 px-4 whitespace-nowrap'>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
              post.type === 'Full-time'
                ? 'bg-accent-100 text-accent-800'
                : post.type === 'Part-time'
                ? 'bg-accent-100 text-accent-800'
                : 'bg-accent-100 text-accent-800'
            }`}
          >
            <Briefcase className='w-3 h-3 mr-1' />
            {post.type}
          </span>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center text-gray-700'>
            <Calendar className='w-4 h-4 mr-1' />
            {post.date}
          </div>
        </td>
        <td className='py-4 px-4'>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              post.status === 'Active'
                ? 'bg-accent-100 text-accent-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {post.status}
          </span>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center text-gray-700'>
            <Users className='w-4 h-4 mr-1' />
            {post.applicants}
          </div>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handleEditJob(post)}
              disabled={fetchingJobDetails}
              className='text-accent-600 hover:text-accent-800 p-1 transition-colors'
              title='Edit Job'
            >
              <Edit className='w-4 h-4' />
            </button>
            <button
              onClick={() => navigate(`/employer/jobs/${post.id}/users`)}
              className='text-accent-600 hover:text-accent-800 p-1'
              title='View Applicants'
            >
              <Eye className='w-4 h-4' />
            </button>
            {post.status === 'Active' && (
              <button
                onClick={() => handleEndJob(post.id)}
                disabled={isEnding === post.id}
                className='text-orange-600 hover:text-orange-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed'
                title='End Job'
              >
                <span className='flex items-center'>
                  {isEnding === post.id ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <PauseCircle className='w-4 h-4' />
                  )}
                  End Job
                </span>
              </button>
            )}
            <button
              onClick={() => handleDeleteJob(post.id)}
              disabled={isDeleting === post.id}
              className='text-red-600 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              title='Delete Job'
            >
              {isDeleting === post.id ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Trash2 className='w-4 h-4' />
              )}
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <article className='w-full'>
      <header className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          Job Postings Dashboard
        </h1>
        <p className='text-gray-600'>Manage and track your job listings</p>
      </header>

      <section className='bg-white rounded-lg border border-gray-200 mb-6 overflow-x-auto'>
        <div className='p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h2 className='text-lg font-semibold text-gray-800'>
              Your Postings
            </h2>
            <p className='text-gray-500 text-sm'>
              You have {filteredPosts.length} job postings
            </p>
          </div>

          <div className='flex flex-col md:flex-row gap-3 w-full md:w-auto'>
            <div className='relative flex-1 md:flex-none'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search postings...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full md:w-64 py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent'
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent'
            >
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='ended'>Ended</option>
            </select>

            <button
              onClick={() => setJobForm(true)}
              className='flex items-center gap-2 py-2 px-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors'
            >
              <Plus className='w-4 h-4' />
              <span>New Post</span>
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead className='bg-gray-50 border-y border-gray-200'>
              <tr>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Job Title
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Company
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Location
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Salary
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                  Type
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Posted Date
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Applicants
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>{tableContent}</tbody>
          </table>
        </div>

        <div className='py-3 px-4 border-t border-gray-200 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>
            Showing {filteredPosts.length} of {posts.length} results
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => navigate('/employer/jobs')}
              className='px-3 py-1 bg-accent-600 text-white rounded-md text-sm hover:bg-accent-700 transition-colors'
            >
              View All Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Job Form Modal */}
      <JobForm
        isOpen={jobForm}
        onClose={() => {
          setJobForm(false);
          setEditingJob(null);
        }}
        editingJob={editingJob}
        onSuccess={handleJobFormSuccess}
      />
    </article>
  );
}
