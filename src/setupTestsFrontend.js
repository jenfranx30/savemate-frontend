// src/setupTestsFrontend.js
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock context hooks globally
vi.mock('./context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    login: vi.fn(() => Promise.resolve()),
    signup: vi.fn(() => Promise.resolve()),
    logout: vi.fn(),
    loading: false,
    isAuthenticated: false
  })),
  AuthContext: {}
}));

vi.mock('./context/AuthModalContext', () => ({
  useAuthModal: vi.fn(() => ({
    isOpen: false,
    mode: 'login',
    signupType: 'individual',
    openLogin: vi.fn(),
    openSignup: vi.fn(),
    close: vi.fn(),
    setMode: vi.fn(),
    setSignupType: vi.fn()
  })),
  AuthModalContext: {}
}));

vi.mock('./context/FavoritesContext', () => ({
  useFavorites: vi.fn(() => ({
    favorites: [],
    isFavorite: vi.fn(() => false),
    toggleFavorite: vi.fn(() => Promise.resolve()),
    addFavorite: vi.fn(() => Promise.resolve()),
    removeFavorite: vi.fn(() => Promise.resolve())
  })),
  FavoritesContext: {}
}));

// Mock window.open
global.window.open = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
