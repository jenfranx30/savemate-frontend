// src/components/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/deals')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Deals
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.full_name || user?.username || 'User'}! 👋
          </h1>
          <p className="text-xl text-blue-100">
            Ready to discover amazing deals today?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">❤️</div>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-gray-600">Favorite Deals</p>
            <button 
              onClick={() => navigate('/favorites')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View Favorites →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
            <p className="text-gray-600">Available Deals</p>
            <button 
              onClick={() => navigate('/deals')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Browse Deals →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-gray-600">Reviews Written</p>
            <button 
              onClick={() => alert('Reviews coming soon!')}
              className="mt-4 text-gray-400 font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user?.email || 'Not available'}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Username
              </label>
              <p className="text-gray-900">{user?.username || 'Not available'}</p>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => navigate('/profile')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
