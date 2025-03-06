import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import JobListingsPage from './pages/JobListingsPage';
import RecommendedPage from './pages/RecommendedPage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, loading } = useAuthStore();

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <JobListingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommended" 
            element={
              <ProtectedRoute>
                <RecommendedPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookmarks" 
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;