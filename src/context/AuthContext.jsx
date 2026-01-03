// src/context/AuthContext.jsx - DIAGNOSTIC VERSION WITH LOGGING

import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    console.log('🔵 AuthContext: Initializing...');
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        console.log('✅ Found stored auth data');
        setUser(JSON.parse(storedUser));
      } else {
        console.log('⚪ No stored auth data found');
      }
    } catch (error) {
      console.error('❌ Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ emailOrUsername, password }) => {
    console.log('🔵 LOGIN CALLED');
    console.log('🔵 Email/Username:', emailOrUsername);
    console.log('🔵 API URL:', `${API_URL}/auth/login`);

    try {
      console.log('🔵 Making fetch request...');
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_or_username: emailOrUsername,
          password: password,
        }),
      });

      console.log('🔵 Response status:', response.status);
      console.log('🔵 Response OK:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Login failed:', errorData);
        throw new Error(errorData.detail || 'Invalid credentials');
      }

      const data = await response.json();
      console.log('✅ Login response data:', data);

      // Save to localStorage
      localStorage.setItem('token', data.tokens.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('✅ Saved to localStorage');
      console.log('✅ User data:', data.user);

      // Update state
      setUser(data.user);
      
      console.log('✅ Login complete!');
      return data;

    } catch (error) {
      console.error('❌ Login error caught:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  };

  const signup = async ({ email, password, firstName, lastName, accountType, businessName }) => {
    console.log('🔵 SIGNUP CALLED');
    
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const username = email.split('@')[0]; // Generate username from email

      console.log('🔵 Signup data:', {
        email,
        username,
        fullName,
        accountType,
        businessName
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
          full_name: fullName,
          is_business_owner: accountType === 'business',
        }),
      });

      console.log('🔵 Signup response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Signup failed:', errorData);
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      console.log('✅ Signup successful:', data);

      // Save to localStorage
      localStorage.setItem('token', data.tokens.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update state
      setUser(data.user);

      console.log('✅ Signup complete!');
      return data;

    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🔵 LOGOUT CALLED');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('✅ Logout complete');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  console.log('🔵 AuthContext render - User:', user);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}