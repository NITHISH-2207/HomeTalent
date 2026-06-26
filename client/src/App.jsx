import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// Import Shared Pages
import SplashScreen from './pages/shared/SplashScreen.jsx';
import Landing from './pages/shared/Landing.jsx';
import Login from './pages/shared/Login.jsx';
import Register from './pages/shared/Register.jsx';
import NotFound from './pages/shared/NotFound.jsx';

// Import Customer Pages
import Home from './pages/customer/Home.jsx';
import BrowseSkills from './pages/customer/BrowseSkills.jsx';
import ProviderDetail from './pages/customer/ProviderDetail.jsx';
import BookingHistory from './pages/customer/BookingHistory.jsx';
import LeaveReview from './pages/customer/LeaveReview.jsx';

// Import Provider Pages
import Dashboard from './pages/provider/Dashboard.jsx';
import EditProfile from './pages/provider/EditProfile.jsx';
import BookingRequests from './pages/provider/BookingRequests.jsx';
import MyReviews from './pages/provider/MyReviews.jsx';

import Spinner from './components/common/Spinner.jsx';

// Protected Route Guard Component
const ProtectedRoute = ({ children, requireProvider = false }) => {
  const { isAuthenticated, activeMode, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireProvider && activeMode !== 'provider') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(
    !sessionStorage.getItem('splashSeen')
  );

  if (showSplash) {
    return (
      <SplashScreen onComplete={() => {
        sessionStorage.setItem('splashSeen', 'true');
        setShowSplash(false);
      }} />
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public & Shared Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Customer Routes */}
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowseSkills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/:id"
          element={
            <ProtectedRoute>
              <ProviderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-review/:bookingId"
          element={
            <ProtectedRoute>
              <LeaveReview />
            </ProtectedRoute>
          }
        />

        {/* Protected Provider Routes */}
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute requireProvider={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/profile"
          element={
            <ProtectedRoute requireProvider={true}>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/requests"
          element={
            <ProtectedRoute requireProvider={true}>
              <BookingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute requireProvider={true}>
              <MyReviews />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
