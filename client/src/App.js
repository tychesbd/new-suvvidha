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
      main: '#6a1b9a', // Rich purple as primary color
      light: '#9c4dcc',
      dark: '#38006b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f00', // Warm orange as secondary color
      light: '#ffa040',
      dark: '#c43e00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16, // Increased base font size for better readability
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#333333',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333333',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#333333',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#333333',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333333',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#333333',
    },
    button: {
      textTransform: 'none', // Prevents all-caps buttons
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
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