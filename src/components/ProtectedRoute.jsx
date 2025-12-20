// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireBusiness = false }) {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If business account required, check account type
  if (requireBusiness) {
    const isBusinessAccount = user.accountType === 'business';
    
    if (!isBusinessAccount) {
      console.log('❌ Business account required, redirecting to home');
      alert('This page is only accessible to business accounts. Please create a business account to access this feature.');
      return <Navigate to="/" replace />;
    }
    
    console.log('✅ Business account verified, allowing access');
  }

  // If authenticated (and business if required), render the protected content
  return children;
}
