import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { api } from '../../lib/axios';

export function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobsPerPage = 8;

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const response = await api.get('/jobs/history');
        setJobHistory(response.data.data);
      } catch (err) {
        setError('Failed to fetch job history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-100 text-accent-800';
      case 'active':
        return 'bg-accent-100 text-accent-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-4 h-4' />;
      case 'active':
        return <Clock className='w-4 h-4' />;
      case 'cancelled':
        return <XCircle className='w-4 h-4' />;
      default:
        return <Clock className='w-4 h-4' />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateSuccessRate = () => {
    const completedJobs = jobHistory.filter(
      (job) => job.status === 'completed'
    );
    const totalHired = completedJobs.reduce((sum, job) => sum + job.hired, 0);
    return completedJobs.length > 0
      ? ((totalHired / completedJobs.length) * 100).toFixed(1)
      : 0;
  };

  const getTotalStats = () => {
    return {
      totalJobs: jobHistory.length,
      activeJobs: jobHistory.filter((job) => job.status === 'active').length,
      completedJobs: jobHistory.filter((job) => job.status === 'completed')
        .length,
      totalApplicants: jobHistory.reduce(
        (sum, job) => sum + job.totalApplicants,
        0
      ),
    };
  };

  const stats = getTotalStats();

  const filteredJobs = jobHistory.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg p-6 mb-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Job Posting History
              </h1>
              <p className='text-gray-600 mt-1'>
                Track your job posting performance and hiring success
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <BarChart3 className='w-5 h-5 text-accent-600' />
              <span className='text-sm font-medium text-gray-700'>
                Success Rate: {calculateSuccessRate()}%
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Jobs</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.totalJobs}
                </p>
              </div>
              <Briefcase className='w-8 h-8 text-accent-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Active Jobs</p>
                <p className='text-2xl font-bold text-accent-600'>
                  {stats.activeJobs}
                </p>
              </div>
              <Clock className='w-8 h-8 text-accent-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Completed</p>
                <p className='text-2xl font-bold text-accent-600'>
                  {stats.completedJobs}
                </p>
              </div>
              <CheckCircle className='w-8 h-8 text-accent-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Applicants</p>
                <p className='text-2xl font-bold text-accent-600'>
                  {stats.totalApplicants}
                </p>
              </div>
              <Users className='w-8 h-8 text-accent-600' />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='bg-white rounded-lg p-6 mb-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search jobs by title or location...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                disabled={loading}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
              disabled={loading}
            >
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='completed'>Completed</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Jobs History Table */}
        <div className='bg-white rounded-lg overflow-hidden'>
          {loading ? (
            <div className='text-center py-8 text-gray-600'>
              Loading job history...
            </div>
          ) : error ? (
            <div className='text-center py-8 text-red-600'>Error: {error}</div>
          ) : filteredJobs.length === 0 ? (
            <div className='text-center py-8 text-gray-600'>
              No job history found.
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Job Details
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Duration
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Results
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {currentJobs.map((job) => (
                    <tr key={job.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {job.title}
                          </div>
                          <div className='flex items-center gap-4 text-sm text-gray-500 mt-1'>
                            <div className='flex items-center gap-1'>
                              <MapPin className='w-3 h-3' />
                              {job.location}
                            </div>
                            <div className='flex items-center gap-1'>
                              <DollarSign className='w-3 h-3' />
                              {job.salary}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Briefcase className='w-3 h-3' />
                              {job.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {getStatusIcon(job.status)}
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        <div>
                          <div className='font-medium'>{job.duration}</div>
                          <div className='text-gray-500'>
                            {formatDate(job.postedDate)} -{' '}
                            {formatDate(job.endedDate)}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          {job.hired > 0 ? (
                            <div>
                              <div className='flex items-center gap-1 text-sm font-medium text-green-600'>
                                <TrendingUp className='w-3 h-3' />
                                Hired: {job.hired}
                              </div>
                              {job.hiredCandidate && (
                                <div className='text-xs text-gray-500 mt-1'>
                                  {job.hiredCandidate}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className='flex items-center gap-1 text-sm text-gray-500'>
                              <TrendingDown className='w-3 h-3' />
                              No hire
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='bg-white rounded-lg p-4 mt-6'>
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
                  disabled={currentPage === 1 || loading}
                  className='p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
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
                  disabled={currentPage === totalPages || loading}
                  className='p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
