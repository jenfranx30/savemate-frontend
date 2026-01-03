// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireBusiness = false }) {
  const { user, loading } = useAuth();
  const { openLogin } = useAuthModal();

  // Open login modal if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('❌ Not authenticated, opening login modal');
      openLogin();
    }
  }, [loading, user, openLogin]);

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

  // If not authenticated, redirect to home (modal will be open)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If business account required, check account type
  if (requireBusiness) {
    const isBusinessAccount = user.is_business_owner === true;
    
    if (!isBusinessAccount) {
      console.log('❌ Business account required, redirecting to home');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Business Account Required
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This page is only accessible to business owners. Please register a business account to access this feature.
            </p>
            <a
              href="/"
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }
    
    console.log('✅ Business account verified, allowing access');
  }

  // If authenticated (and business if required), render the protected content
  return children;
}
