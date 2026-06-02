// src/App.jsx
// Main router and protected route setup

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BulkUploadPage from './pages/BulkUploadPage';
import PublicStatsPage from './pages/PublicStatsPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

// ── Protected Route wrapper ─────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ── Public-only Route (redirect to dashboard if logged in) ──────────────
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public auth routes */}
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

    {/* Public stats — no auth needed */}
    <Route path="/stats/:shortCode" element={<PublicStatsPage />} />

    {/* Protected app routes */}
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/analytics/:id" element={<AnalyticsPage />} />
      <Route path="/bulk-upload" element={<BulkUploadPage />} />
    </Route>

    {/* Default redirects */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(22,22,37,0.95)',
              color: '#f1f5f9',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 20px rgba(99,102,241,0.1)',
              backdropFilter: 'blur(20px)',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#0f0f1a' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0f0f1a' },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
