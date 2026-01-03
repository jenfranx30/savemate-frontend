// src/components/Dashboard.jsx
// Router component that shows different dashboards based on account type
import { useAuth } from '../context/AuthContext';
import IndividualDashboard from './IndividualDashboard';
import BusinessDashboard from './BusinessDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Debug: Log user data
  console.log('📊 Dashboard - User data:', user);
  console.log('📊 is_business_owner:', user?.is_business_owner);
  
  // Check if user exists
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  
  if (user.is_business_owner === true) {
    console.log('✅ Rendering BusinessDashboard (Business Owner)');
    return <BusinessDashboard />;
  }
  
  // Render IndividualDashboard for individual accounts (default)
  console.log('✅ Rendering IndividualDashboard (Individual User)');
  return <IndividualDashboard />;
}
