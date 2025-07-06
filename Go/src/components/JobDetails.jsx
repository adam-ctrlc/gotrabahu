import { useState, useEffect } from 'react';
import {
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Building2,
  Phone,
  Clock,
  User,
  MessageCircle,
  Send,
} from 'lucide-react';
import { getJobById } from '../helper/Jobs/Employee';

export function JobDetails({ jobId, onClose }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) return;

      try {
        setLoading(true);
        const response = await getJobById(jobId);
        if (response && response.success) {
          setJob(response.data);
          setComments(response.comment || []);
        } else {
          setError('Failed to fetch job details');
        }
      } catch (error) {
        setError('Error fetching job details');
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

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

  if (loading) {
    return (
      <div className='animate-pulse'>
        <div className='h-8 bg-gray-200 rounded mb-4'></div>
        <div className='h-64 bg-gray-200 rounded'></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
          Error Loading Job
        </h3>
        <p className='text-gray-600 mb-4'>{error || 'Job not found'}</p>
        <button
          onClick={onClose}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl md:text-2xl font-bold text-gray-800 mb-2'>
          {job.title}
        </h1>
        <div className='flex items-center gap-2 text-gray-600 mb-4'>
          <Building2 className='w-5 h-5' />
          <span className='font-medium'>{job.company}</span>
        </div>
        <div className='flex flex-wrap gap-2 mb-4'>
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

        {job.life_cycle === 'active' && (
          <div className='flex flex-col gap-2'>
            <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'>
              Apply Now
            </button>
            <button className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
              Save Job
            </button>
          </div>
        )}
      </div>

      <div className='bg-gray-50 rounded-lg p-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Job Details
        </h3>
        <div className='grid gap-3'>
          <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
            <MapPin className='w-5 h-5 text-blue-600' />
            <div>
              <p className='text-sm text-gray-600'>Location</p>
              <p className='font-medium text-gray-800'>{job.location}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
            <DollarSign className='w-5 h-5 text-green-600' />
            <div>
              <p className='text-sm text-gray-600'>Salary</p>
              <p className='font-medium text-gray-800'>
                {formatSalary(job.salary)}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
            <Users className='w-5 h-5 text-purple-600' />
            <div>
              <p className='text-sm text-gray-600'>Max Applicants</p>
              <p className='font-medium text-gray-800'>{job.max_applicants}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
            <Calendar className='w-5 h-5 text-orange-600' />
            <div>
              <p className='text-sm text-gray-600'>Duration Until</p>
              <p className='font-medium text-gray-800'>
                {formatDate(job.duration)}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
            <Phone className='w-5 h-5 text-indigo-600' />
            <div>
              <p className='text-sm text-gray-600'>Contact</p>
              <p className='font-medium text-gray-800'>{job.contact}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
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

      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Job Description
        </h3>
        <p className='text-gray-700 leading-relaxed'>{job.description}</p>
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Company Information
        </h3>
        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
            <Building2 className='w-6 h-6 text-blue-600' />
          </div>
          <div className='flex-1'>
            <h4 className='font-medium text-gray-800 mb-1'>{job.company}</h4>
            <p className='text-gray-600 text-sm mb-2'>
              Employer ID: {job.employeer_id}
            </p>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Phone className='w-4 h-4' />
              <span>{job.contact}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
          <MessageCircle className='w-5 h-5' />
          Comments
        </h3>

        <div className='space-y-4 mb-6'>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className='border-l-4 border-blue-200 pl-4 py-2'>
                <div className='flex items-center gap-2 mb-1'>
                  <User className='w-4 h-4 text-gray-500' />
                  <span className='font-medium text-gray-800'>
                    {comment.full_name || comment.author || 'Anonymous'}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {comment.created_at
                      ? formatDate(comment.created_at)
                      : 'Just now'}
                  </span>
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
          <h4 className='font-medium text-gray-800 mb-3'>Add a Comment</h4>
          <div className='flex gap-3'>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Share your thoughts about this job...'
              className='flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              rows='3'
            />
            <button
              onClick={() => {
                if (newComment.trim()) {
                  const comment = {
                    author: 'Current User',
                    content: newComment,
                    created_at: new Date().toISOString(),
                  };
                  setComments([...comments, comment]);
                  setNewComment('');
                }
              }}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 h-fit'
            >
              <Send className='w-4 h-4' />
              Post
            </button>
          </div>
        </div>
      </div>

      {job.life_cycle === 'active' && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-blue-800 mb-2'>
            Ready to Apply?
          </h3>
          <p className='text-blue-700 mb-4'>
            Don't miss this opportunity! Apply now and take the next step in
            your career.
          </p>
          <div className='flex flex-col gap-3'>
            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'>
              Apply for this Position
            </button>
            <button className='px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors'>
              Contact Employer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
