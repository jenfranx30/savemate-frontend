// src/context/AuthModalContext.jsx

import { createContext, useContext, useMemo, useState } from 'react';

const AuthModalContext = createContext(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return ctx;
}

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const [signupType, setSignupType] = useState('individual');

  const openLogin = () => {
    setMode('login');
    setIsOpen(true);
  };

  const openSignup = (type = 'individual') => {
    setMode('signup');
    setSignupType(type);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      signupType,
      openLogin,
      openSignup,
      close,
      setMode,
      setSignupType,
    }),
    [isOpen, mode, signupType]
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}
