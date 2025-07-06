import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Eye,
  Download,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Building,
  DollarSign,
  TrendingUp,
  History,
} from 'lucide-react';
import { useEmployer } from '../../contexts/EmployerProvider';
import { getRating, submitRating, updateRating } from '../../helper/Rating';

export default function UsersInJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const {
    jobs,
    userApplications,
    loading,
    error,
    refetch,
    updateUserApplication,
    getUserDetails,
    getUserProfileDetails,
    currentJobApplicants,
    fetchJobApplicants,
  } = useEmployer();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(null);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [detailedProfile, setDetailedProfile] = useState(null);

  // Rating states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedApplicantForRating, setSelectedApplicantForRating] =
    useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  const usersPerPage = 8;

  // Get job data
  const jobData = jobs?.find((job) => job.id === parseInt(jobId));
  const isJobEnded = jobData?.life_cycle === 'ended';

  // Get users data for this job
  const usersData = userApplications || [];

  // Fetch user applications when component mounts
  useEffect(() => {
    if (jobId) {
      fetchJobApplicants(jobId);
    }
  }, [jobId, fetchJobApplicants]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'accepted':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <Clock className='w-3 h-3' />;
      case 'accepted':
        return <CheckCircle className='w-3 h-3' />;
      case 'rejected':
        return <XCircle className='w-3 h-3' />;
      default:
        return <Clock className='w-3 h-3' />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'applied':
        return 'Pending';
      case 'accepted':
        return 'Hired';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    console.log('renderStars received rating:', rating);
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key='half'
          className='w-4 h-4 fill-yellow-400/50 text-yellow-400'
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className='w-4 h-4 text-gray-300' />);
    }

    return stars;
  };

  const getStatusStats = () => {
    return {
      total: usersData.length,
      pending: usersData.filter((user) => user.status === 'applied').length,
      hired: usersData.filter((user) => user.status === 'accepted').length,
      rejected: usersData.filter((user) => user.status === 'rejected').length,
    };
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setIsUpdating(applicationId);
      const response = await updateUserApplication(applicationId, {
        status: newStatus,
      });

      if (response.success) {
        // Add a small delay to ensure backend is updated
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Refresh the applications list
        await fetchJobApplicants(jobId);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert(`Failed to update application status: ${error.message || error}`);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleViewProfile = async (userId) => {
    try {
      setProfileLoading(true);
      const response = await getUserProfileDetails(userId);
      if (response && response.success) {
        setDetailedProfile(response.data);
        setSelectedUserForProfile(true);
      } else {
        console.warn('No detailed profile found for userId:', userId, response);
        alert('Failed to load user profile.');
      }
    } catch (error) {
      console.error('Error fetching detailed user profile:', error);
      alert('Error loading user profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfileModal = () => {
    setSelectedUserForProfile(null);
    setDetailedProfile(null);
  };

  // Rating functions
  const handleRateUser = async (userId, firstName, lastName) => {
    try {
      setIsRatingLoading(true);
      // Check if rating already exists
      const existingRating = await getRating(jobId, userId);
      if (existingRating.success && existingRating.data) {
        setCurrentRating(parseInt(existingRating.data.rating));
      } else {
        setCurrentRating(0);
      }
    } catch (error) {
      console.log('No existing rating found, starting fresh');
      setCurrentRating(0);
    } finally {
      setIsRatingLoading(false);
    }

    setSelectedApplicantForRating({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
    });
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating) => {
    if (!selectedApplicantForRating || !jobId) return;

    try {
      setIsRatingLoading(true);
      const { user_id } = selectedApplicantForRating;

      // Check if rating already exists
      const existingRating = await getRating(jobId, user_id);

      if (existingRating.success && existingRating.data) {
        // Update existing rating
        await updateRating(jobId, user_id, rating);
      } else {
        // Submit new rating
        await submitRating(jobId, user_id, rating);
      }

      alert('Rating submitted successfully!');
      // Refresh the applications list to show the updated rating on the card
      await fetchJobApplicants(jobId);
      setShowRatingModal(false);
      setSelectedApplicantForRating(null);
      setCurrentRating(0);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsRatingLoading(false);
    }
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedApplicantForRating(null);
    setCurrentRating(0);
  };

  const stats = getStatusStats();

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    const matchesRating =
      ratingFilter === 'all' ||
      (ratingFilter === '4+' && (user.rating || 0) >= 4) ||
      (ratingFilter === '4.5+' && (user.rating || 0) >= 4.5);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white rounded-lg p-6 mb-6 border border-gray-200'>
            <div className='h-8 bg-gray-200 rounded w-1/2 mb-4'></div>
            <div className='grid grid-cols-3 gap-4'>
              <div className='h-6 bg-gray-200 rounded w-full'></div>
              <div className='h-6 bg-gray-200 rounded w-full'></div>
              <div className='h-6 bg-gray-200 rounded w-full'></div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg p-5 border border-gray-200'
              >
                <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              </div>
            ))}
          </div>
          <div className='grid gap-6'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg border border-gray-200 overflow-hidden'
              >
                <div className='p-6'>
                  <div className='flex items-start gap-6'>
                    <div className='w-16 h-16 bg-gray-200 rounded-full'></div>
                    <div className='flex-1'>
                      <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
                      <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
                      <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div className='h-4 bg-gray-200 rounded'></div>
                        <div className='h-4 bg-gray-200 rounded'></div>
                        <div className='h-4 bg-gray-200 rounded'></div>
                        <div className='h-4 bg-gray-200 rounded'></div>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <div className='h-8 bg-gray-200 rounded-md w-24'></div>
                        <div className='h-8 bg-gray-200 rounded-md w-20'></div>
                        <div className='h-8 bg-gray-200 rounded-md w-28'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 mx-auto mb-4 text-red-600' />
          <p className='text-gray-600 mb-4'>
            Error loading applicants: {error}
          </p>
          <button
            onClick={refetch}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto'
          >
            <RefreshCw className='w-4 h-4' />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Job not found
  if (!jobData) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 mx-auto mb-4 text-red-600' />
          <p className='text-gray-600 mb-4'>Job not found</p>
          <button
            onClick={() => navigate('/employer/jobs')}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg p-6 mb-6 border border-gray-200'>
          <div className='flex items-center gap-4 mb-4'>
            <button
              onClick={() => navigate('/employer/jobs')}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200'
            >
              <ArrowLeft className='w-5 h-5 text-gray-600' />
            </button>
            <div className='flex-1 ml-2'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {jobData.title}
                </h1>
                {isJobEnded && (
                  <span className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200'>
                    Job Ended
                  </span>
                )}
              </div>
              <div className='flex items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-2 flex-wrap'>
                <div className='flex items-center gap-1'>
                  <MapPin className='w-4 h-4 text-gray-500' />
                  {jobData.location}
                </div>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4 text-gray-500' />
                  Posted {formatDate(jobData.created_at)}
                </div>
                <div className='flex items-center gap-1'>
                  <Users className='w-4 h-4 text-gray-500' />
                  {stats.total} applicants
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
          <div className='bg-white rounded-lg p-5 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Applicants
                </p>
                <p className='text-3xl font-bold text-gray-900'>
                  {stats.total}
                </p>
              </div>
              <Users className='w-9 h-9 text-accent-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg p-5 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Pending</p>
                <p className='text-3xl font-bold text-accent-600'>
                  {stats.pending}
                </p>
              </div>
              <Clock className='w-9 h-9 text-accent-600' />
            </div>
          </div>

          <div className='bg-white rounded-lg border border-gray-200 p-5'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Hired</p>
                <p className='text-3xl font-bold text-accent-600'>
                  {stats.hired}
                </p>
              </div>
              <CheckCircle className='w-9 h-9 text-accent-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-5'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Rejected</p>
                <p className='text-3xl font-bold text-red-600'>
                  {stats.rejected}
                </p>
              </div>
              <XCircle className='w-9 h-9 text-red-600' />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='bg-white rounded-lg p-6 mb-6 border border-gray-200'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search by name, email, or skills...'
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
              <option value='applied'>Pending</option>
              <option value='accepted'>Hired</option>
              <option value='rejected'>Rejected</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className='px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent'
            >
              <option value='all'>All Ratings</option>
              <option value='4.5+'>4.5+ Stars</option>
              <option value='4+'>4+ Stars</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className='grid gap-6'>
          {currentUsers.length === 0 ? (
            <div className='bg-white rounded-lg p-8 text-center'>
              <Users className='w-12 h-12 mx-auto mb-4 text-gray-400' />
              <p className='text-gray-600'>
                {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all'
                  ? 'No applicants match your filters'
                  : 'No applicants yet'}
              </p>
            </div>
          ) : (
            <ul className='grid gap-6'>
              {currentUsers.map((application) => (
                <li
                  key={application.application_id}
                  className='bg-white rounded-lg border border-gray-200 overflow-hidden'
                >
                  <div className='p-6'>
                    <div className='flex items-start gap-6'>
                      <div className='w-16 h-16 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center overflow-hidden'>
                        {application.profile_picture ? (
                          <img
                            src={application.profile_picture}
                            alt={`${application.first_name} ${application.last_name}'s profile`}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className='w-full h-full flex items-center justify-center text-gray-500 font-medium text-lg'
                          style={{
                            display: application.profile_picture
                              ? 'none'
                              : 'flex',
                          }}
                        >
                          {application.first_name?.[0]?.toUpperCase()}
                          {application.last_name?.[0]?.toUpperCase()}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between mb-2'>
                          <h2 className='text-xl font-semibold text-gray-900'>
                            {application.first_name} {application.last_name}
                          </h2>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusIcon(application.status)}
                            {getStatusText(application.status)}
                          </div>
                        </div>
                        <p className='text-gray-600 mb-4'>
                          {application.email}
                        </p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700 mb-4'>
                          <div className='flex items-center gap-2'>
                            <Phone className='w-4 h-4 text-gray-500' />
                            {application.phone || 'N/A'}
                          </div>
                          <div className='flex items-center gap-2'>
                            <MapPin className='w-4 h-4 text-gray-500' />
                            {application.address || 'N/A'},{' '}
                            {application.city || 'N/A'}
                          </div>
                          <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4 text-gray-500' />
                            Applied {formatDate(application.application_date)}
                          </div>
                          <div className='flex items-center gap-2'>
                            <Award className='w-4 h-4 text-gray-500' />
                            <div className='flex items-center gap-0.5'>
                              {renderStars(application.rating)}
                            </div>
                          </div>
                        </div>
                        {application.skills &&
                          application.skills.length > 0 && (
                            <div>
                              <p className='text-sm font-medium text-gray-700 mb-2'>
                                Skills:
                              </p>
                              <div className='flex flex-wrap gap-2'>
                                {application.skills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className='bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-xs font-medium border border-accent-200'
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className='bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200'>
                    <button
                      onClick={() => handleViewProfile(application.user_id)}
                      disabled={profileLoading}
                      className='flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors disabled:opacity-50'
                    >
                      {profileLoading ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                      View Profile
                    </button>

                    {/* Rating button - only show when job is ended and user was accepted */}
                    {isJobEnded && application.status === 'accepted' && (
                      <button
                        onClick={() =>
                          handleRateUser(
                            application.user_id,
                            application.first_name,
                            application.last_name
                          )
                        }
                        disabled={isRatingLoading}
                        className='flex items-center gap-1 px-4 py-2 text-sm font-medium text-accent-700 bg-accent-100 border border-accent-200 rounded-md hover:bg-accent-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors disabled:opacity-50'
                      >
                        {isRatingLoading ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <Star className='w-4 h-4' />
                        )}
                        Rate User
                      </button>
                    )}

                    {/* Hire button - disabled when job ended or when already accepted */}
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          application.application_id,
                          'accepted'
                        )
                      }
                      disabled={
                        isUpdating === application.application_id ||
                        isJobEnded ||
                        application.status === 'accepted'
                      }
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md border border-gray-200 transition-colors ${
                        isJobEnded || application.status === 'accepted'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-accent-600 text-white hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500'
                      }`}
                    >
                      {isUpdating === application.application_id ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <CheckCircle className='w-4 h-4' />
                      )}
                      {application.status === 'accepted' ? 'Hired' : 'Hire'}
                    </button>

                    {/* Reject button - disabled when job ended or when already rejected */}
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          application.application_id,
                          'rejected'
                        )
                      }
                      disabled={
                        isUpdating === application.application_id ||
                        isJobEnded ||
                        application.status === 'rejected'
                      }
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md border border-gray-200 transition-colors ${
                        isJobEnded || application.status === 'rejected'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                      }`}
                    >
                      {isUpdating === application.application_id ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <XCircle className='w-4 h-4' />
                      )}
                      {application.status === 'rejected'
                        ? 'Rejected'
                        : 'Reject'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-2 mt-8'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200'
            >
              <ChevronLeft className='w-5 h-5 text-gray-600' />
            </button>
            <span className='text-gray-700 font-medium'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200'
            >
              <ChevronRight className='w-5 h-5 text-gray-600' />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Profile Viewer Modal */}
      {selectedUserForProfile && detailedProfile && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200'>
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6'>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-bold text-gray-900'>
                  User Profile
                </h3>
                <button
                  onClick={closeProfileModal}
                  className='p-2 rounded-full hover:bg-gray-100 transition-colors'
                >
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
            </div>

            <div className='p-6'>
              {/* User Basic Info */}
              <div className='flex items-center gap-6 mb-8'>
                <div className='w-24 h-24 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center overflow-hidden'>
                  {detailedProfile.user.profile_picture ? (
                    <img
                      src={detailedProfile.user.profile_picture}
                      alt={`${detailedProfile.user.first_name} ${detailedProfile.user.last_name}'s profile`}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className='w-full h-full flex items-center justify-center text-gray-500 font-medium text-xl'
                    style={{
                      display: detailedProfile.user.profile_picture
                        ? 'none'
                        : 'flex',
                    }}
                  >
                    {detailedProfile.user.first_name?.[0]?.toUpperCase()}
                    {detailedProfile.user.last_name?.[0]?.toUpperCase()}
                  </div>
                </div>
                <div className='flex-1'>
                  <h4 className='text-2xl font-bold text-gray-900 mb-2'>
                    {detailedProfile.user.first_name}{' '}
                    {detailedProfile.user.last_name}
                  </h4>
                  <p className='text-gray-600 mb-2'>
                    @{detailedProfile.user.username}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    <span>
                      Member since{' '}
                      {formatDate(detailedProfile.user.member_since)}
                    </span>
                    <span>•</span>
                    <span>{detailedProfile.user.gender}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                <div className='bg-accent-50 p-4 rounded-lg border border-accent-200'>
                  <div className='text-2xl font-bold text-accent-600'>
                    {detailedProfile.stats.total_applications}
                  </div>
                  <div className='text-sm text-accent-700'>
                    Total Applications
                  </div>
                </div>
                <div className='bg-accent-50 p-4 rounded-lg border border-accent-200'>
                  <div className='text-2xl font-bold text-accent-600'>
                    {detailedProfile.stats.accepted_applications}
                  </div>
                  <div className='text-sm text-accent-700'>Hired</div>
                </div>
                <div className='bg-accent-50 p-4 rounded-lg border border-accent-200'>
                  <div className='text-2xl font-bold text-accent-600'>
                    {detailedProfile.stats.average_rating}
                  </div>
                  <div className='text-sm text-accent-700'>Avg Rating</div>
                </div>
                <div className='bg-accent-50 p-4 rounded-lg border border-accent-200'>
                  <div className='text-2xl font-bold text-accent-600'>
                    {detailedProfile.stats.completed_jobs}
                  </div>
                  <div className='text-sm text-accent-700'>Completed Jobs</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className='mb-8'>
                <h5 className='text-lg font-semibold text-gray-900 mb-4'>
                  Contact Information
                </h5>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center gap-2 text-gray-700'>
                    <Mail className='w-5 h-5 text-gray-500' />
                    <span>{detailedProfile.user.username}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-700'>
                    <Phone className='w-5 h-5 text-gray-500' />
                    <span>{detailedProfile.user.phone || 'N/A'}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-700'>
                    <MapPin className='w-5 h-5 text-gray-500' />
                    <span>
                      {detailedProfile.user.address || 'N/A'},{' '}
                      {detailedProfile.user.city || 'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-700'>
                    <Calendar className='w-5 h-5 text-gray-500' />
                    <span>
                      Born {formatDate(detailedProfile.user.birth_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Application History */}
              <div className='mb-8'>
                <h5 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                  <History className='w-5 h-5' />
                  Application History (
                  {detailedProfile.application_history.length})
                </h5>
                <div className='space-y-4 max-h-64 overflow-y-auto'>
                  {detailedProfile.application_history.map((app, index) => (
                    <div
                      key={index}
                      className='border border-gray-200 rounded-lg p-4'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <h6 className='font-medium text-gray-900'>
                            {app.job_title}
                          </h6>
                          <p className='text-sm text-gray-600'>
                            {app.company} • {app.location}
                          </p>
                        </div>
                        <div className='text-right'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {getStatusText(app.status)}
                          </span>
                          <p className='text-xs text-gray-500 mt-1'>
                            {formatDate(app.applied_date)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-600'>
                        <span className='flex items-center gap-1'>
                          <DollarSign className='w-4 h-4' />
                          {app.salary}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Building className='w-4 h-4' />
                          {app.employer_first_name} {app.employer_last_name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            app.life_cycle === 'ended'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-accent-100 text-accent-600'
                          }`}
                        >
                          {app.life_cycle === 'ended' ? 'Completed' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings Received */}
              <div>
                <h5 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                  <Star className='w-5 h-5' />
                  Ratings Received ({detailedProfile.ratings.length})
                </h5>
                <div className='space-y-4 max-h-64 overflow-y-auto'>
                  {detailedProfile.ratings.length > 0 ? (
                    detailedProfile.ratings.map((rating, index) => (
                      <div
                        key={index}
                        className='border border-gray-200 rounded-lg p-4'
                      >
                        <div className='flex justify-between items-start mb-2'>
                          <div>
                            <h6 className='font-medium text-gray-900'>
                              {rating.job_title}
                            </h6>
                            <p className='text-sm text-gray-600'>
                              {rating.company}
                            </p>
                          </div>
                          <div className='text-right'>
                            <div className='flex items-center gap-1'>
                              {renderStars(rating.rating)}
                              <span className='ml-1 text-sm font-medium text-gray-700'>
                                {rating.rating}/5
                              </span>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>
                              {formatDate(rating.rating_date)}
                            </p>
                          </div>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Rated by {rating.employer_first_name}{' '}
                          {rating.employer_last_name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-500 text-center py-8'>
                      No ratings received yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedApplicantForRating && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-md p-6 border border-gray-200'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold text-gray-900'>
                Rate {selectedApplicantForRating.first_name}{' '}
                {selectedApplicantForRating.last_name}
              </h3>
              <button
                onClick={handleCloseRatingModal}
                className='p-2 rounded-full hover:bg-gray-100 transition-colors'
              >
                <X className='w-5 h-5 text-gray-600' />
              </button>
            </div>

            <div className='text-center mb-6'>
              <p className='text-gray-600 mb-4'>
                How would you rate this user's performance?
              </p>
              <div className='flex justify-center gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCurrentRating(star)}
                    className='p-1 hover:scale-110 transition-transform'
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= currentRating
                          ? 'fill-accent-400 text-accent-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {currentRating > 0 && (
                <p className='text-sm text-gray-600 mt-2'>
                  {currentRating} out of 5 stars
                </p>
              )}
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={handleCloseRatingModal}
                className='px-4 py-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitRating(currentRating)}
                disabled={currentRating === 0 || isRatingLoading}
                className='px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {isRatingLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Star className='w-4 h-4' />
                )}
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
