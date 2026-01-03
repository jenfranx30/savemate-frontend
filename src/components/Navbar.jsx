// src/components/Navbar.jsx
// Mobile-responsive navbar with hamburger menu

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

// Helper function to get the correct dashboard link based on user type
function getDashboardLink(user) {
  if (!user) return '/';
  
  // Priority: Admin > Business Owner > Individual User
  if (user.is_admin) {
    return '/admin/dashboard';
  }
  
  if (user.is_business_owner) {
    return '/business/dashboard';
  }
  
  return '/dashboard';
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthed = !!user;

  const go = (path) => {
    if (location.pathname !== path) {
      navigate(path);
      setIsMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1
            className="text-xl sm:text-2xl font-bold text-gray-900 cursor-pointer"
            onClick={() => go('/')}
          >
            💰 SaveMate
          </h1>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => go('/deals')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              type="button"
            >
              Deals
            </button>
            <button
              onClick={() => go('/categories')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              type="button"
            >
              Categories
            </button>
            <button
              onClick={() => go(getDashboardLink(user))}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              type="button"
            >
              Dashboard
            </button>

            {!isAuthed ? (
              <button
                onClick={() => openLogin()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                type="button"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => go('/profile')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                type="button"
              >
                My Profile
              </button>
            )}
          </div>

          {/* Mobile Menu Button - Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            type="button"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              // X icon when menu is open
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => go('/deals')}
                className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                type="button"
              >
                🎯 Deals
              </button>
              <button
                onClick={() => go('/categories')}
                className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                type="button"
              >
                📂 Categories
              </button>
              <button
                onClick={() => go(getDashboardLink(user))}
                className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                type="button"
              >
                📊 Dashboard
              </button>
              
              {user && (
                <>
                  <button
                    onClick={() => go('/favorites')}
                    className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    type="button"
                  >
                    ❤️ Favorites
                  </button>
                  <button
                    onClick={() => go('/profile')}
                    className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    type="button"
                  >
                    👤 Profile
                  </button>
                </>
              )}

              <div className="pt-2 border-t border-gray-200">
                {!isAuthed ? (
                  <button
                    onClick={() => {
                      openLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                    type="button"
                  >
                    Sign In
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}
