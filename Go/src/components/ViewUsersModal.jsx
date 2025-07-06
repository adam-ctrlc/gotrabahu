import React, { useState, useEffect } from 'react';
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
  Award,
  Loader2,
  AlertCircle,
  RefreshCw,
  X, // Only keep X, remove XCircle if not used elsewhere
} from 'lucide-react';
import { useEmployer } from '../contexts/EmployerProvider';
import { api } from '../lib/axios';
import { getRating, submitRating, updateRating } from '../helper/Rating';
import RatingModal from './RatingModal';
import Modal from './Modal';

export default function ViewUsersModal({
  isOpen,
  onClose,
  jobData,
  initialJobApplicants,
  initialCurrentRating,
}) {
  const {
    userApplications,
    loading,
    error,
    refetch,
    getUserApplications,
    updateUserApplication,
    getUserDetails,
  } = useEmployer();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdatingApplicant, setIsUpdatingApplicant] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedApplicantForRating, setSelectedApplicantForRating] =
    useState(null);
  const [currentRating, setCurrentRating] = useState(initialCurrentRating);
  const [jobApplicants, setJobApplicants] = useState(
    initialJobApplicants || []
  );

  const usersPerPage = 8;

  useEffect(() => {
    if (isOpen && jobData?.id) {
      fetchApplicantsWithRatings(jobData.id);
    }
  }, [isOpen, jobData?.id]);

  const fetchApplicantsWithRatings = async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      const appliedUsers = response.data.applied_users || [];
      const jobDetails = response.data.data;

      const applicantsWithRatings = await Promise.all(
        appliedUsers.map(async (applicant) => {
          let rating = 0;
          if (
            jobDetails.life_cycle === 'ended' &&
            applicant.application_status === 'accepted'
          ) {
            try {
              const ratingResponse = await getRating(jobId, applicant.user_id);
              if (ratingResponse.success && ratingResponse.data) {
                rating = parseInt(ratingResponse.data.rating);
              }
            } catch (ratingError) {
              console.warn(
                `No rating found or error fetching rating for user ${applicant.user_id}:`,
                ratingError.message
              );
            }
          }
          return {
            ...applicant,
            job_id: jobId, // Add job_id to applicant object for handleSubmitRating
            rating: rating,
          };
        })
      );
      setJobApplicants(applicantsWithRatings);
    } catch (err) {
      console.error('Error fetching applicants for modal:', err);
      // Handle error display within the modal if needed
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'hired':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className='w-3 h-3' />;
      case 'hired':
      case 'accepted':
        return <CheckCircle className='w-3 h-3' />;
      case 'rejected':
        return <X className='w-3 h-3' />;
      default:
        return <Clock className='w-3 h-3' />;
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
    const applicants = jobApplicants || [];
    return {
      total: applicants.length,
      pending: applicants.filter(
        (user) => user.application_status === 'applied'
      ).length,
      hired: applicants.filter((user) => user.application_status === 'accepted')
        .length,
      rejected: applicants.filter(
        (user) => user.application_status === 'rejected'
      ).length,
    };
  };

  const handleOpenRatingModal = (applicant) => {
    setSelectedApplicantForRating(applicant);
    setCurrentRating(applicant.rating || 0);
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setSelectedApplicantForRating(null);
    setCurrentRating(0);
    setShowRatingModal(false);
  };

  const handleSubmitRating = async (rating) => {
    if (!selectedApplicantForRating || !jobData?.id) return;

    const { user_id } = selectedApplicantForRating;
    const jobId = jobData.id;

    try {
      if (currentRating > 0) {
        await updateRating(jobId, user_id, rating);
      } else {
        await submitRating(jobId, user_id, rating);
      }
      alert('Rating submitted successfully!');
      handleCloseRatingModal();
      fetchApplicantsWithRatings(jobId); // Refresh applicants to show new rating
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating.');
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId,
    newStatus,
    jobId
  ) => {
    if (
      window.confirm(`Are you sure you want to ${newStatus} this application?`)
    ) {
      try {
        setIsUpdatingApplicant(applicationId);
        await updateUserApplication(applicationId, { status: newStatus });
        fetchApplicantsWithRatings(jobId); // Refresh the applicants list
      } catch (err) {
        console.error('Error updating application status:', err);
        alert('Failed to update application status');
      } finally {
        setIsUpdatingApplicant(null);
      }
    }
  };

  const stats = getStatusStats();

  const filteredUsers = jobApplicants.filter((applicant) => {
    const matchesSearch =
      applicant.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || applicant.application_status === statusFilter;

    let matchesRating = true;
    if (ratingFilter === 'all') {
      matchesRating = true;
    } else if (ratingFilter === 'to_be_rated') {
      matchesRating = applicant.rating === 0;
    } else if (ratingFilter === 'already_rated') {
      matchesRating = applicant.rating > 0;
    } else if (ratingFilter === '4+') {
      matchesRating = (applicant.rating || 0) >= 4;
    } else if (ratingFilter === '4.5+') {
      matchesRating = (applicant.rating || 0) >= 4.5;
    }

    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onToggle={onClose}
      title={`Applicants for ${jobData?.title || 'Job'}`}
    >
      <div className='bg-white w-full max-w-4xl h-[90vh] flex flex-col'>
        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-gray-200'>
          <div className='bg-white rounded-md p-4 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Applicants
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.total}
                </p>
              </div>
              <Users className='w-8 h-8 text-blue-600' />
            </div>
          </div>
          <div className='bg-white rounded-md p-4 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Pending</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {stats.pending}
                </p>
              </div>
              <Clock className='w-8 h-8 text-yellow-600' />
            </div>
          </div>
          <div className='bg-white rounded-md p-4 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Hired</p>
                <p className='text-2xl font-bold text-green-600'>
                  {stats.hired}
                </p>
              </div>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
          </div>
          <div className='bg-white rounded-md p-4 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Rejected</p>
                <p className='text-2xl font-bold text-red-600'>
                  {stats.rejected}
                </p>
              </div>
              <X className='w-8 h-8 text-red-600' />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='p-6 border-b border-gray-200'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search by name, username, or skills...' // Adjusted placeholder
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>All Status</option>
              <option value='applied'>Pending</option>
              <option value='accepted'>Hired</option>
              <option value='rejected'>Rejected</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className='px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>All Ratings</option>
              <option value='to_be_rated'>To be Rated</option>
              <option value='already_rated'>Already Rated</option>
              <option value='4+'>4+ Stars</option>
              <option value='4.5+'>4.5+ Stars</option>
            </select>
          </div>
        </div>

        {/* User List */}
        <div className='flex-1 overflow-auto p-6'>
          {filteredUsers.length === 0 && (
            <p className='text-center text-gray-500'>No applicants found.</p>
          )}
          {filteredUsers.length > 0 && (
            <ul className='space-y-4'>
              {currentUsers.map((applicant) => (
                <li
                  key={applicant.user_id}
                  className='bg-white p-4 border border-gray-200 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4'
                >
                  <div className='flex items-center gap-4'>
                    <img
                      src={
                        applicant.profile_picture ||
                        '/path/to/default-avatar.png'
                      }
                      alt={`${applicant.first_name} ${applicant.last_name}`}
                      className='w-12 h-12 rounded-md object-cover border border-gray-200'
                    />
                    <div>
                      <p className='font-bold text-gray-900'>
                        {applicant.first_name} {applicant.last_name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        @{applicant.username}
                      </p>
                      <div className='flex items-center gap-1 mt-1'>
                        {renderStars(applicant.rating)}
                        <span className='text-sm text-gray-600'>
                          ({applicant.rating?.toFixed(1) || 'N/A'})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4'>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${getStatusColor(
                        applicant.application_status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(applicant.application_status)}
                      {applicant.application_status === 'applied'
                        ? 'Pending'
                        : applicant.application_status === 'accepted'
                        ? 'Hired'
                        : 'Rejected'}
                    </span>
                    <span className='text-sm text-gray-600'>
                      Applied on: {formatDate(applicant.application_date)}
                    </span>
                    <div className='flex gap-2'>
                      {applicant.application_status === 'applied' && (
                        <button
                          onClick={() =>
                            handleUpdateApplicationStatus(
                              applicant.application_id,
                              'accepted',
                              applicant.job_id
                            )
                          }
                          className='bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors border border-gray-200'
                          disabled={
                            isUpdatingApplicant === applicant.application_id
                          }
                        >
                          {isUpdatingApplicant === applicant.application_id ? (
                            <Loader2 className='animate-spin w-4 h-4' />
                          ) : (
                            'Accept'
                          )}
                        </button>
                      )}
                      {applicant.application_status === 'applied' && (
                        <button
                          onClick={() =>
                            handleUpdateApplicationStatus(
                              applicant.application_id,
                              'rejected',
                              applicant.job_id
                            )
                          }
                          className='bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors border border-gray-200'
                          disabled={
                            isUpdatingApplicant === applicant.application_id
                          }
                        >
                          {isUpdatingApplicant === applicant.application_id ? (
                            <Loader2 className='animate-spin w-4 h-4' />
                          ) : (
                            'Reject'
                          )}
                        </button>
                      )}
                      {applicant.application_status === 'accepted' &&
                        jobData?.life_cycle === 'ended' && (
                          <button
                            onClick={() => handleOpenRatingModal(applicant)}
                            className='bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors border border-gray-200'
                          >
                            {applicant.rating > 0
                              ? 'View/Edit Rating'
                              : 'Rate Employee'}
                          </button>
                        )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className='p-6 border-t border-gray-200 flex items-center justify-between'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className='p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 border border-gray-200'
            >
              <ChevronLeft className='w-5 h-5 text-gray-600' />
            </button>
            <span className='text-gray-700 text-sm'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className='p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 border border-gray-200'
            >
              <ChevronRight className='w-5 h-5 text-gray-600' />
            </button>
          </div>
        )}

        <RatingModal
          isOpen={showRatingModal}
          onClose={handleCloseRatingModal}
          applicant={selectedApplicantForRating}
          currentRating={currentRating}
          onSubmitRating={handleSubmitRating}
        />
      </div>
    </Modal>
  );
}
