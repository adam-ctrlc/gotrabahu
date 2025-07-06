import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, User, Lock, Eye, EyeOff, Shield, X } from 'lucide-react';
import { forgotPasswordStep1, forgotPasswordStep2, forgotPasswordStep3 } from '../helper/Auth.js';

export function ForgotPassword({ isModal = false, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const navigate = useNavigate();

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

    try {
      if (step === 1) {
        const response = await forgotPasswordStep1({
          username: formData.username,
          phone: formData.phone
        });
        if (response.success) {
          setVerificationCode(response.verification_code); // For demo purposes
          setStep(2);
        }
      } else if (step === 2) {
        const response = await forgotPasswordStep2({
          code: formData.code
        });
        if (response.success) {
          setStep(3);
        }
      } else if (step === 3) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const response = await forgotPasswordStep3({
          password: formData.password
        });
        if (response.success) {
          if (isModal && onComplete) {
            onComplete();
          } else {
            navigate('/login');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='username'
                  className='text-sm font-medium text-gray-700'
                >
                  Username
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
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

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-accent-600 to-accent-800 text-white py-3 px-6 rounded-lg font-medium hover:from-accent-700 hover:to-accent-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </form>
          </>
        );

      case 2:
        return (
          <>
            <div className='mb-8'>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
                Enter Verification Code
              </h1>
              <p className='text-gray-600'>
                We've sent a verification code to {formData.email}
              </p>
            </div>

            <div className='mb-6 p-4 bg-accent-50 border border-accent-200 rounded-lg'>
              <p className='text-accent-700 text-sm'>
                We've sent a verification code to your phone number. Enter the 6-digit code below.
              </p>
              {verificationCode && (
                <p className='text-accent-600 text-sm mt-2 font-medium'>
                  Demo Code: {verificationCode}
                </p>
              )}
            </div>

            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='code'
                  className='text-sm font-medium text-gray-700'
                >
                  Verification Code
                </label>
                <div className='relative'>
                  <Shield className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='text'
                    id='code'
                    name='code'
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder='Enter 6-digit code'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                    maxLength='6'
                    required
                  />
                </div>
              </div>

              <div className='flex gap-3'>
                <button
                  type='button'
                  className='flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200'
                >
                  Resend Code
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 bg-gradient-to-r from-accent-600 to-accent-800 text-white py-3 px-6 rounded-lg font-medium hover:from-accent-700 hover:to-accent-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            </form>
          </>
        );

      case 3:
        return (
          <>
            <div className='mb-8'>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
                Set New Password
              </h1>
              <p className='text-gray-600'>
                Create a strong password for your account
              </p>
            </div>

            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  New Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Enter new password'
                    className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                    required
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
                  Confirm New Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder='Confirm new password'
                    className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                    required
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
                disabled={loading}
                className='w-full bg-gradient-to-r from-accent-600 to-accent-800 text-white py-3 px-6 rounded-lg font-medium hover:from-accent-700 hover:to-accent-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Setting Password...' : 'Set New Password'}
              </button>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  const content = (
    <div
      className={`${
        isModal
          ? 'bg-white border border-accent-200 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'
          : 'bg-white flex min-h-screen'
      }`}
    >
      {!isModal && (
        <section className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 to-accent-800 text-white flex-col justify-center items-center p-8 md:p-12 lg:p-16'>
          <div className='text-center'>
            <div className='w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto'>
              <Shield className='w-10 h-10 text-white' />
            </div>
            <h1 className='text-3xl font-bold mb-4'>Secure Password Reset</h1>
            <p className='text-accent-100 text-lg leading-relaxed'>
              Your account security is our priority. Follow the simple steps to
              reset your password safely.
            </p>
          </div>
        </section>
      )}

      <section
        className={`${
          isModal
            ? 'p-6'
            : 'flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12'
        }`}
      >
        <div className='w-full max-w-md'>
          <div className='mb-8'>
            <header className='flex items-center justify-between mb-6'>
              {!isModal && (
                <Link
                  to='/login'
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <ArrowLeft className='w-6 h-6' />
                </Link>
              )}
              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg font-semibold text-gray-800'>
                    GoTrabahu
                  </span>
                </div>
                {isModal && onClose && (
                  <button
                    onClick={onClose}
                    className='text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    <X className='w-6 h-6' />
                  </button>
                )}
              </div>
            </header>

            <div className='text-center mb-8'>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                {step === 1 && 'Forgot Password?'}
                {step === 2 && 'Enter Verification Code'}
                {step === 3 && 'Set New Password'}
              </h1>
            </div>
          </div>

          {renderStep()}

          {!isModal && (
            <div className='text-center mt-6'>
              <p className='text-gray-600'>
                Remember your password?{' '}
                <Link
                  to='/login'
                  className='text-accent-600 hover:text-accent-700 font-medium transition-colors'
                >
                  Back to Login
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  if (isModal) {
    return (
      <div className='fixed inset-0 flex items-center justify-center p-4 z-50'>
        {content}
      </div>
    );
  }

  return content;
}
