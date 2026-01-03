// src/pages/PostDealPage.jsx
// Example integration of CloudinaryUploadWidget

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloudinaryUploadWidget from '../components/CloudinaryUploadWidget';

export default function PostDealPage() {
  const navigate = useNavigate();
  const [dealImages, setDealImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    original_price: '',
    discounted_price: '',
    discount_percentage: '',
    location: {
      address: '',
      city: '',
      postal_code: '',
      country: 'Poland'
    },
    start_date: '',
    end_date: '',
    image_url: '', // Main image from Cloudinary
    tags: []
  });

  // ✅ NEW: Handle successful image uploads
  const handleUploadSuccess = (uploadedImages) => {
    console.log('Images uploaded:', uploadedImages);
    setDealImages(uploadedImages);
    
    // Set first image as main deal image
    if (uploadedImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        image_url: uploadedImages[0].url
      }));
    }
  };

  // ✅ NEW: Handle upload errors
  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    alert(`Upload failed: ${error.message}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate image
    if (!formData.image_url) {
      alert('Please upload at least one image for your deal!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/deals/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ Deal created successfully!');
        navigate('/dashboard');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Failed to create deal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Post New Deal</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          
          {/* Deal Images Section */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Deal Images * (Required)
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Upload up to 5 images. First image will be the main deal image.
            </p>
            
            {/* ✅ CLOUDINARY UPLOAD WIDGET */}
            <CloudinaryUploadWidget
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              folder="deals"
              maxFiles={5}
              currentImages={dealImages}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 50% Off All Pizzas - Weekend Special"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe your deal..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="food">Food & Dining</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="travel">Travel</option>
              <option value="services">Services</option>
              <option value="health">Health & Beauty</option>
              <option value="electronics">Electronics</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Original Price (zł) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Sale Price (zł) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discounted_price}
                onChange={(e) => setFormData({...formData, discounted_price: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Discount (%) *
              </label>
              <input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: {...formData.location, address: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => setFormData({
                  ...formData,
                  location: {...formData.location, city: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Deal
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
