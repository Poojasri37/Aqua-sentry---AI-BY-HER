import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/landing/Navbar';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
import Hero from './components/landing/Hero';
import ProjectOverview from './components/landing/ProjectOverview';
import Features from './components/landing/Features';
import DemoSection from './components/landing/DemoSection';
import Footer from './components/landing/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import FeaturesPage from './pages/FeaturesPage';
import Integrations from './pages/Integrations';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import TankDetails from './pages/TankDetails';
import WardAnalysis from './pages/WardAnalysis';
import { useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'user' || user?.role === 'business_partner') return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={
              <div className="min-h-screen mesh-gradient animate-gradient-flow text-gray-900 selection:bg-blue-100 relative">
                <Navbar />
                <Hero />
                <ProjectOverview />
                <Features />
                <DemoSection />
                <Footer />
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user/dashboard" element={
              <ProtectedRoute allowedRoles={['user', 'business_partner']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            {/* Tank Details Route */}
            <Route path="/tanks/:id" element={
              <ProtectedRoute>
                <TankDetails />
              </ProtectedRoute>
            } />
            {/* Ward Analysis Route */}
            <Route path="/ward-analysis" element={
              <ProtectedRoute>
                <WardAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
