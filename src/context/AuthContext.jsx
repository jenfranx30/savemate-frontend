// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        console.log('✅ User session found:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SIGNUP FUNCTION - THIS WAS MISSING!
  const signup = async (userData) => {
    try {
      console.log('📝 Starting signup:', userData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create complete user object
      const newUser = {
        id: `user_${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        accountType: userData.accountType || 'individual',
        businessName: userData.businessName || null,
        createdAt: new Date().toISOString()
      };

      console.log('👤 User created:', newUser);

      // Generate token
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      // Store everything
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);

      // Update state
      setUser(newUser);

      console.log('✅ Signup successful!');
      return { success: true, user: newUser };
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw new Error('Failed to create account');
    }
  };

  // ✅ LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt:', email);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check existing user
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        if (userData.email === email) {
          const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
          localStorage.setItem('token', token);
          localStorage.setItem('authToken', token);
          setUser(userData);
          console.log('✅ Login successful');
          return { success: true, user: userData };
        }
      }

      // Create demo user if not exists
      const demoUser = {
        id: `user_${Date.now()}`,
        email: email,
        firstName: email.split('@')[0],
        lastName: 'User',
        name: `${email.split('@')[0]} User`,
        accountType: 'individual',
        createdAt: new Date().toISOString()
      };

      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
      setUser(demoUser);
      
      return { success: true, user: demoUser };

    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error('Failed to login');
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    console.log('👋 Logging out');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signup,   
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
