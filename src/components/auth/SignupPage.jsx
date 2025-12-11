// src/components/auth/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import authService from '../../services/authService';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get account type from URL
  const searchParams = new URLSearchParams(location.search);
  const urlType = searchParams.get('type');
  const isBusinessAccount = urlType === 'business';
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    // Business fields
    business_name: '',
    business_address: '',
    business_category: '',
    business_description: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, text: '', color: '' };

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { score, text: 'Weak', color: 'bg-red-500' };
    } else if (score <= 4) {
      return { score, text: 'Medium', color: 'bg-yellow-500' };
    } else {
      return { score, text: 'Strong', color: 'bg-green-500' };
    }
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'username':
        if (!value) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;

      case 'full_name':
        if (!value) {
          error = 'Full name is required';
        } else if (value.length < 2) {
          error = 'Full name must be at least 2 characters';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'phone_number':
        if (value && !/^\+48\d{9}$/.test(value)) {
          error = 'Phone number must be in format: +48XXXXXXXXX';
        }
        break;
        
      case 'business_name':
        if (isBusinessAccount && !value) {
          error = 'Business name is required';
        }
        break;
        
      case 'business_address':
        if (isBusinessAccount && !value) {
          error = 'Business address is required';
        }
        break;

      case 'acceptTerms':
        if (!value) {
          error = 'You must accept the Terms & Conditions';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    if (apiError) setApiError('');

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const error = validateField(name, fieldValue);

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach(key => {
      // Skip business fields if not business account
      if (!isBusinessAccount && key.startsWith('business_')) return;
      
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, acceptTerms, ...registrationData } = formData;
      
      // Add role based on account type
      registrationData.role = isBusinessAccount ? 'business' : 'customer';
      
      // Remove business fields if not business account
      if (!isBusinessAccount) {
        delete registrationData.business_name;
        delete registrationData.business_address;
        delete registrationData.business_category;
        delete registrationData.business_description;
      }

      await authService.register(registrationData);

      setSuccessMessage('Registration successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (detail.includes('email')) {
          setApiError('This email is already registered');
        } else if (detail.includes('username')) {
          setApiError('This username is already taken');
        } else {
          setApiError(detail);
        }
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            SaveMate
          </h2>
          
          {/* Account Type Badge */}
          <div className="mt-4 text-center">
            {isBusinessAccount ? (
              <div className="inline-block px-6 py-2 rounded-full text-sm font-bold bg-purple-600 text-white">
                🏢 BUSINESS ACCOUNT
              </div>
            ) : (
              <div className="inline-block px-6 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                👤 INDIVIDUAL ACCOUNT
              </div>
            )}
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            {isBusinessAccount 
              ? 'Join SaveMate to list and manage your deals' 
              : 'Join SaveMate to discover amazing local deals'}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                value={formData.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.full_name ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150`}
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>

            {/* Business Name - Only for Business */}
            {isBusinessAccount && (
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  id="business_name"
                  name="business_name"
                  type="text"
                  value={formData.business_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.business_name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150`}
                  placeholder="Enter your business name"
                  required
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score <= 4 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                autoComplete="tel"
                value={formData.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.phone_number ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150`}
                placeholder="+48123456789"
              />
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Format: +48XXXXXXXXX</p>
            </div>

            {/* Business-Specific Fields */}
            {isBusinessAccount && (
              <>
                <div>
                  <label htmlFor="business_address" className="block text-sm font-medium text-gray-700">
                    Business Address
                  </label>
                  <input
                    id="business_address"
                    name="business_address"
                    type="text"
                    value={formData.business_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                      errors.business_address ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150`}
                    placeholder="Enter your business address"
                    required
                  />
                  {errors.business_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="business_category" className="block text-sm font-medium text-gray-700">
                    Business Category
                  </label>
                  <select
                    id="business_category"
                    name="business_category"
                    value={formData.business_category}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150"
                  >
                    <option value="">Select a category</option>
                    <option value="restaurant">Restaurant & Food</option>
                    <option value="retail">Retail & Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="services">Services</option>
                    <option value="health">Health & Wellness</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="business_description" className="block text-sm font-medium text-gray-700">
                    Business Description <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    id="business_description"
                    name="business_description"
                    value={formData.business_description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 resize-none"
                    placeholder="Tell us about your business"
                  />
                </div>
              </>
            )}

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer ${
                    errors.acceptTerms ? 'border-red-300' : ''
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="font-medium text-gray-700 cursor-pointer">
                  I accept the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms & Conditions
                  </Link>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              } transition duration-150`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition duration-150"
              >
                Sign in
              </Link>
            </p>
          </div>
          
          {/* Account Type Switch */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-2">
              {isBusinessAccount ? 'Looking for a personal account?' : 'Want to list your business?'}
            </p>
            <button
              type="button"
              onClick={() => navigate(`/register?type=${isBusinessAccount ? 'individual' : 'business'}`)}
              className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              Switch to {isBusinessAccount ? 'Individual' : 'Business'} Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
