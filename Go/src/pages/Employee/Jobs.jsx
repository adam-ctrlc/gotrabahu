import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Phone,
  Clock,
  MessageCircle,
  User,
  Send,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useEmployeeJob } from '../../contexts/EmployeeJobProvider';
import { getJobById } from '../../helper/Jobs/Employee';

export function Jobs({ jobId, onClose, isSidebar = false }) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const id = jobId || routeId;
  const {
    jobs,
    loading: contextLoading,
    applyJob,
    cancelJob,
    createComment,
    deleteComment,
    getComments,
    profile,
    appliedJobs,
  } = useEmployeeJob();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true); // Set to true initially
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [userApplication, setUserApplication] = useState(null);
  const [loadingApplicationStatus, setLoadingApplicationStatus] =
    useState(true); // Set to true initially

  useEffect(() => {
    const fetchJob = async () => {
      setError(null);

      // Set loading states to true at the beginning of the fetch attempt
      setLoading(true);
      setLoadingApplicationStatus(true);

      // If context is still loading, return and wait for context to be ready
      if (contextLoading) {
        return;
      }

      let foundJob = null;
      if (jobs && jobs.length > 0) {
        foundJob = jobs.find((j) => j.id === parseInt(id));
      }

      if (foundJob) {
        setJob(foundJob);
        const appliedJobFromContext = appliedJobs.get(parseInt(id));
        setUserApplication(appliedJobFromContext || null);
        setLoadingApplicationStatus(false);
        setLoading(false);
        await loadJobComments(foundJob.id);
      } else if (id) {
        // Fallback: If job not found in context, fetch from API
        try {
          const response = await getJobById(id);
          if (response && response.success && response.data) {
            setJob(response.data);
            setUserApplication(response.user_application || null);
            await loadJobComments(response.data.id);
          } else {
            setError('Job not found or API error');
          }
        } catch (apiError) {
          console.error('Error fetching job by ID:', apiError);
          setError('Failed to load job details from API');
        } finally {
          setLoading(false);
          setLoadingApplicationStatus(false);
        }
      } else {
        setError('Job ID is missing');
        setLoading(false);
        setLoadingApplicationStatus(false);
      }
    };

    if (id) {
      fetchJob();
    } else {
      setLoading(false);
      setError('Job ID is missing.');
      setLoadingApplicationStatus(false);
    }
  }, [id, jobs, appliedJobs, contextLoading]);

  const loadJobComments = async (jobId) => {
    try {
      setLoadingComments(true);
      const commentsData = await getComments(jobId);
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleApplyJob = async () => {
    if (!job || isApplying) return;

    try {
      setIsApplying(true);
      const response = await applyJob(job.id);

      if (response && response.success) {
        setUserApplication({
          ...userApplication,
          status: 'applied',
        });
      } else {
        alert(response?.message || 'Failed to apply for job.');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancelApplication = async () => {
    if (!job || isApplying) return;

    try {
      setIsApplying(true);
      const response = await cancelJob(job.id);

      if (response && response.success) {
        setUserApplication(null);
      } else {
        alert(response?.message || 'Failed to cancel application.');
      }
    } catch (error) {
      console.error('Error canceling application:', error);
      alert('Failed to cancel application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !job || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      await createComment(job.id, newComment.trim());
      setNewComment('');
      await loadJobComments(job.id);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;

    try {
      await deleteComment(commentId);
      await loadJobComments(job.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
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

  if (loading && !job) {
    return (
      <article className={isSidebar ? 'w-full p-4' : 'w-full p-4 md:p-6'}>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded mb-4'></div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      </article>
    );
  }

  if (error || !job) {
    return (
      <article className={isSidebar ? 'w-full p-4' : 'w-full p-4 md:p-6'}>
        <div className='text-center py-12'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
            Job Not Found
          </h2>
          <p className='text-gray-600 mb-4'>
            {error || 'The job you are looking for does not exist.'}
          </p>
          <button
            onClick={
              isSidebar ? onClose : () => navigate('/employee/dashboard')
            }
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            {isSidebar ? 'Close' : 'Back to Jobs'}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={isSidebar ? 'w-full p-4' : 'w-full p-4 md:p-6'}>
      <header className='mb-6'>
        {!isSidebar && (
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back</span>
          </button>
        )}

        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
          <div className='flex-1'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
              {job.title}
            </h1>
            <div className='flex items-center gap-2 text-gray-600 mb-4'>
              <Building2 className='w-5 h-5' />
              <span className='text-lg font-medium'>{job.company}</span>
            </div>
            <div className='flex flex-wrap gap-2'>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                  job.type
                )}`}
              >
                {getTypeLabel(job.type)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  job.life_cycle === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {job.life_cycle === 'active' ? 'Active' : 'Ended'}
              </span>
            </div>
          </div>

          {job.life_cycle === 'active' ? (
            <div className='flex flex-col gap-2 lg:w-auto w-full'>
              {loadingApplicationStatus ? (
                <button
                  disabled
                  className='px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2'
                >
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Checking status...
                </button>
              ) : userApplication ? (
                userApplication.status === 'applied' ? (
                  <button
                    onClick={handleCancelApplication}
                    disabled={isApplying}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isApplying
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                  >
                    {isApplying ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      'Withdraw Application'
                    )}
                  </button>
                ) : userApplication.status === 'accepted' ? (
                  <span className='w-full px-4 py-2 text-center rounded-lg text-sm font-medium bg-green-100 text-green-800'>
                    Application Accepted
                  </span>
                ) : (
                  <span className='w-full px-4 py-2 text-center rounded-lg text-sm font-medium bg-red-100 text-red-800'>
                    Application Rejected
                  </span>
                )
              ) : (
                <button
                  onClick={handleApplyJob}
                  disabled={isApplying}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isApplying
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-accent-600 text-white hover:bg-accent-700'
                    }`}
                >
                  {isApplying ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    'Apply Now'
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className='flex flex-col gap-2 lg:w-auto w-full'>
              <span className='w-full px-4 py-2 text-center rounded-lg text-sm font-medium bg-gray-100 text-gray-800'>
                Job Ended
              </span>
            </div>
          )}
        </div>
      </header>

      <section className='grid gap-6'>
        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Job Details
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <MapPin className='w-5 h-5 text-accent-600' />
              <div>
                <p className='text-sm text-gray-600'>Location</p>
                <p className='font-medium text-gray-800'>{job.location}</p>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <DollarSign className='w-5 h-5 text-accent-600' />
              <div>
                <p className='text-sm text-gray-600'>Salary</p>
                <p className='font-medium text-gray-800'>
                  {formatSalary(job.salary)}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <Users className='w-5 h-5 text-accent-600' />
              <div>
                <p className='text-sm text-gray-600'>Max Applicants</p>
                <p className='font-medium text-gray-800'>
                  {job.max_applicants}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <Calendar className='w-5 h-5 text-accent-600' />
              <div>
                <p className='text-sm text-gray-600'>Duration Until</p>
                <p className='font-medium text-gray-800'>
                  {formatDate(job.duration)}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <Phone className='w-5 h-5 text-accent-600' />
              <div>
                <p className='text-sm text-gray-600'>Contact</p>
                <p className='font-medium text-gray-800'>{job.contact}</p>
              </div>
            </div>

            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <Clock className='w-5 h-5 text-gray-600' />
              <div>
                <p className='text-sm text-gray-600'>Posted</p>
                <p className='font-medium text-gray-800'>
                  {formatDate(job.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Job Description
          </h2>
          <div className='prose prose-gray'>
            <p className='text-gray-700 leading-relaxed'>{job.description}</p>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Company Information
          </h2>
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center'>
              <Building2 className='w-6 h-6 text-accent-600' />
            </div>
            <div className='flex-1'>
              <h3 className='font-medium text-gray-800 mb-1'>{job.company}</h3>
              {console.log('Job object for rendering:', job)}
              <p className='text-gray-600 text-sm mb-2'>
                Employer: {job.employer?.first_name} {job.employer?.last_name}
              </p>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Phone className='w-4 h-4' />
                <span>{job.contact}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <MessageCircle className='w-5 h-5' />
            Comments
          </h2>

          <div className='space-y-4 mb-6'>
            {loadingComments ? (
              <div className='flex justify-center py-4'>
                <Loader2 className='w-6 h-6 animate-spin text-accent-600' />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={comment.id || index}
                  className='border-l-4 border-accent-200 pl-4 py-2'
                >
                  <div className='flex items-center justify-between mb-1'>
                    <div className='flex items-center gap-2'>
                      <User className='w-4 h-4 text-gray-500' />
                      <span className='font-medium text-gray-800'>
                        {comment.full_name ||
                          comment.user?.name ||
                          comment.author ||
                          'Anonymous'}
                      </span>
                      <span className='text-sm text-gray-500'>
                        {comment.created_at
                          ? formatDate(comment.created_at)
                          : 'Just now'}
                      </span>
                    </div>
                    {comment.user_id === profile?.user?.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className='text-red-500 hover:text-red-700 transition-colors p-1'
                        title='Delete comment'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                  <p className='text-gray-700'>
                    {comment.comment ||
                      comment.content ||
                      comment.text ||
                      comment.message}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center py-4'>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          <div className='border-t border-gray-300 pt-4'>
            <h3 className='font-medium text-gray-800 mb-3'>Add a Comment</h3>
            <div className='flex gap-3'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Share your thoughts about this job...'
                className='flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                rows='3'
              />
              <button
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || !newComment.trim()}
                className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center gap-2 h-fit disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmittingComment ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Send className='w-4 h-4' />
                )}
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
