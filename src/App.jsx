// src/App.jsx


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthModalProvider } from './context/AuthModalContext';
import ProtectedRoute from './components/ProtectedRoute';

// Existing imports
import HomePage from './components/HomePage';
import DealsPage from './components/DealsPage';
import DealDetailsPage from './components/DealDetailsPage';
import Dashboard from './components/Dashboard';
import BusinessDashboard from './components/BusinessDashboard';
import ProfilePage from './components/ProfilePage';
import FavoritesPage from './components/FavoritesPage';
import CategoriesPage from './components/CategoriesPage';
import SearchResults from './pages/SearchResults';
import PostDealPage from './pages/PostDealPage';
import MyStorePage from './pages/MyStorePage';
import BusinessStoreSettingsPage from './pages/BusinessStoreSettingsPage';
import BusinessSettingsPage from './pages/BusinessSettingsPage';
import Top10StoresPage from './pages/Top10StoresPage';
import DealsMapPage from './pages/DealsMapPage'; // Map view page

// Verification imports
import BusinessVerificationPage from './pages/BusinessVerificationPage';
import AdminVerificationDashboard from './pages/AdminVerificationDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Main admin landing page

// Auth Modal Component
import AuthModal from './components/auth/AuthModal';
import BottomNavigation from './components/BottomNavigation'; // Mobile bottom nav

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <AuthModalProvider>
            <AuthModal />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/deals/:id" element={<DealDetailsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/top-stores" element={<Top10StoresPage />} />
              <Route path="/deals/map" element={<DealsMapPage />} />

              {/* User Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />

              {/* Business Protected Routes */}
              <Route
                path="/business/dashboard"
                element={
                  <ProtectedRoute requireBusiness={true}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business/post-deal"
                element={
                  <ProtectedRoute requireBusiness={true}>
                    <PostDealPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business/my-store"
                element={
                  <ProtectedRoute requireBusiness={true}>
                    <MyStorePage />
                  </ProtectedRoute>
                }
              />
              
              {/* ✅ NEW: Business Settings Route - Account/Notifications/System */}
              <Route
                path="/business/settings"
                element={
                  <ProtectedRoute requireBusiness={true}>
                    <BusinessSettingsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Store Settings Route - Business Profile Management */}
              <Route
                path="/business/store-settings"
                element={
                  <ProtectedRoute requireBusiness={true}>
                    <BusinessStoreSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Verification Routes */}
              <Route
                path="/business/verification"
                element={
                  <ProtectedRoute requireBusiness={true}>
                    <BusinessVerificationPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verifications"
                element={
                  <ProtectedRoute>
                    <AdminVerificationDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <BottomNavigation />
          </AuthModalProvider>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
