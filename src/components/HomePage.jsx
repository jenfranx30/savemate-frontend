// src/components/HomePage.jsx - CORRECTED VERSION (Cursor Fixed)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryList from './CategoryList';
import FeaturedDeals from './FeaturedDeals';
import ExternalDeals from './ExternalDeals';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to deals page with search query
      navigate(`/deals?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // If empty, just go to deals page
      navigate('/deals');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable in navbar */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
                SaveMate
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/deals')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Deals
              </button>
              <button 
                onClick={() => navigate('/categories')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Categories
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </button>
            </div>

            {/* Sign In Button */}
            <div>
              <button 
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Hero Title - CURSOR FIXED: Removed cursor-pointer */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to SaveMate
          </h1>
          
          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover amazing local deals and save money on your favorite products and services.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for deals, restaurants, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
                  🔍
                </span>
              </div>
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl font-bold mb-2">500+</p>
              <p className="text-blue-100">Active Deals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl font-bold mb-2">50+</p>
              <p className="text-blue-100">Local Businesses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl font-bold mb-2">10K+</p>
              <p className="text-blue-100">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryList />

      {/* Featured Deals Section */}
      <FeaturedDeals />

      {/* External Deals Section */}
      <ExternalDeals />

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start saving?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of savvy shoppers finding the best deals every day.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">SaveMate</h3>
              <p className="text-gray-400">
                Your trusted platform for discovering local deals and saving money.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* For Business */}
            <div>
              <h3 className="text-lg font-bold mb-4">For Business</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/register')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    List Your Business
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Advertise
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Business Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.open('https://facebook.com', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  📘
                </button>
                <button 
                  onClick={() => window.open('https://twitter.com', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  🐦
                </button>
                <button 
                  onClick={() => window.open('https://instagram.com', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  📸
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SaveMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
