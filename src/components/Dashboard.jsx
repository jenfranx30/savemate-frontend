// src/components/Dashboard.jsx - SMART DASHBOARD ROUTER

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BusinessDashboard from './BusinessDashboard';
import IndividualDashboard from './IndividualDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check account type and render appropriate dashboard
  const isBusinessAccount = () => {
    if (user) return user.accountType === 'business';
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return storedUser.accountType === 'business';
  };

  // If business account, show business dashboard
  if (isBusinessAccount()) {
    return <BusinessDashboard />;
  }

  // Otherwise, show individual dashboard
  return <IndividualDashboard />;
}
