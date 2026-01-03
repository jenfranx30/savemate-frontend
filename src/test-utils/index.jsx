// src/test-utils/index.jsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Simple wrapper for tests
export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Real test account credentials
export const TEST_ACCOUNTS = {
  individual: {
    email: 'jp191123km@gmail.com',
    password: 'Password123',
    type: 'individual'
  },
  business: {
    email: 'contact@pizzaparadise.pl',
    password: 'PizzaParadise123!',
    businessName: 'Pizza Paradise',
    type: 'business'
  },
  admin: {
    email: 'admin@savemate.com',
    password: 'Admin123!',
    type: 'admin'
  }
};

// Mock user objects matching your real data structure
export const mockIndividualUser = {
  id: 'user-123',
  email: 'jp191123km@gmail.com',
  firstName: 'Test',
  lastName: 'User',
  is_admin: false,
  is_business_owner: false
};

export const mockBusinessUser = {
  id: 'business-456',
  email: 'contact@pizzaparadise.pl',
  firstName: 'Pizza',
  lastName: 'Paradise',
  businessName: 'Pizza Paradise',
  is_admin: false,
  is_business_owner: true
};

export const mockAdminUser = {
  id: 'admin-789',
  email: 'admin@savemate.com',
  firstName: 'Admin',
  lastName: 'User',
  is_admin: true,
  is_business_owner: false
};

// Default mock user
export const mockUser = mockIndividualUser;

// Mock authentication functions
export const mockAuth = {
  login: vi.fn((credentials) => {
    // Simulate successful login
    return Promise.resolve({
      user: mockIndividualUser,
      token: 'mock-jwt-token'
    });
  }),
  
  signup: vi.fn((data) => {
    // Simulate successful signup
    return Promise.resolve({
      user: {
        id: 'new-user-123',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        is_admin: false,
        is_business_owner: data.accountType === 'business'
      },
      token: 'mock-jwt-token'
    });
  }),
  
  logout: vi.fn(() => Promise.resolve())
};

// Mock AuthContext hook
export const createMockAuthContext = (user = null) => ({
  user,
  login: mockAuth.login,
  signup: mockAuth.signup,
  logout: mockAuth.logout,
  loading: false,
  isAuthenticated: !!user
});

// Mock AuthModalContext hook
export const createMockAuthModalContext = (overrides = {}) => ({
  isOpen: false,
  mode: 'login',
  signupType: 'individual',
  openLogin: vi.fn(),
  openSignup: vi.fn(),
  close: vi.fn(),
  setMode: vi.fn(),
  setSignupType: vi.fn(),
  ...overrides
});

// Mock FavoritesContext hook
export const createMockFavoritesContext = (favorites = []) => ({
  favorites,
  isFavorite: vi.fn((dealId) => favorites.includes(dealId)),
  toggleFavorite: vi.fn(() => Promise.resolve()),
  addFavorite: vi.fn(() => Promise.resolve()),
  removeFavorite: vi.fn(() => Promise.resolve())
});
