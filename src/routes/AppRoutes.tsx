import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Projects from '../pages/Projects';
import Contact from '../pages/Contact';

// Admin Pages
import AdminLogin from '../pages/Admin/AdminLogin';
import Dashboard from '../pages/Admin/Dashboard';
import ProjectsAdmin from '../pages/Admin/ProjectsAdmin';
import SkillsAdmin from '../pages/Admin/SkillsAdmin';
import MessagesAdmin from '../pages/Admin/MessagesAdmin';
import ProfileSettings from '../pages/Admin/ProfileSettings';

// Layout Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition: Transition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && restricted) {
    // Redirect to dashboard if trying to access login while authenticated
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// Layout for public pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Layout for admin pages
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <motion.div
                key="home"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Home />
              </motion.div>
            </PublicLayout>
          }
        />
        
        <Route
          path="/about"
          element={
            <PublicLayout>
              <motion.div
                key="about"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <About />
              </motion.div>
            </PublicLayout>
          }
        />
        
        <Route
          path="/skills"
          element={
            <PublicLayout>
              <motion.div
                key="skills"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Skills />
              </motion.div>
            </PublicLayout>
          }
        />
        
        <Route
          path="/projects"
          element={
            <PublicLayout>
              <motion.div
                key="projects"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Projects />
              </motion.div>
            </PublicLayout>
          }
        />
        
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <motion.div
                key="contact"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Contact />
              </motion.div>
            </PublicLayout>
          }
        />

        {/* Admin Auth Routes */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute restricted>
              <AdminLayout>
                <motion.div
                  key="admin-login"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AdminLogin />
                </motion.div>
              </AdminLayout>
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <motion.div
                  key="admin-dashboard"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <motion.div
                  key="admin-projects"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ProjectsAdmin />
                </motion.div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <motion.div
                  key="admin-skills"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SkillsAdmin />
                </motion.div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <motion.div
                  key="admin-messages"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MessagesAdmin />
                </motion.div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <motion.div
                  key="admin-profile"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ProfileSettings />
                </motion.div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <motion.div
                key="not-found"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen flex items-center justify-center"
              >
                <div className="text-center">
                  <h1 className="text-6xl font-heading font-bold text-text-dark mb-4">404</h1>
                  <p className="text-xl text-text-light mb-8">Page not found</p>
                  <a href="/" className="btn-primary">
                    Go Back Home
                  </a>
                </div>
              </motion.div>
            </PublicLayout>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;