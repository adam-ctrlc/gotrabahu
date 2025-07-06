import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from './pages/landingpage';
import Signupemployee from './pages/signupemployee';
import Signupemployer from './pages/signupemployer';
import { ForgotPassword } from './pages/ForgotPassword';
import EmployeeProfile from './pages/employee_profile';
import { Dashboard } from './pages/dashboard';
import Payment from './pages/payment';
import Profile from './pages/profile';
import LandingPage from './pages/landingpage';
import { Login } from './pages/Login/Login';
import { AuthProvider } from './contexts/AuthProvider';
import { ProfileInformationProvider } from './contexts/ProfileInformationProvider';
import { Signup } from './pages/Signup';
import { Header } from './components/header';
import { Dashboard as AdminDashboard } from './pages/Admin/Dashboard';
import { Jobs as AdminJobs } from './pages/Admin/Jobs';
import { Users as AdminUsers } from './pages/Admin/Users';
import { Subscriptions as AdminSubscriptions } from './pages/Admin/Subscriptions';
import { NavigationBar } from './components/NavigationBar';
import { Subscription } from './pages/subscription';
import { Jobs as EmployeeJobs } from './pages/Employee/Jobs';
import { History as EmployeeHistory } from './pages/Employee/History';
import { Dashboard as EmployeeDashboard } from './pages/Employee/Dashboard';
import { Dashboard as EmployerDashboard } from './pages/Employer/Dashboard';
import { History as EmployerDashboardEmployerDashboard } from './pages/Employer/History';
import { Jobs as EmployerJobs } from './pages/Employer/Jobs';
import { EmployeeJobProvider } from './contexts/EmployeeJobProvider';
import { AdminProvider } from './contexts/AdminProvider';
import { EmployerProvider } from './contexts/EmployerProvider';
import UsersInJob from './pages/Employer/UsersInJob';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileInformationProvider>
          <EmployerProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<Header />}>
                <Route path='/' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
              </Route>
              <Route path='/landing' element={<LandingPage />} />

              {/* Private Routes */}
              <Route
                element={
                  <EmployeeJobProvider>
                    <NavigationBar />
                  </EmployeeJobProvider>
                }
              >
                <Route path='/dashboard' element={<EmployeeDashboard />} />
                <Route path='/job/:id' element={<EmployeeJobs />} />
                <Route path='/history' element={<EmployeeHistory />} />
                <Route path='/payment' element={<Payment />} />
                <Route path='/subscription' element={<Subscription />} />
                <Route path='/profile' element={<Profile />} />
              </Route>

              {/* Employer Routes */}
              <Route path='/employer' element={<NavigationBar />}>
                <Route path='dashboard' element={<EmployerDashboard />} />
                <Route path='jobs' element={<EmployerJobs />} />
                <Route path='jobs/:jobId/users' element={<UsersInJob />} />
                <Route
                  path='history'
                  element={<EmployerDashboardEmployerDashboard />}
                />
              </Route>

              {/* Admin Routes */}
              <Route
                element={
                  <AdminProvider>
                    <NavigationBar />
                  </AdminProvider>
                }
              >
                <Route path='/admin/dashboard' element={<AdminDashboard />} />
                <Route path='/admin/jobs' element={<AdminJobs />} />
                <Route path='/admin/users' element={<AdminUsers />} />
                <Route
                  path='/admin/subscription'
                  element={<AdminSubscriptions />}
                />
              </Route>
            </Routes>
          </EmployerProvider>
        </ProfileInformationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
