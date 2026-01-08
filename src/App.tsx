// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import PageLayout from './components/layout/PageLayout';
import LandingPage from './components/landing/LandingPage';
import DashboardHome from './components/dashboard/DashboardHome';
import useAppStore from './store/appStore';
import { ToastContainer } from './components/common/ToastContainer';

// Placeholder components (will build these next)
import DocumentGenerator from './components/documents/DocumentGenerator';
import DocumentsList from './components/documents/DocumentsList';
import { NegotiationHub } from './components/negotiations/NegotiationHub';
import { Analytics } from './components/analytics/Analytics';

function App() {
  const { isDemoMode, loadDemoData } = useAppStore();

  useEffect(() => {
    // Load demo data on mount if in demo mode
    if (isDemoMode) {
      console.log('Demo mode active - loading demo data');
      loadDemoData();
    }
  }, [isDemoMode, loadDemoData]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* App routes with PageLayout wrapper */}
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/generate" element={<DocumentGenerator />} />
          <Route path="/negotiations" element={<NegotiationHub />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
