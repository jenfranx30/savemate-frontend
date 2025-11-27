import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SaveMate</h1>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Welcome, {user?.full_name || user?.username}!</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition duration-150"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to SaveMate
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover amazing local deals and save money on your favorite products and services.
          </p>
          
          {isAuthenticated ? (
            <div className="mt-10">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h3>
                <p className="text-gray-600">
                  You're logged in as <span className="font-semibold">{user?.email}</span>
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900">My Deals</h4>
                    <p className="text-blue-700 mt-2">View and manage your deals</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Favorites</h4>
                    <p className="text-green-700 mt-2">Your saved deals</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900">Reviews</h4>
                    <p className="text-purple-700 mt-2">Your reviews and ratings</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition duration-150"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
