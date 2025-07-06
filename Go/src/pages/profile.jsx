import { useState, useContext, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Save,
  Camera,
  Edit3,
} from 'lucide-react';
import { Select } from '../components/Select';
import { useProfileInformation } from '../contexts/ProfileInformationProvider';
import { update, uploadProfilePicture } from '../helper/Profile';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    address: '',
    city: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);

  const { profileData } = useProfileInformation();

  useEffect(() => {
    if (profileData && profileData.data && profileData.data.user) {
      const user = profileData.data.user;
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || '',
        middleName: user.middle_name || '',
        lastName: user.last_name || '',
        gender: user.gender
          ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
          : '',
        dateOfBirth: user.birth_date || '',
        address: user.address || '',
        city: user.city || '',
        contactNumber: user.phone || '',
        username: user.username || '',
      }));
      setProfilePicture(user.profile_picture);
      setLoading(false);
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        gender: formData.gender.toLowerCase(),
        birth_date: formData.dateOfBirth,
        phone: formData.contactNumber,
        address: formData.address,
        city: formData.city,
        username: formData.username,
      };

      // Basic client-side validation for required fields
      const requiredFields = [
        { key: 'first_name', display: 'First Name' },
        { key: 'last_name', display: 'Last Name' },
        { key: 'birth_date', display: 'Date of Birth' },
        { key: 'phone', display: 'Contact Number' },
        { key: 'address', display: 'Street Address' },
        { key: 'city', display: 'City' },
        { key: 'gender', display: 'Gender' },
        { key: 'username', display: 'Username' },
      ];

      for (const field of requiredFields) {
        if (!payload[field.key]) {
          alert(`${field.display} is required.`);
          setIsSaving(false);
          return;
        }
      }

      console.log('Sending payload:', payload);

      const response = await update(profileData.data.user.id, payload);
      if (response.success) {
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(`Failed to update profile: ${response.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, JPG, GIF, WEBP)');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 2MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const response = await uploadProfilePicture(file);
      if (response.success) {
        setProfilePicture(response.data.profile_picture);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(`Failed to upload image: ${response.message}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <article className='w-full p-4 md:p-6'>
      <header className='mb-6 flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Welcome, {formData.firstName}!
          </h1>
          <p className='text-gray-600'>
            Manage your personal information and account settings
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className='flex items-center gap-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base border border-gray-300'
          >
            <Edit3 className='w-4 h-4' />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='flex items-center gap-2 py-2 px-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors w-full md:w-auto justify-center border border-accent-700'
            >
              <Save className='w-4 h-4' />
              {isSaving
                ? 'Updating...'
                : saveSuccess
                ? 'Saved Successfully!'
                : 'Save Changes'}
            </button>
          )}
        </div>
      </header>

      <div className='bg-white rounded-lg border border-gray-200 p-4 text-center mb-6'>
        <div className='relative inline-block mb-4'>
          <div className='w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto border border-gray-300 overflow-hidden'>
            {profilePicture ? (
              <img
                src={`http://localhost:8000${profilePicture}`}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            ) : (
              <User className='w-10 h-10 md:w-12 md:h-12 text-gray-500' />
            )}
          </div>
          {isEditing && (
            <label className='absolute bottom-0 right-0 bg-accent-600 text-white p-1 rounded-full hover:bg-accent-700 transition-colors cursor-pointer'>
              <Camera className='w-3 h-3 md:w-4 md:h-4' />
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className='hidden'
              />
            </label>
          )}
          {isUploadingImage && (
            <div className='absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            </div>
          )}
        </div>
        <h3 className='font-semibold text-gray-900 mb-1 text-base md:text-lg'>
          {formData.firstName} {formData.lastName}
        </h3>
        <p className='text-gray-500 text-xs md:text-sm mb-4'>
          @{formData.username}
        </p>
      </div>

      <div className='space-y-6'>
        {/* Main container for all information sections */}
        {/* Section 1: Basic Information */}
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                Basic Information
              </h2>
              <p className='text-gray-500 text-sm'>
                Complete your profile so others can learn more about you
              </p>
            </div>
          </div>
          <div className='p-4 md:p-6'>
            <div className='space-y-4'>
              {/* First Name, Last Name */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    First Name
                  </label>
                  <input
                    type='text'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                  />
                </div>
              </div>

              {/* Middle Name */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Middle Name
                  </label>
                  <input
                    type='text'
                    name='middleName'
                    value={formData.middleName}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                  />
                </div>
              </div>

              {/* Gender, Date of Birth */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Gender
                  </label>
                  <Select
                    name={'gender'}
                    options={[
                      {
                        id: '1',
                        value: 'Male',
                      },
                      {
                        id: '2',
                        value: 'Female',
                      },
                    ]}
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    disabled={!isEditing || loading}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                  ></Select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Date of Birth
                  </label>
                  <input
                    type='date'
                    name='dateOfBirth'
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Section 2: Contact Information */}
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                Contact Information
              </h2>
              <p className='text-gray-500 text-sm'>How to reach you</p>
            </div>
          </div>
          <div className='p-4 md:p-6'>
            <div className='space-y-4'>
              {/* Username */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Username
                </label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Contact Number
                </label>
                <input
                  type='tel'
                  name='contactNumber'
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                />
              </div>
            </div>
          </div>
        </div>
        {/* Section 3: Address Information */}
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='p-4 md:p-6 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                Address Information
              </h2>
              <p className='text-gray-500 text-sm'>
                Your current residential address
              </p>
            </div>
          </div>
          <div className='p-4 md:p-6'>
            <div className='space-y-4'>
              {/* Street Address */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Street Address
                </label>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                />
              </div>

              {/* City */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    City
                  </label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
