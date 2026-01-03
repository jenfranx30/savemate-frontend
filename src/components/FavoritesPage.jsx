// src/components/FavoritesPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/dealsApi';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function readGuestFavorites() {
  try {
    return JSON.parse(localStorage.getItem('guestFavorites') || '[]');
  } catch {
    return [];
  }
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const isLoggedIn = !!localStorage.getItem('access_token') && !!user;

  const loadFavorites = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await api.get('/favorites/');
        const list = Array.isArray(res.data?.favorites) ? res.data.favorites : [];
        setFavorites(list);
      } else {
        setFavorites(readGuestFavorites());
      }
    } catch {
      setFavorites(readGuestFavorites());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    const handler = () => loadFavorites();
    window.addEventListener('favoritesChanged', handler);
    return () => window.removeEventListener('favoritesChanged', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Your Favorite Deals</h1>
          <p className="text-xl text-blue-100">Keep track of deals you love</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-8xl mb-6">❤️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-600 text-lg mb-8">Start browsing deals and save your favorites here!</p>
            <button
              onClick={() => navigate('/deals')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              type="button"
            >
              Browse Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const dealId = String(fav.deal_id || fav.id);
              const title = fav.deal?.title || fav.title || 'Saved Deal';
              const subtitle = fav.deal?.business_name || '';
              const canOpenDetails = !!fav.deal;

              return (
                <div
                  key={dealId}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                  onClick={() => {
                    if (canOpenDetails) navigate(`/deals/${dealId}`);
                    else navigate('/deals');
                  }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                  {subtitle ? <p className="text-sm text-gray-600 mb-4">{subtitle}</p> : null}
                  <p className="text-sm text-blue-600 font-semibold">View</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
