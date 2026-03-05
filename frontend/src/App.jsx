import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import TechnicianSignup from './pages/TechnicianSignup';
import TechnicianDashboard from './pages/TechnicianDashboard';
import TankDetails from './pages/TankDetails';
import WardAnalysis from './pages/WardAnalysis';
import MicroplasticDetection from './pages/MicroplasticDetection';
import { useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'user' || user?.role === 'business_partner') return <Navigate to="/user/dashboard" replace />;
  if (user?.role === 'technician') return <Navigate to="/technician/dashboard" replace />;
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
              <div className="min-h-screen bg-slate-900 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden">
                {/* Global Background Elements */}
                <div className="fixed inset-0 z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-slate-900 opacity-80" />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 45, 0],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-cyan-600/20 rounded-full blur-[120px]"
                  />
                  <motion.div
                    animate={{
                      scale: [1.1, 1, 1.1],
                      rotate: [0, -30, 0],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px]"
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <Navbar />
                  <Hero />
                  <ProjectOverview />
                  <Features />
                  <DemoSection />
                  <Footer />
                </div>
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/technician/signup" element={<TechnicianSignup />} />
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
              <ProtectedRoute allowedRoles={['user', 'business_partner', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/technician/dashboard" element={
              <ProtectedRoute allowedRoles={['technician', 'admin']}>
                <TechnicianDashboard />
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
            {/* Microplastic Detection Route */}
            <Route path="/microplastic-detection" element={
              <ProtectedRoute>
                <MicroplasticDetection />
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
