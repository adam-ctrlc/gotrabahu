import { useContext, createContext, useState, useEffect } from 'react';
import { me } from '../helper/Profile';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProfileInformationContext = createContext();

export function ProfileInformationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  async function handleProfileInformation() {
    if (!isAuthenticated) return;
    try {
      const response = await me();
      if (response) {
        setProfileData(response);
        const role = response.data.user.role;
        const isProfilePage = pathname === '/profile';

        if (isProfilePage) return;

        if (role === 'admin' && !pathname.startsWith('/admin')) {
          navigate('/admin/dashboard');
        } else if (role === 'employeer' && !pathname.startsWith('/employer')) {
          navigate('/employer/dashboard');
        } else if (
          role === 'employee' &&
          (pathname.startsWith('/admin') || pathname.startsWith('/employer'))
        ) {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      handleProfileInformation();
    }
  }, [isAuthenticated, pathname]);

  return (
    <>
      <ProfileInformationContext.Provider
        value={{ handleProfileInformation, profileData }}
      >
        {children}
      </ProfileInformationContext.Provider>
    </>
  );
}

export function useProfileInformation() {
  const context = useContext(ProfileInformationContext);
  if (!context) {
    throw new Error(
      'useProfileInformation must be used within a ProfileInformationProvider'
    );
  }
  return context;
}
