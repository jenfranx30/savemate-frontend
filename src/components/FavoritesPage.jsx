// src/components/FavoritesPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock favorites (empty for now)
  const favorites = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/deals')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Deals
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Your Favorite Deals</h1>
          <p className="text-xl text-blue-100">
            Keep track of deals you love
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-8xl mb-6">❤️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Start browsing deals and save your favorites here!
            </p>
            <button
              onClick={() => navigate('/deals')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              Browse Deals
            </button>
          </div>
        ) : (
          // Favorites Grid (when you have favorites)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(deal => (
              <div
                key={deal.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => navigate(`/deals/${deal.id}`)}
              >
                {/* Deal content would go here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
