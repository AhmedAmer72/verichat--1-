import { AirService, BUILD_ENV } from '@mocanetwork/airkit';
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore';

import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ForumPage from './pages/ForumPage';
import ForumCategoryPage from './pages/ForumCategoryPage';
import ForumThreadPage from './pages/ForumThreadPage';
import QAPage from './pages/QAPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import DocsPage from './pages/DocsPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'; // Import the new Profile page
import UserProfilePage from './pages/UserProfilePage'; // Import the new User Profile page

const App: React.FC = () => {
  const { isAuthenticated, isInitializing, checkLogin } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  if (isInitializing) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs" element={<DocsPage />} />
          </>
        ) : (
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="forum" element={<ForumPage />} />
            <Route path="forum/:categoryId" element={<ForumCategoryPage />} />
            <Route path="forum/:categoryId/:threadId" element={<ForumThreadPage />} />
            <Route path="qa" element={<QAPage />} />
            <Route path="qa/:questionId" element={<QuestionDetailPage />} />
            <Route path="profile" element={<ProfilePage />} /> {/* New route for own profile */}
            <Route path="users/:mocaId" element={<UserProfilePage />} /> {/* New route for public profiles */}
            <Route path="docs" element={<DocsPage />} />
          </Route>
        )}
         {/* A general catch-all to redirect to the home page if no route matches */}
         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;