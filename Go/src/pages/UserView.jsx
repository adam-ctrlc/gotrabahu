import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get_user_details } from '../helper/Jobs/Employee'; // Assuming this helper will be modified or a new one created
import {
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

const getInitials = (firstName, lastName) => {
  return `${firstName ? firstName.charAt(0) : ''}${
    lastName ? lastName.charAt(0) : ''
  }`.toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getRoleColor = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'employee':
      return 'bg-green-100 text-green-800';
    case 'employeer':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function UserView({ user: propUser, onClose }) {
  const { id } = useParams(); // Keep for direct route access, but prioritize propUser
  const navigate = useNavigate(); // Keep for direct route access
  const [userData, setUserData] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propUser) {
      setUserData(propUser);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get_user_details(id);
        if (response.success) {
          setUserData(response.data.user || response.data);
        } else {
          setError(response.message || 'Failed to fetch user data.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An error occurred while fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    } else {
      setLoading(false);
      setError('User ID not provided.');
    }
  }, [id, propUser]); // Depend on id and propUser

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
        <p className='ml-2 text-gray-600'>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 mx-auto mb-4 text-red-600' />
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={handleGoBack}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 mx-auto mb-4 text-orange-500' />
          <p className='text-gray-600 mb-4'>User data not available.</p>
          <button
            onClick={handleGoBack}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    first_name,
    last_name,
    middle_name,
    username,
    email,
    phone,
    address,
    city,
    birth_date,
    gender,
    total_accepted,
    role, // Add role
    created_at, // Add created_at
    profile_picture, // Add profile_picture
  } = userData;

  const profileImageSrc = profile_picture
    ? profile_picture
    : `https://placehold.co/96x96/e2e8f0/808080?text=${getInitials(
        first_name,
        last_name
      )}`;

  return (
    <article className='w-full p-4 md:p-6'>
      <header className='mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
          User Profile: {first_name} {last_name}
        </h1>
        <p className='text-gray-600'>Detailed information about this user</p>
      </header>

      <div className='space-y-6'>
        <div className='bg-white rounded-lg border border-gray-200 p-4 text-center'>
          <div className='relative inline-block mb-4'>
            <div className='w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto border border-gray-300 overflow-hidden'>
              {profile_picture ? (
                <img
                  src={profileImageSrc}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              ) : (
                <User className='w-12 h-12 text-gray-500' />
              )}
            </div>
          </div>
          <h3 className='font-semibold text-gray-900 mb-1 text-lg'>
            {first_name} {middle_name ? `${middle_name}.` : ''} {last_name}
          </h3>
          <p className='text-gray-500 text-sm mb-2'>@{username}</p>
          {role && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                role
              )} mr-2`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          )}
          {created_at && (
            <p className='text-gray-700 text-sm mt-1'>
              Joined: {formatDate(created_at)}
            </p>
          )}
          {total_accepted !== undefined && (
            <p className='text-gray-700 text-sm'>
              Total Accepted Jobs:{' '}
              <span className='font-semibold'>{total_accepted}</span>
            </p>
          )}
        </div>

        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                Contact Information
              </h2>
              <p className='text-gray-500 text-sm'>How to reach this user</p>
            </div>
          </div>
          <div className='p-4 md:p-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Phone className='w-5 h-5 text-gray-500' />
                <p className='text-gray-700'>{phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                Personal Details
              </h2>
              <p className='text-gray-500 text-sm'>More about this user</p>
            </div>
          </div>
          <div className='p-4 md:p-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-5 h-5 text-gray-500' />
                <p className='text-gray-700'>Born: {formatDate(birth_date)}</p>
              </div>
              <div className='flex items-center gap-2'>
                <User className='w-5 h-5 text-gray-500' />
                <p className='text-gray-700'>
                  Gender:{' '}
                  {gender
                    ? gender.charAt(0).toUpperCase() + gender.slice(1)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                Address Information
              </h2>
              <p className='text-gray-500 text-sm'>
                Residential address of this user
              </p>
            </div>
          </div>
          <div className='p-4 md:p-6'>
            <div className='space-y-4'>
              <div className='flex items-start gap-2'>
                <MapPin className='w-5 h-5 text-gray-500 mt-1' />
                <p className='text-gray-700'>
                  {address || 'N/A'}
                  {address && city ? ', ' : ''}
                  {city || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
