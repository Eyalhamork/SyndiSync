// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageLayout from './components/layout/PageLayout';
import LandingPage from './components/landing/LandingPage';
import DashboardHome from './components/dashboard/DashboardHome';
import { ToastContainer } from './components/common/ToastContainer';
import { PageTransition } from './components/common/PageTransition';
import OnboardingPage from './components/onboarding/OnboardingPage';
import useAppStore from './store/appStore';

// App pages
import DocumentGenerator from './components/documents/DocumentGenerator';
import DocumentsList from './components/documents/DocumentsList';
import { NegotiationHub } from './components/negotiations/NegotiationHub';
import { Analytics } from './components/analytics/Analytics';

// Protected Route Wrapper to enforce onboarding
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { hasCompletedOnboarding } = useAppStore();

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Animated Routes wrapper component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public landing page */}
        <Route path="/" element={
          <PageTransition>
            <LandingPage />
          </PageTransition>
        } />

        {/* Dedicated Onboarding Route */}
        <Route path="/onboarding" element={
          <PageTransition>
            <OnboardingPage />
          </PageTransition>
        } />

        {/* App routes with PageLayout wrapper - Protected */}
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageTransition>
                <DashboardHome />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <PageTransition>
                <DocumentsList />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/generate" element={
            <ProtectedRoute>
              <PageTransition>
                <DocumentGenerator />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/negotiations" element={
            <ProtectedRoute>
              <PageTransition>
                <NegotiationHub />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <PageTransition>
                <Analytics />
              </PageTransition>
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
