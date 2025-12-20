// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './components/HomePage';
import DealsPage from './components/DealsPage';
import DealDetailsPage from './components/DealDetailsPage';
import CategoriesPage from './components/CategoriesPage';
import AboutPage from './components/AboutPage';
import SearchResults from './pages/SearchResults';
import Top10StoresPage from './pages/Top10StoresPage';

// Auth Pages
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

// Protected Pages
import Dashboard from './components/Dashboard';
import FavoritesPage from './components/FavoritesPage';
import ProfilePage from './components/ProfilePage';
import PostDealPage from './pages/PostDealPage'; // ADDED: Post Deal page for business users

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ============================================ */}
          {/* PUBLIC ROUTES - Accessible to everyone      */}
          {/* ============================================ */}
          
          <Route path="/" element={<HomePage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/deals/:id" element={<DealDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/top-10-stores" element={<Top10StoresPage />} />
          
          {/* ============================================ */}
          {/* AUTH ROUTES - Login and Signup              */}
          {/* ============================================ */}
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          
          {/* ============================================ */}
          {/* PROTECTED ROUTES - Require authentication   */}
          {/* ============================================ */}
          
          {/* Dashboard - Different for individual vs business */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Favorites - Available to all authenticated users */}
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Profile - Available to all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* ============================================ */}
          {/* BUSINESS ROUTES - Require business account  */}
          {/* ============================================ */}
          
          {/* Post Deal - ONLY for business accounts */}
          <Route 
            path="/business/post-deal" 
            element={
              <ProtectedRoute requireBusiness={true}>
                <PostDealPage />
              </ProtectedRoute>
            } 
          />
          
          {/* ============================================ */}
          {/* CATCH-ALL ROUTE - Redirect unknown routes   */}
          {/* ============================================ */}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
