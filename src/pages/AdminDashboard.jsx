// src/pages/AdminDashboard.jsx
// Main Admin Dashboard - Landing page for admins

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/verification/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Verification Requests',
      icon: '📋',
      count: stats?.pending_reviews || 0,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/admin/verifications')
    },
    {
      title: 'Total Businesses',
      icon: '🏪',
      count: stats?.total_businesses || 0,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/admin/businesses')
    },
    {
      title: 'Verified Businesses',
      icon: '✅',
      count: stats?.total_verified || 0,
      color: 'from-purple-500 to-purple-600',
      action: () => {}
    },
    {
      title: 'Expiring Soon',
      icon: '⏰',
      count: stats?.expiring_soon || 0,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/admin/verifications')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-300">Welcome back, {user?.full_name || 'Admin'}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">{action.icon}</span>
                  <span className="text-4xl font-bold">{action.count}</span>
                </div>
                <h3 className="text-lg font-semibold">{action.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/admin/verifications')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📋
                </div>
                <h3 className="text-xl font-bold text-gray-900">Review Verifications</h3>
              </div>
              <p className="text-gray-600">
                {stats?.pending_reviews || 0} pending verification requests
              </p>
            </button>

            <button
              onClick={() => navigate('/admin/businesses')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏪
                </div>
                <h3 className="text-xl font-bold text-gray-900">Manage Businesses</h3>
              </div>
              <p className="text-gray-600">
                View and manage all registered businesses
              </p>
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👥
                </div>
                <h3 className="text-xl font-bold text-gray-900">User Management</h3>
              </div>
              <p className="text-gray-600">
                Manage user accounts and permissions
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats?.total_verified || 0}
                </div>
                <div className="text-gray-600">Verified Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.under_review || 0}
                </div>
                <div className="text-gray-600">Under Review</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats?.expiring_soon || 0}
                </div>
                <div className="text-gray-600">Expiring Soon</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
