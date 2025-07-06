import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { register } from '../helper/Auth.js';

export function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    phone: '',
    address: '',
    city: '',
    gender: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        role: userType === 'employer' ? 'employeer' : 'employee',
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name || '',
        birth_date: formData.birth_date,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        gender: formData.gender,
      };

      const response = await register(registrationData);

      if (response.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='bg-white flex'>
      <section className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 to-accent-800 text-white flex-col justify-center items-center p-8 md:p-12 lg:p-16'>
        <div className='text-center'>
          <div className='flex items-center justify-center gap-3 mb-8'>
            <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center'>
              <span className='text-accent-600 font-bold text-2xl'>G</span>
            </div>
            <span className='text-3xl font-bold'>GoTrabahu</span>
          </div>

          <blockquote className='text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-8'>
            "Every great journey starts with a single step"
          </blockquote>

          <p className='text-accent-100 text-lg'>
            Join thousands of professionals finding their dream careers
          </p>
        </div>
      </section>

      <section className='w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8 lg:p-12'>
        <div className='w-full flex items-center justify-center'>
          <div className='w-full'>
            <div className='text-center mb-8 lg:hidden'>
              <div className='flex items-center justify-center gap-2 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-r from-accent-600 to-accent-800 rounded-xl flex items-center justify-center'>
                  <span className='text-white font-bold text-xl'>G</span>
                </div>
                <span className='text-xl font-semibold text-gray-800'>
                  GoTrabahu
                </span>
              </div>
            </div>

            <div className='flex flex-row items-center gap-4 mb-8'>
              <Link
                to='/'
                className='flex items-center text-gray-600 hover:text-accent-600 transition-colors'
              >
                {' '}
                <ArrowLeft />
              </Link>
              <div>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
                  Create Your Account
                </h1>
                <p className='text-gray-600'>
                  Join our community and start your journey today
                </p>
              </div>
            </div>

            <div className='mb-6'>
              <p className='text-sm font-medium text-gray-700 mb-3'>I am a:</p>
              <div className='grid grid-cols-2 gap-3'>
                <button
                  type='button'
                  onClick={() => setUserType('employee')}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                    userType === 'employee'
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className='w-5 h-5' />
                  <span className='font-medium'>Employee</span>
                </button>
                <button
                  type='button'
                  onClick={() => setUserType('employer')}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                    userType === 'employer'
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Building className='w-5 h-5' />
                  <span className='font-medium'>Employer</span>
                </button>
              </div>
            </div>

            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                {error}
              </div>
            )}

            {success && (
              <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm'>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='first_name'
                    className='text-sm font-medium text-gray-700'
                  >
                    First Name
                  </label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='text'
                      id='first_name'
                      name='first_name'
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder='Enter your first name'
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='last_name'
                    className='text-sm font-medium text-gray-700'
                  >
                    Last Name
                  </label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='text'
                      id='last_name'
                      name='last_name'
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder='Enter your last name'
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='middle_name'
                  className='text-sm font-medium text-gray-700'
                >
                  Middle Name (Optional)
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='text'
                    id='middle_name'
                    name='middle_name'
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    placeholder='Enter your middle name'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='username'
                  className='text-sm font-medium text-gray-700'
                >
                  Username
                </label>
                <div className='relative'>
                  <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='text'
                    id='username'
                    name='username'
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder='Enter your username'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='birth_date'
                    className='text-sm font-medium text-gray-700'
                  >
                    Birth Date
                  </label>
                  <div className='relative'>
                    <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='date'
                      id='birth_date'
                      name='birth_date'
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='gender'
                    className='text-sm font-medium text-gray-700'
                  >
                    Gender
                  </label>
                  <select
                    id='gender'
                    name='gender'
                    value={formData.gender}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                    required
                  >
                    <option value=''>Select Gender</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='phone'
                  className='text-sm font-medium text-gray-700'
                >
                  Phone Number
                </label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='tel'
                    inputMode='numeric'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='Enter your phone number'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='address'
                    className='text-sm font-medium text-gray-700'
                  >
                    Address
                  </label>
                  <div className='relative'>
                    <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='text'
                      id='address'
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder='Enter your address'
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='city'
                    className='text-sm font-medium text-gray-700'
                  >
                    City
                  </label>
                  <div className='relative'>
                    <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='text'
                      id='city'
                      name='city'
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder='Enter your city'
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  Create Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Create a strong password'
                    className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='confirmPassword'
                  className='text-sm font-medium text-gray-700'
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder='Confirm your password'
                    className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                * Password must contain at least 8 characters
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-accent-600 to-accent-800 text-white py-3 px-6 rounded-lg font-medium hover:from-accent-700 hover:to-accent-900 transition-all duration-200'
              >
                Create Account as{' '}
                {userType === 'employee' ? 'Employee' : 'Employer'}
              </button>
            </form>

            <div className='text-center mt-6'>
              <p className='text-gray-600'>
                Already have an account?{' '}
                <Link
                  to='/'
                  className='text-accent-600 hover:text-accent-700 font-medium transition-colors'
                >
                  Log in
                </Link>{' '}
                to proceed.
              </p>
            </div>
          </div>
        </div>

        <div className='lg:flex items-center justify-center'>
          <div className='text-center'>
            <blockquote className='text-xl font-light leading-relaxed mb-6 text-gray-700'>
              "The future belongs to those who believe in the beauty of their
              dreams."
            </blockquote>
            <p className='text-gray-500 text-sm'>- Eleanor Roosevelt</p>

            <blockquote className='text-xl font-light leading-relaxed mb-6 mt-8 text-gray-700'>
              "Your limitation—it's only your imagination."
            </blockquote>
            <p className='text-gray-500 text-sm'>- Anonymous</p>
          </div>
        </div>
      </section>
    </main>
  );
}
