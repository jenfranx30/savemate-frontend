// src/pages/PostDealPage.jsx - BUSINESS DEAL POSTING FORM
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostDealPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    location: '',
    address: '',
    phone: '',
    originalPrice: '',
    discountPercentage: '',
    validUntil: '',
    image: '',
    terms: ''
  });

  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'food', label: 'Food & Dining', icon: '🍔' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'health', label: 'Health & Beauty', icon: '💆' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'services', label: 'Services', icon: '🔧' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update preview image
    if (name === 'image') {
      setPreviewImage(value);
    }
  };

  const calculateDiscountedPrice = () => {
    const original = parseFloat(formData.originalPrice) || 0;
    const discount = parseFloat(formData.discountPercentage) || 0;
    return (original * (1 - discount / 100)).toFixed(2);
  };

  const calculateSavings = () => {
    const original = parseFloat(formData.originalPrice) || 0;
    const discounted = parseFloat(calculateDiscountedPrice()) || 0;
    return (original - discounted).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.originalPrice || formData.originalPrice <= 0) newErrors.originalPrice = 'Valid price required';
    if (!formData.discountPercentage || formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'Discount must be between 1-100%';
    }
    if (!formData.validUntil) newErrors.validUntil = 'Expiration date is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    // Get user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Create deal object
    const newDeal = {
      id: `business-deal-${Date.now()}`,
      deal_id: `business-deal-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      discount: `${formData.discountPercentage}% OFF`,
      discount_percentage: parseFloat(formData.discountPercentage),
      image: formData.image,
      businessName: user.businessName || 'Your Business',
      location: formData.location,
      address: formData.address,
      phone: formData.phone,
      city: formData.location.split(',')[0].trim(),
      category: formData.category,
      originalPrice: parseFloat(formData.originalPrice),
      discountedPrice: parseFloat(calculateDiscountedPrice()),
      validUntil: formData.validUntil,
      terms: formData.terms,
      source: 'business',
      createdAt: new Date().toISOString(),
      businessId: user.id
    };

    // Save to localStorage (in production, this would be an API call)
    const existingDeals = JSON.parse(localStorage.getItem('businessDeals') || '[]');
    existingDeals.push(newDeal);
    localStorage.setItem('businessDeals', JSON.stringify(existingDeals));

    // Show success message
    alert('Deal posted successfully!');
    
    // Navigate to deals page
    navigate('/deals');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Post a New Deal</h1>
          <p className="text-xl text-green-100">
            Create an exclusive offer for your customers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Deal Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deal Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., 50% Off All Pizzas - Weekend Special"
                  className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your deal..."
                  className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Warsaw, Mokotów"
                  className={`w-full px-4 py-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., ul. Puławska 123, 02-707 Warsaw"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +48 22 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Original Price (zł) *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="39.99"
                    className={`w-full px-4 py-3 border ${errors.originalPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.originalPrice && <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount % *
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    placeholder="50"
                    className={`w-full px-4 py-3 border ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.discountPercentage && <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>}
                </div>
              </div>

              {/* Price Preview */}
              {formData.originalPrice && formData.discountPercentage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Discounted Price:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {calculateDiscountedPrice()} zł
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 text-sm">Customer Saves:</span>
                    <span className="text-lg font-semibold text-green-700">
                      {calculateSavings()} zł
                    </span>
                  </div>
                </div>
              )}

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valid Until *
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border ${errors.validUntil ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.validUntil && <p className="text-red-500 text-sm mt-1">{errors.validUntil}</p>}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full px-4 py-3 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Tip: Use Unsplash or stock photo sites for high-quality images
                </p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  name="terms"
                  value={formData.terms}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Valid only on weekends. Cannot be combined with other offers."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Post Deal
              </button>
            </form>
          </div>

          {/* Preview Card Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview</h2>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Deal Image */}
              <div className="relative h-64 bg-gray-200">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=Invalid+Image+URL';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Image preview will appear here</p>
                    </div>
                  </div>
                )}
                
                {/* Discount Badge */}
                {formData.discountPercentage && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    {formData.discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Deal Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {formData.title || 'Your Deal Title'}
                </h3>

                <p className="text-gray-600 mb-4">
                  {formData.description || 'Your deal description will appear here...'}
                </p>

                <div className="flex items-center gap-2 mb-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm">{formData.location || 'Location'}</span>
                </div>

                {formData.originalPrice && formData.discountPercentage && (
                  <div className="bg-green-50 rounded-xl p-4 mb-4">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-4xl font-bold text-green-600">
                        {calculateDiscountedPrice()} zł
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        {parseFloat(formData.originalPrice).toFixed(2)} zł
                      </span>
                    </div>
                    <p className="text-lg text-green-700 font-semibold">
                      Save {calculateSavings()} zł!
                    </p>
                  </div>
                )}

                {formData.validUntil && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">
                      Valid until: {new Date(formData.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl">
                  View Details
                </button>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Make sure your image is high-quality and represents your deal well. Use clear, descriptive titles and include all important details in the description.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
