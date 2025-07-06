import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  User,
  Home,
  CreditCard,
  Package,
  UserCircle,
  History,
  LogOut,
  Users,
  Briefcase,
  ClipboardList,
} from 'lucide-react';
import { useProfileInformation } from '../contexts/ProfileInformationProvider';
import { logout } from '../helper/Auth';

export function NavigationBar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { profileData } = useProfileInformation();
  const [role, setRole] = useState(null);
  const [navigationItems, setNavigationItems] = useState([]);
  const navigate = useNavigate();

  const isProfileLoading = profileData === null;

  useEffect(() => {
    if (profileData && profileData.data.user.role) {
      setRole(profileData.data.user.role);
    }
  }, [profileData]);

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (role) {
      if (role === 'employee') {
        setNavigationItems(employeeNav);
      } else if (role === 'employeer') {
        setNavigationItems(employerNav);
      } else if (role === 'admin') {
        setNavigationItems(adminNav);
      }
    }
  }, [role]);

  const employeeNav = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/payment', icon: CreditCard, label: 'Payment' },
    { to: '/subscription', icon: Package, label: 'Subscription' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const employerNav = [
    { to: '/employer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/employer/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/employer/history', icon: History, label: 'History' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const adminNav = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/subscription', icon: Package, label: 'Subscriptions' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const logoutItem = {
    to: '/',
    icon: LogOut,
    label: 'Log Out',
    hoverColor: 'hover:text-red-600',
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Header */}
      <header className='fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-10'>
        <nav className='flex items-center justify-between p-4 md:px-6'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
              aria-label='Toggle sidebar'
            >
              <Menu className='w-5 h-5 text-gray-700' />
            </button>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center'>
                <span className='text-accent-600 font-bold text-lg md:text-xl'>
                  G
                </span>
              </div>
              <span className='text-lg md:text-xl font-semibold text-gray-800 hidden md:block'>
                GoJobs
              </span>
            </div>
          </div>
        </nav>
      </header>
      {/* Sidebar and Content */}
      <div className='flex flex-1 pt-16'>
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-16'
          } z-10`}
        >
          <nav className='flex flex-col p-2 h-full'>
            {isProfileLoading ? (
              // Skeleton loader for sidebar
              <div className='space-y-4 p-3'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-3 rounded-lg bg-gray-200 animate-pulse'
                  >
                    <div className='w-5 h-5 bg-gray-300 rounded'></div>
                    <div
                      className={`h-4 bg-gray-300 rounded ${
                        sidebarOpen ? 'w-3/4' : 'w-0'
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            ) : (
              // Actual navigation items
              <>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`${
                        pathname === item.to
                          ? 'bg-accent-100 text-accent-700'
                          : ''
                      } flex items-center gap-3 p-3 rounded-lg hover:bg-accent-50 text-gray-700 hover:text-accent-600 transition-colors`}
                    >
                      <IconComponent className='w-5 h-5' />
                      <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
                <div className='flex-1'></div>
                <Link
                  onClick={handleLogout}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 ${logoutItem.hoverColor} transition-colors mt-auto`}
                >
                  <logoutItem.icon className='w-5 h-5' />
                  <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>
                    {logoutItem.label}
                  </span>
                </Link>
              </>
            )}
          </nav>
        </aside>
        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          } p-4 md:p-6 lg:p-8`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
