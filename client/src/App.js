import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SplashScreen from './components/layout/SplashScreen';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VendorRegister from './pages/VendorRegister';
import Plans from './pages/Plans';
import CustomerDashboard from './pages/customer/Dashboard';
import VendorDashboard from './pages/vendor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import SimpleLayout from './components/layout/SimpleLayout';
import Home from './pages/common/Home';
import Services from './pages/common/Services';
import AboutUs from './pages/common/AboutUs';

// Import theme
import theme from './components/neumorphic/theme';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Add base styles to document
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text.primary;
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.minHeight = '100vh';
    document.body.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userInfo) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
      // Redirect to appropriate dashboard based on role
      if (userInfo.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (userInfo.role === 'vendor') {
        return <Navigate to="/vendor" replace />;
      } else {
        return <Navigate to="/customer" replace />;
      }
    }

    return children;
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinished={() => setShowSplash(false)} />
      ) : (
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={userInfo ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={userInfo ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/vendor-register" element={userInfo ? <Navigate to="/" replace /> : <VendorRegister />} />
        
        {/* Home Route - Now the default landing page */}
        <Route path="/" element={
          <SimpleLayout>
            <Home />
          </SimpleLayout>
        } />
        
        {/* Public Services and About Us Routes */}
        <Route path="/services" element={
          <SimpleLayout>
            <Services />
          </SimpleLayout>
        } />
        
        <Route path="/about" element={
          <SimpleLayout>
            <AboutUs />
          </SimpleLayout>
        } />
        
        <Route path="/plans" element={
          <Plans />
        } />
        
        {/* Protected Routes */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/*"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;