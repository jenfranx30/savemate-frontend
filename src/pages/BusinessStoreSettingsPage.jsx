// src/pages/BusinessStoreSettingsPage.jsx
// Store settings with small optional logo upload section

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CloudinaryUploadWidget from '../components/CloudinaryUploadWidget';

export default function BusinessStoreSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [businessId, setBusinessId] = useState(null);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [businessData, setBusinessData] = useState({
    business_name: '',
    description: '',
    category: '',
    logo_url: '',
    phone: '',
    email: '',
    website: '',
    location: {
      address: '',
      city: '',
      postal_code: '',
      country: 'Poland'
    },
    social_media: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/businesses/owner/me/businesses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const businesses = await response.json();
        if (businesses.length > 0) {
          const business = businesses[0];
          setBusinessId(business._id || business.id);
          setBusinessData({
            business_name: business.business_name || '',
            description: business.description || '',
            category: business.category || '',
            logo_url: business.logo_url || '',
            phone: business.phone || '',
            email: business.email || '',
            website: business.website || '',
            location: business.location || {
              address: '',
              city: '',
              postal_code: '',
              country: 'Poland'
            },
            social_media: business.social_media || {
              facebook: '',
              instagram: '',
              twitter: ''
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const handleLogoUpload = (uploadedImages) => {
    if (uploadedImages.length > 0) {
      setBusinessData(prev => ({
        ...prev,
        logo_url: uploadedImages[0].url
      }));
      setShowLogoUpload(false); // Hide upload widget after successful upload
    }
  };

  const handleRemoveLogo = () => {
    setBusinessData(prev => ({
      ...prev,
      logo_url: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!businessId) {
        alert('Business not found');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(businessData)
      });

      if (response.ok) {
        alert('✅ Store settings saved successfully!');
        navigate('/business/my-store');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to save settings'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving store settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/business/my-store')}
            className="text-blue-600 hover:underline mb-2 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Store
          </button>
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-gray-600">Manage your business information</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ✅ Small Optional Logo Section */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Business Logo (Optional)
              </label>
              
              {businessData.logo_url ? (
                // Show current logo with options
                <div className="flex items-center gap-4">
                  <img
                    src={businessData.logo_url}
                    alt="Business logo"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLogoUpload(true)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Change Logo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                // Show add logo button
                <button
                  type="button"
                  onClick={() => setShowLogoUpload(true)}
                  className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Add Business Logo
                </button>
              )}

              {/* Upload widget (only shown when button is clicked) */}
              {showLogoUpload && (
                <div className="mt-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">Upload Your Logo</p>
                    <button
                      type="button"
                      onClick={() => setShowLogoUpload(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <CloudinaryUploadWidget
                    onUploadSuccess={handleLogoUpload}
                    folder="businesses/logos"
                    maxFiles={1}
                    currentImages={[]}
                  />
                </div>
              )}
            </div>

            <hr />

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Business Information</h3>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessData.business_name}
                  onChange={(e) => setBusinessData({...businessData, business_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  value={businessData.description}
                  onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Tell customers about your business..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category *
                </label>
                <select
                  value={businessData.category}
                  onChange={(e) => setBusinessData({...businessData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category...</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail Store</option>
                  <option value="service">Service Provider</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <hr />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+48 123 456 789"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={businessData.email}
                    onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={businessData.website}
                  onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </div>

            <hr />

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Address</h3>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={businessData.location.address}
                  onChange={(e) => setBusinessData({
                    ...businessData,
                    location: {...businessData.location, address: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={businessData.location.city}
                    onChange={(e) => setBusinessData({
                      ...businessData,
                      location: {...businessData.location, city: e.target.value}
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={businessData.location.postal_code}
                    onChange={(e) => setBusinessData({
                      ...businessData,
                      location: {...businessData.location, postal_code: e.target.value}
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Social Media (Optional)</h3>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={businessData.social_media.facebook}
                  onChange={(e) => setBusinessData({
                    ...businessData,
                    social_media: {...businessData.social_media, facebook: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={businessData.social_media.instagram}
                  onChange={(e) => setBusinessData({
                    ...businessData,
                    social_media: {...businessData.social_media, instagram: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={businessData.social_media.twitter}
                  onChange={(e) => setBusinessData({
                    ...businessData,
                    social_media: {...businessData.social_media, twitter: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://twitter.com/yourpage"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Store Settings'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/business/my-store')}
                className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
