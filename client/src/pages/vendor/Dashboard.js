import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Material UI imports
import { Typography, Grid, Paper, Box, Button, Chip, CircularProgress, Alert, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const StatsCard = ({ title, value, icon }) => {
  return (
    <Item elevation={3}>
      <Box sx={{ fontSize: '3rem', color: 'secondary.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" color="text.primary">
        {value}
      </Typography>
    </Item>
  );
};

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

        // Fetch booking statistics
        const { data: bookingStats } = await axios.get('/api/bookings/stats', config);
        
        // Fetch subscription data
        const { data: subscriptionData } = await axios.get('/api/subscriptions/vendor', config);
        
        // Fetch recent bookings
        const { data: bookingsData } = await axios.get('/api/bookings?limit=5', config);
        
        // Fetch service metrics
        const { data: serviceStats } = await axios.get('/api/services/stats', config);

        setDashboardData({
          totalBookings: bookingStats.totalBookings || 0,
          activeBookings: bookingStats.activeBookings || 0,
          completedBookings: bookingStats.completedBookings || 0,
          revenue: bookingStats.revenue || 0,
          totalServices: serviceStats.totalServices || 0,
          activeServices: serviceStats.activeServices || 0,
          avgRating: serviceStats.avgRating || 0,
          reviewCount: serviceStats.reviewCount || 0
        });

        setSubscription(subscriptionData);
        setRecentBookings(bookingsData || []);
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage your bookings and analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Bookings" value={dashboardData.totalBookings} icon={<ShoppingCartIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Revenue" value={formatCurrency(dashboardData.revenue)} icon={<AnalyticsIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Active Bookings" value={dashboardData.activeBookings} icon={<StorefrontIcon fontSize="large" />} />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recent Bookings
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        {recentBookings.length > 0 ? (
          <Box>
            {/* Simple list of recent bookings */}
            {recentBookings.map((booking) => (
              <Box 
                key={booking._id} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  borderRadius: 1, 
                  bgcolor: 'background.default',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="subtitle2">{booking.serviceName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(booking.bookingDate).toLocaleDateString()} | {booking.customer?.name}
                  </Typography>
                </Box>
                <Chip 
                  label={booking.status} 
                  color={
                    booking.status === 'completed' ? 'success' :
                    booking.status === 'cancelled' ? 'error' :
                    booking.status === 'in-progress' ? 'warning' : 'info'
                  } 
                  size="small" 
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            ))}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                component={Link} 
                to="/vendor/booking" 
                variant="outlined" 
                size="small"
              >
                View All Bookings
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            You don't have any recent bookings.
          </Typography>
        )}
      </Paper>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Subscription Status
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {subscription ? (
            <SubscriptionCard 
              subscription={{
                plan: subscription.plan?.name || subscription.plan || 'Basic',
                price: subscription.price || 0,
                startDate: new Date(subscription.startDate),
                endDate: new Date(subscription.endDate),
                status: subscription.status || 'inactive',
                paymentStatus: subscription.paymentStatus || 'unpaid',
                features: subscription.features || subscription.plan?.features || [],
                bookingLimit: subscription.bookingsLeft || subscription.plan?.bookingLimit || 0,
                usedBookings: subscription.plan?.bookingLimit ? 
                  (subscription.plan.bookingLimit - subscription.bookingsLeft) || 0 : 
                  subscription.usedBookings || 0
              }}
              onBuyClick={() => window.location.href = '/plans'}
              isVendor={true}
            />
          ) : (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Active Subscription
              </Typography>
              <Typography variant="body1" paragraph>
                Subscribe to a plan to start accepting bookings and grow your business.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                to="/vendor/subscription-management"
              >
                Manage Subscription
              </Button>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Service Metrics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Total Services</Typography>
                  <Typography variant="h4" color="secondary.main">{dashboardData.totalServices}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Active Services</Typography>
                  <Typography variant="h4" color="secondary.main">{dashboardData.activeServices}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Avg. Rating</Typography>
                  <Typography variant="h4" color="secondary.main">{dashboardData.avgRating.toFixed(1)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Reviews</Typography>
                  <Typography variant="h4" color="secondary.main">{dashboardData.reviewCount}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
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