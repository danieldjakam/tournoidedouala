import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import UserProfilePage from '@/pages/UserProfilePage';
import UserDashboardPage from '@/pages/UserDashboardPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import MatchsPage from './pages/MatchsPage';
import MatchDetailPage from './pages/MatchDetailPage';
import PronosticPage from './pages/PronosticPage';
import LeaderboardPage from './pages/LeaderboardPage';
import VoteEquipePage from './pages/VoteEquipePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />

             <Route
              path="/matches"
              element={
                <ProtectedRoute>
                  <MatchsPage />
                </ProtectedRoute>
              }
            />

             <Route
              path="/matches/:matchId"
              element={
                <ProtectedRoute>
                  <MatchDetailPage />
                </ProtectedRoute>
              }
            />

             <Route
              path="/pronostics"
              element={
                <ProtectedRoute>
                  <PronosticPage />
                </ProtectedRoute>
              }
            />

             <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vote-equipe"
              element={
                <ProtectedRoute>
                  <VoteEquipePage />
                </ProtectedRoute>
              }
            />

             <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;