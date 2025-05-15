import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Language Context
import { LanguageProvider } from './contexts/LanguageContext';

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

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

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
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <CssBaseline />
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
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;