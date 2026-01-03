// src/pages/MyStorePage.jsx
// Added navigation breadcrumb with Back to Dashboard button

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyStorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load business info
      const businessResponse = await fetch('http://localhost:8000/api/v1/businesses/owner/me/businesses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (businessResponse.ok) {
        const businesses = await businessResponse.json();
        if (businesses.length > 0) {
          console.log('✅ Business data loaded:', businesses[0]);
          setBusiness(businesses[0]);
          
          // Load business deals
          const dealsResponse = await fetch(`http://localhost:8000/api/v1/businesses/${businesses[0]._id || businesses[0].id}/deals`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (dealsResponse.ok) {
            const dealsData = await dealsResponse.json();
            setDeals(dealsData);
          }
        }
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold mb-4">Set Up Your Store</h2>
            <p className="text-gray-600 mb-6">
              You haven't set up your store yet. Configure your business information to get started.
            </p>
            <button
              onClick={() => navigate('/business/store-settings')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Set Up Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  const addressData = business.location || business.address || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ NEW: Top Navigation Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button & Breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">My Store</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/business/post-deal')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Post Deal</span>
              </button>
              <button
                onClick={() => navigate('/business/store-settings')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Edit Store</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {business.cover_image_url && (
        <div className="w-full h-64 bg-gray-200">
          <img
            src={business.cover_image_url}
            alt="Store cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Store Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
            {business.logo_url && (
              <img
                src={business.logo_url}
                alt={business.business_name}
                className="w-24 h-24 rounded-lg object-cover border-4 border-white shadow-lg"
                style={{ marginTop: business.cover_image_url ? '-3rem' : '0' }}
              />
            )}

            {/* Business Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{business.business_name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                {addressData.city && (
                  <span className="flex items-center gap-1">
                    📍 {addressData.city}
                  </span>
                )}
                {business.phone && (
                  <span className="flex items-center gap-1">
                    📞 {business.phone}
                  </span>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About Us</h2>
              <p className="text-gray-700 whitespace-pre-line">{business.description}</p>
            </div>

            {/* Active Deals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Active Deals ({deals.length})</h2>
                <button
                  onClick={() => navigate('/business/post-deal')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  + Post Deal
                </button>
              </div>

              {deals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deals.map((deal) => (
                    <div key={deal._id || deal.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {deal.image_url && (
                        <img
                          src={deal.image_url}
                          alt={deal.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{deal.title}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-500 line-through text-sm">
                              {deal.original_price} zł
                            </span>
                            <span className="text-green-600 font-bold text-xl ml-2">
                              {deal.discounted_price} zł
                            </span>
                          </div>
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                            -{deal.discount_percentage}%
                          </span>
                        </div>
                        <div className="mt-3 flex gap-4 text-sm text-gray-600">
                          <span>👁️ {deal.views_count || 0} views</span>
                          <span>⭐ {deal.favorites_count || 0} saves</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎁</div>
                  <p className="text-gray-600 mb-4">No active deals yet</p>
                  <button
                    onClick={() => navigate('/business/post-deal')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Post Your First Deal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {business.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                      {business.email}
                    </a>
                  </div>
                )}
                {business.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                      {business.phone}
                    </a>
                  </div>
                )}
                {business.website && (
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Address</h3>
              <div className="text-gray-700 space-y-1">
                {addressData.address && (
                  <p>{addressData.address}</p>
                )}
                {(addressData.city || addressData.postal_code) && (
                  <p>
                    {[addressData.city, addressData.postal_code]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {addressData.country && (
                  <p>{addressData.country}</p>
                )}
                
                {!addressData.address && !addressData.city && (
                  <p className="text-sm text-gray-400 italic">
                    No address added yet.{' '}
                    <button
                      onClick={() => navigate('/business/store-settings')}
                      className="text-blue-600 hover:underline"
                    >
                      Add address
                    </button>
                  </p>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(business.social_media?.facebook || business.social_media?.instagram || business.social_media?.twitter) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="space-y-2">
                  {business.social_media.facebook && (
                    <a
                      href={business.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      📘 Facebook
                    </a>
                  )}
                  {business.social_media.instagram && (
                    <a
                      href={business.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-600 hover:underline"
                    >
                      📷 Instagram
                    </a>
                  )}
                  {business.social_media.twitter && (
                    <a
                      href={business.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:underline"
                    >
                      🐦 Twitter
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Store Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Deals</span>
                  <span className="font-bold">{deals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-bold">
                    {deals.reduce((sum, deal) => sum + (deal.views_count || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Saves</span>
                  <span className="font-bold">
                    {deals.reduce((sum, deal) => sum + (deal.favorites_count || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
