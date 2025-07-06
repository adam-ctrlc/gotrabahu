import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowDown,
  Users,
  Briefcase,
  CheckCircle,
  Search,
  UserPlus,
  Building,
} from 'lucide-react';
import logo from './images/Gologo.png';
import background from './images/backgroundpic.png';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='bg-white'>
      {/* Navigation */}
      <nav className='bg-gradient-to-r from-accent-600 to-accent-800 text-white sticky top-0 z-50'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white rounded-md flex items-center justify-center'>
                <span className='text-accent-600 font-bold text-xl'>G</span>
              </div>
              <span className='text-xl font-bold'>GOTrabahu</span>
            </div>

            <div className='hidden md:flex items-center gap-6'>
              <Link
                to='/about'
                className='hover:text-accent-200 transition-colors'
              >
                About Us
              </Link>
              <Link
                to='/login'
                className='bg-white text-accent-600 px-6 py-2 rounded-md font-medium hover:bg-accent-50 transition-colors'
              >
                Login
              </Link>
              <Link
                to='/signup'
                className='bg-accent-700 px-6 py-2 rounded-md font-medium hover:bg-accent-800 transition-colors'
              >
                Sign Up
              </Link>
            </div>

            <button
              className='md:hidden p-2 hover:bg-accent-700 rounded-md transition-colors'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className='md:hidden pb-4 border-t border-accent-700'>
              <div className='flex flex-col gap-3 pt-4'>
                <Link
                  to='/about'
                  className='hover:text-accent-200 transition-colors'
                >
                  About Us
                </Link>
                <Link
                  to='/login'
                  className='bg-white text-accent-600 px-4 py-2 rounded-md font-medium hover:bg-accent-50 transition-colors text-center'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  className='bg-accent-700 px-4 py-2 rounded-md font-medium hover:bg-accent-800 transition-colors text-center'
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-accent-50 to-accent-100 py-16 md:py-24 lg:py-32'>
        <div className='absolute inset-0 opacity-10'>
          <img
            src={background}
            alt='Background'
            className='w-full h-full object-cover'
          />
        </div>

        <div className='relative container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='text-center lg:text-left'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight'>
                Linking talent to opportunity, turning ambition into reality.
              </h1>

              <div className='flex justify-center lg:justify-start mb-12'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl p-4 lg:p-2 border border-gray-200 backdrop-blur-sm lg:flex lg:items-center'>
                  <div className='relative bg-gradient-to-br from-accent-50 to-accent-100 text-accent-700 px-8 py-4 rounded-xl font-semibold text-xl tracking-wide transition-all duration-300 hover:from-accent-100 hover:to-accent-200 text-center'>
                    create
                    <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent-300 rounded-full'></div>
                  </div>
                  <div className='flex items-center justify-center lg:px-3'>
                    <ArrowDown className='w-5 h-5 text-accent-400 lg:hidden' />
                    <ArrowRight className='w-5 h-5 text-accent-400 hidden lg:block' />
                  </div>
                  <div className='relative bg-gradient-to-br from-accent-200 to-accent-300 text-accent-800 px-8 py-4 rounded-xl font-semibold text-xl tracking-wide transition-all duration-300 hover:from-accent-300 hover:to-accent-400 text-center'>
                    find
                    <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent-500 rounded-full'></div>
                  </div>
                  <div className='flex items-center justify-center lg:px-3'>
                    <ArrowDown className='w-5 h-5 text-accent-400 lg:hidden' />
                    <ArrowRight className='w-5 h-5 text-accent-400 hidden lg:block' />
                  </div>
                  <div className='relative bg-gradient-to-br from-accent-500 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold text-xl tracking-wide transition-all duration-300 hover:from-accent-600 hover:to-accent-700 text-center'>
                    apply
                    <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full'></div>
                  </div>
                </div>
              </div>

              <p className='text-lg md:text-xl text-gray-600 mb-8 leading-relaxed'>
                Connect with opportunities that match your skills or find the
                perfect talent for your business needs.
              </p>
            </div>

            <div className='flex justify-center lg:justify-end'>
              <div className='relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl border border-gray-200 backdrop-blur-sm transition-all duration-300 hover:from-gray-50 hover:to-gray-100'>
                <div className='absolute inset-0 bg-gradient-to-br from-accent-50/20 to-accent-100/20 rounded-3xl'></div>
                <img
                  src={logo}
                  alt='GOTrabahu Logo'
                  className='relative w-64 md:w-80 h-auto transition-transform duration-300'
                />
                <div className='absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className='py-12 md:py-16 bg-white'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center p-6 bg-accent-50 rounded-md'>
              <div className='w-16 h-16 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                <UserPlus className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                Create
              </h3>
              <p className='text-gray-600'>
                Set up your profile and showcase your skills or business needs.
              </p>
            </div>

            <div className='text-center p-6 bg-accent-50 rounded-md'>
              <div className='w-16 h-16 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                <Search className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>Find</h3>
              <p className='text-gray-600'>
                Discover opportunities or talent that matches your requirements.
              </p>
            </div>

            <div className='text-center p-6 bg-accent-50 rounded-md'>
              <div className='w-16 h-16 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                Apply
              </h3>
              <p className='text-gray-600'>
                Connect and secure your next opportunity or hire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='py-16 md:py-24 bg-gradient-to-br from-accent-50 to-white'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
              WHAT IS GOTrabahu?
            </h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-6'>
              <p className='text-lg text-gray-700 leading-relaxed'>
                At GOTrabahu, we connect workers and employers in a seamless and
                efficient way. Our platform allows individuals to browse job
                postings, just like scrolling through social media and making
                job searching simple and engaging.
              </p>

              <p className='text-lg text-gray-700 leading-relaxed'>
                Whether you're looking for work or need to hire skilled workers,
                we make the process easy. With our built-in transaction system,
                securing a job or hiring the right person has never been safer
                and more convenient.
              </p>

              <p className='text-lg text-gray-700 leading-relaxed'>
                Our mission is to empower workers by giving them direct access
                to job opportunities while helping businesses and individuals
                find the right talent. Join us today and take the next step in
                your career or hiring journey!
              </p>
            </div>

            <div className='flex justify-center'>
              <div className='relative'>
                <div className='w-64 h-64 bg-accent-100 rounded-full flex items-center justify-center'>
                  <div className='w-48 h-48 bg-accent-200 rounded-full flex items-center justify-center'>
                    <div className='w-32 h-32 bg-accent-600 rounded-full flex items-center justify-center'>
                      <Search className='w-16 h-16 text-white' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-16 md:py-24 bg-white'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
              CATEGORIES
            </h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Employee Card */}
            <article className='bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-md border border-accent-200'>
              <div className='text-center mb-6'>
                <div className='w-20 h-20 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                  <Users className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                  Be an Employee
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Find job opportunities that match your skills! Post your
                  profile and connect with employers looking for talent like
                  you.
                </p>
              </div>

              <div className='text-center'>
                <Link
                  to='/signup'
                  className='inline-flex items-center gap-2 bg-accent-600 text-white px-8 py-3 rounded-md font-medium hover:bg-accent-700 transition-colors'
                >
                  Register Now <ArrowRight className='w-5 h-5' />
                </Link>
              </div>
            </article>

            {/* Employer Card */}
            <article className='bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-md border border-accent-200'>
              <div className='text-center mb-6'>
                <div className='w-20 h-20 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                  <Building className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                  Be an Employer
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Looking for skilled workers? Post job listings and discover
                  qualified employees ready to be hired for your needs.
                </p>
              </div>

              <div className='text-center'>
                <Link
                  to='/signup'
                  className='inline-flex items-center gap-2 bg-accent-600 text-white px-8 py-3 rounded-md font-medium hover:bg-accent-700 transition-colors'
                >
                  Register Now <ArrowRight className='w-5 h-5' />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-16 md:py-24 bg-gradient-to-br from-accent-50 to-white'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
              HOW DOES IT WORK
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                <UserPlus className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Create Account
              </h3>
              <p className='text-gray-600'>Sign up and set up your profile</p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                <Users className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Join as Employee or Employer
              </h3>
              <p className='text-gray-600'>
                Choose your role and complete your profile
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                <Search className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Find Employer / Employees
              </h3>
              <p className='text-gray-600'>
                Browse and discover perfect matches
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-accent-600 rounded-md flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Apply/Hire
              </h3>
              <p className='text-gray-600'>
                Connect and start working together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gradient-to-r from-accent-600 to-accent-800 text-white py-12 md:py-16'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='lg:col-span-2'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-white rounded-md flex items-center justify-center'>
                  <span className='text-accent-600 font-bold text-xl'>G</span>
                </div>
                <span className='text-2xl font-bold'>GOTrabahu</span>
              </div>
              <p className='text-accent-100 mb-4'>
                Connecting talent with opportunity, making job searching and
                hiring simple and efficient.
              </p>
              <div className='flex items-center gap-2 mb-2'>
                <span className='font-medium'>Email:</span>
                <span className='text-accent-100'>gotrabahu@gmail.com</span>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
              <nav className='space-y-2'>
                <Link
                  to='/about'
                  className='block text-accent-100 hover:text-white transition-colors'
                >
                  About Us
                </Link>
                <Link
                  to='/contact'
                  className='block text-accent-100 hover:text-white transition-colors'
                >
                  Contact
                </Link>
                <Link
                  to='/privacy'
                  className='block text-accent-100 hover:text-white transition-colors'
                >
                  Privacy Policy
                </Link>
              </nav>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-4'>Contact Info</h3>
              <div className='space-y-2 text-accent-100'>
                <p>Call us: 0951-798-0277</p>
                <p>Cagayan de Oro City</p>
                <p>Visit our Facebook page</p>
              </div>
            </div>
          </div>

          <div className='border-t border-accent-700 mt-8 pt-8 text-center'>
            <p className='text-accent-100'>
              &copy; All rights reserved 2025. GOTrabahu
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
