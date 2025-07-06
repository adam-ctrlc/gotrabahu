import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Home,
  Sparkles,
} from 'lucide-react';
import { login } from '../../helper/Auth';
import { ForgotPassword } from '../ForgotPassword';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  async function formOnSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await login(data);
      if (response.token) {
        sessionStorage.setItem('access_token', response.token);
        window.location.href = '/';
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPasswordComplete = () => {
    setShowForgotModal(false);
  };

  return (
    <main className='bg-white flex'>
      <section className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 to-accent-800 text-white flex-col justify-center items-center p-8 md:p-12 lg:p-16 relative overflow-hidden'>
        <div className='absolute top-6 left-6'>
          <Link
            to='/'
            className='group flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300'
          >
            <Home className='w-4 h-4  transition-transform' />
            <span className='text-sm font-medium'>Home</span>
          </Link>
        </div>

        <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

        <div className='text-center relative z-10'>
          <div className='flex items-center justify-center gap-3 mb-8'>
            <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center relative'>
              <span className='text-accent-600 font-bold text-2xl'>G</span>
              <Sparkles className='absolute -top-1 -right-1 w-4 h-4 text-yellow-300' />
            </div>
            <span className='text-3xl font-bold'>GoTrabahu</span>
          </div>

          <blockquote className='text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-8'>
            "Every great journey starts with a single login"
          </blockquote>

          <p className='text-accent-100 text-lg mb-8'>
            Welcome back! Continue your professional journey with us
          </p>

          <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <p className='text-accent-50 text-sm mb-3'>New to GOTrabahu?</p>
            <Link
              to='/'
              className='inline-flex items-center gap-2 bg-white text-accent-600 px-6 py-3 rounded-xl font-medium hover:bg-accent-50 transition-all duration-300 hover:scale-105'
            >
              <Home className='w-4 h-4' />
              Explore Our Platform
            </Link>
          </div>
        </div>
      </section>

      <section className='w-full  grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8 lg:p-12'>
        <div className='w-full flex items-center justify-center'>
          <div className='w-full'>
            <div className='hidden lg:flex items-center justify-between mb-8'>
              <Link
                to='/'
                className='group flex items-center gap-2 text-gray-600 hover:text-accent-600 transition-all duration-300'
              >
                <div className='p-2 rounded-full bg-gray-100 group-hover:bg-accent-50 transition-colors'>
                  <Home className='w-4 h-4' />
                </div>
                <span className='text-sm font-medium'>Back to Home</span>
              </Link>
            </div>

            <div className='mb-8'>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
                Welcome Back
              </h1>
              <p className='text-gray-600'>
                Sign in to your account to continue your journey
              </p>
            </div>

            {error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-600 text-sm'>{error}</p>
              </div>
            )}

            <form onSubmit={formOnSubmit} className='space-y-6'>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='username'
                  className='text-sm font-medium text-gray-700'
                >
                  Username
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='text'
                    id='username'
                    name='username'
                    placeholder='Enter your email or username'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200'
                    required
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    placeholder='Enter your password'
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

              <div className='flex items-center justify-end'>
                <button
                  type='button'
                  onClick={() => setShowForgotModal(true)}
                  className='text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors'
                >
                  Forgot password?
                </button>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-accent-600 to-accent-800 text-white py-3 px-6 rounded-lg font-medium hover:from-accent-700 hover:to-accent-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {loading ? 'Signing in...' : 'Log in'}
              </button>
            </form>

            <div className='text-center mt-8'>
              <div className='bg-gradient-to-r from-accent-50 to-accent-100 rounded-2xl p-6 border border-accent-200'>
                <p className='text-gray-700 mb-4'>Don't have an account yet?</p>
                <div className='flex flex-col gap-3'>
                  <Link
                    to='/signup'
                    className='bg-accent-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-700 transition-all duration-300'
                  >
                    Create Account
                  </Link>
                  <Link
                    to='/landing'
                    className='flex items-center justify-center gap-2 text-accent-600 hover:text-accent-700 font-medium transition-colors'
                  >
                    <Home className='w-4 h-4' />
                    Explore Platform First
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:flex items-center justify-center'>
          <div className='text-center space-y-8'>
            <div className='bg-gradient-to-br from-accent-50 to-white rounded-3xl p-8 border border-accent-100'>
              <blockquote className='text-xl font-light leading-relaxed mb-4 text-gray-700'>
                "Success is not final, failure is not fatal: it is the courage
                to continue that counts."
              </blockquote>
              <p className='text-gray-500 text-sm'>- Winston Churchill</p>
            </div>

            <div className='bg-gradient-to-br from-accent-50 to-white rounded-3xl p-8 border border-accent-100'>
              <blockquote className='text-xl font-light leading-relaxed mb-4 text-gray-700'>
                "The only way to do great work is to love what you do."
              </blockquote>
              <p className='text-gray-500 text-sm'>- Steve Jobs</p>
            </div>
          </div>
        </div>
      </section>

      {showForgotModal && (
        <ForgotPassword
          isModal={true}
          onClose={() => setShowForgotModal(false)}
          onComplete={handleForgotPasswordComplete}
        />
      )}
    </main>
  );
}
