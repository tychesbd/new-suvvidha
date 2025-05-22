import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatCurrency } from '../../components/ui/utils';
import '../../components/neumorphic/DashboardTile.css';

// Custom Components
import DashboardCard from '../../components/ui/DashboardCard';
import SubscriptionStatusCard from '../../components/ui/SubscriptionStatusCard';

// Material UI imports
import { Typography, Grid, Paper, Box, Button, Chip, CircularProgress, Alert, LinearProgress, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import StarIcon from '@mui/icons-material/Star';
import ReviewsIcon from '@mui/icons-material/Reviews';

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';
import SimpleLayout from '../../components/layout/SimpleLayout';
import SubscriptionCard from '../../components/subscription/SubscriptionCard';

// Dashboard sub-pages
import Profile from './Profile';
import SubscriptionManagement from './SubscriptionManagement';
import Subscription from './Subscription';

// Common pages
import Home from '../common/Home';
import Services from '../common/Services';
import AboutUs from '../common/AboutUs';

// Enhanced Paper for recent bookings section
const EnhancedPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

const VendorHome = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    revenue: 0,
    totalServices: 0,
    activeServices: 0,
    avgRating: 0,
    reviewCount: 0
  });
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Fetch dashboard statistics from our new endpoint
        const { data } = await axios.get('/api/dashboard/vendor', config);
        
        // Fetch subscription data
        const { data: subscriptionData } = await axios.get('/api/subscriptions/vendor', config);

        setDashboardData({
          totalBookings: data.totalBookings || 0,
          activeBookings: data.activeBookings || 0,
          completedBookings: data.completedBookings || 0,
          revenue: data.revenue || 0,
          totalServices: data.totalServices || 0,
          activeServices: data.activeServices || 0,
          avgRating: data.avgRating || 0,
          reviewCount: data.reviewCount || 0
        });

        setSubscription(subscriptionData);
        setRecentBookings(data.recentBookings || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.token) {
      fetchData();
    }
  }, [userInfo]);

  // Format currency is now imported at the top of the file

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size="large" color="primary" />
      </Box>
    );
  }

  return (
    <Container style={{ padding: '1rem' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box mb={1}>
          <Typography 
            variant="h4" 
            style={{ 
              marginBottom: '4px',
              color: 'var(--text-primary)',
              fontSize: '1.75rem',
              fontWeight: 600
            }}
          >
            Welcome, {userInfo?.name}!
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            variant="convex"
            style={{ marginBottom: '8px' }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Total Bookings */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile">
              <div className="dashboard-tile-icon">
                <CalendarTodayIcon style={{ fontSize: '1.75rem', color: 'var(--primary-main)' }} />
              </div>
              <Typography className="dashboard-tile-title">Total Bookings</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--primary-main)' }}>
                {dashboardData.totalBookings}
              </Typography>
            </Box>
          </Grid>

          {/* Completed Bookings */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile">
              <div className="dashboard-tile-icon">
                <CheckCircleIcon style={{ fontSize: '1.75rem', color: 'var(--success-main)' }} />
              </div>
              <Typography className="dashboard-tile-title">Completed Bookings</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--success-main)' }}>
                {dashboardData.completedBookings}
              </Typography>
            </Box>
          </Grid>

          {/* Revenue */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile revenue">
              <div className="dashboard-tile-icon">
                <MonetizationOnIcon style={{ fontSize: '1.75rem', color: 'var(--success-dark)' }} />
              </div>
              <Typography className="dashboard-tile-title">Total Revenue</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--success-dark)' }}>
                {formatCurrency(dashboardData.revenue)}
              </Typography>
            </Box>
          </Grid>

          {/* Active Services */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile">
              <div className="dashboard-tile-icon">
                <MiscellaneousServicesIcon style={{ fontSize: '1.75rem', color: 'var(--info-main)' }} />
              </div>
              <Typography className="dashboard-tile-title">Active Services</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--info-main)' }}>
                {dashboardData.activeServices}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Subscription Status */}
        {subscription && (
          <Box mt={3}>
            <Typography variant="h6" mb={2}>Subscription Status</Typography>
            <SubscriptionStatusCard subscription={subscription} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

const VendorDashboard = () => {
  // Define sidebar menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/vendor',
    },
    {
      text: 'Booking',
      icon: <ShoppingCartIcon />,
      path: '/vendor/booking',
    },
    {
      text: 'Subscription Management',
      icon: <SubscriptionsIcon />,
      path: '/vendor/subscription-management',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/vendor/profile',
    },
  ];

  return (
    <Routes>
      {/* Dashboard Pages - with sidebar */}
      <Route path="/" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <VendorHome />
        </DashboardLayout>
      } />
      <Route path="/profile" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <Profile />
        </DashboardLayout>
      } />

      <Route path="/booking" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <React.Suspense fallback={<Typography>Loading...</Typography>}>
            {/* Lazy load the Bookings component */}
            {React.createElement(React.lazy(() => import('./Bookings')))} 
          </React.Suspense>
        </DashboardLayout>
      } />
      <Route path="/subscription-management" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <SubscriptionManagement />
        </DashboardLayout>
      } />
      <Route path="/subscription" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <Subscription />
        </DashboardLayout>
      } />
      
      {/* Common Pages - without sidebar */}
      <Route path="/home" element={
        <SimpleLayout title="Home">
          <Home />
        </SimpleLayout>
      } />
      <Route path="/services" element={
        <SimpleLayout title="Services">
          <Services />
        </SimpleLayout>
      } />
      <Route path="/about" element={
        <SimpleLayout title="About Us">
          <AboutUs />
        </SimpleLayout>
      } />
    </Routes>
  );
};

export default VendorDashboard;