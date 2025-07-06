import { useEmployeeJob } from '../contexts/EmployeeJobProvider';
import { useAuth } from '../contexts/AuthProvider';

export function Dashboard() {
  const { isAuthenticated } = useAuth();
  const {
    jobs,
    loading,
    appliedJobs,
    handleApplyJob,
    handleCancelApplication,
  } = useEmployeeJob();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && (
        <>
          {/* The conditional rendering of EmployeeDashboard, EmployerDashboard, and AdminDashboard
              is now handled by the routing logic, which will render the appropriate component
              based on the user's role. */}
        </>
      )}
    </>
  );
}
