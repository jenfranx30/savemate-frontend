// src/components/ProfilePage.jsx
// Added optional logo upload with default avatar fallback

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';

// Helper function to get account type label
function getAccountTypeLabel(user) {
  if (!user) return 'Guest';
  
  if (user.is_admin && user.is_business_owner) {
    return 'Admin & Business Account';
  }
  
  if (user.is_admin) {
    return 'Admin Account';
  }
  
  if (user.is_business_owner) {
    return 'Business Account';
  }
  
  return 'Individual Account';
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateStep, setDeactivateStep] = useState(1);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deactivateChecked, setDeactivateChecked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  
  // ✅ NEW: Logo upload state
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [logoUrl, setLogoUrl] = useState(user?.logo_url || '');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
    setDeactivateStep(1);
  };

  const handleDeactivateContinue = () => {
    if (!deactivateChecked) {
      alert('Please confirm you understand the consequences');
      return;
    }
    setDeactivateStep(2);
  };

  const handleDeactivatePassword = async () => {
    if (!passwordConfirm) {
      alert('Please enter your password to confirm');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/users/deactivate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: passwordConfirm,
          reason: deactivateReason
        })
      });

      if (response.ok) {
        alert('Account deactivated successfully');
        logout();
        navigate('/');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      alert('Failed to deactivate account');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/users/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwordData.current,
          new_password: passwordData.new
        })
      });

      if (response.ok) {
        alert('Password changed successfully');
        setShowPasswordModal(false);
        setPasswordData({ current: '', new: '', confirm: '' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail) {
      alert('Please enter a new email address');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/users/change-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_email: newEmail })
      });

      if (response.ok) {
        alert('Email change request sent. Please check your inbox.');
        setShowEmailModal(false);
        setNewEmail('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error changing email:', error);
      alert('Failed to change email');
    }
  };

  // ✅ NEW: Handle logo upload
  const handleLogoUpload = async (uploadedImages) => {
    if (uploadedImages.length > 0) {
      const newLogoUrl = uploadedImages[0].url;
      setLogoUrl(newLogoUrl);
      setShowLogoUpload(false);

      // Save to backend
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:8000/api/v1/users/me', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ logo_url: newLogoUrl })
        });
      } catch (error) {
        console.error('Error saving logo:', error);
      }
    }
  };

  // ✅ NEW: Remove logo
  const handleRemoveLogo = async () => {
    setLogoUrl('');
    
    // Update backend
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/v1/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logo_url: '' })
      });
    } catch (error) {
      console.error('Error removing logo:', error);
    }
  };

  // ✅ Get first letter for default avatar
  const getInitial = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-6">
            {/* ✅ Avatar with optional logo upload */}
            <div className="relative">
              {logoUrl ? (
                // Show uploaded logo
                <img
                  src={logoUrl}
                  alt="Business logo"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                // Show default avatar with initial
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-100">
                  {getInitial()}
                </div>
              )}
              
              {/* ✅ Small edit button overlay */}
              <button
                onClick={() => setShowLogoUpload(!showLogoUpload)}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 border-2 border-gray-200"
                title="Change logo"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.full_name || 'User'}</h1>
              <p className="text-gray-600 mt-1">
                Signed in as <span className="text-blue-600 font-medium">
                  {getAccountTypeLabel(user)}
                </span>
              </p>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
          </div>

          {/* ✅ Logo Upload Section (expandable) */}
          {showLogoUpload && (
            <div className="mt-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                  {logoUrl ? 'Change Logo' : 'Upload Business Logo'}
                </p>
                <button
                  onClick={() => setShowLogoUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {logoUrl && (
                <div className="mb-3">
                  <button
                    onClick={handleRemoveLogo}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remove current logo and use default avatar
                  </button>
                </div>
              )}

              <CloudinaryUploadWidget
                onUploadSuccess={handleLogoUpload}
                folder={user?.is_business_owner ? "businesses/logos" : "users/avatars"}
                maxFiles={1}
                currentImages={[]}
              />
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Account Information</h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={user?.full_name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Name is set during registration and cannot be changed.</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Change Email
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-400 transition-colors font-medium text-gray-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Log Out
            </button>
            
            <button
              onClick={handleDeactivateClick}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Change Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="newemail@example.com"
                />
              </div>
              <p className="text-sm text-gray-600">
                We'll send a verification link to your new email address.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEmailChange}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Verification
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            {deactivateStep === 1 ? (
              <>
                <h3 className="text-2xl font-bold mb-4 text-red-600">Deactivate Account</h3>
                <p className="text-gray-700 mb-4">
                  Are you sure you want to deactivate your account? This will:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Hide your profile and content</li>
                  <li>Remove access to your account</li>
                  <li>Cancel any active subscriptions</li>
                </ul>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Reason (optional)</label>
                  <textarea
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Let us know why you're leaving..."
                  />
                </div>
                <div className="flex items-start mb-4">
                  <input
                    type="checkbox"
                    checked={deactivateChecked}
                    onChange={(e) => setDeactivateChecked(e.target.checked)}
                    className="mt-1 mr-2"
                  />
                  <label className="text-sm text-gray-700">
                    I understand that this action will deactivate my account
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeactivateContinue}
                    className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4 text-red-600">Confirm Deactivation</h3>
                <p className="text-gray-700 mb-4">
                  Please enter your password to confirm account deactivation.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeactivatePassword}
                    className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Deactivate Account
                  </button>
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
