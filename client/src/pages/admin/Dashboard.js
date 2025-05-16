import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Material UI imports
import { Typography, Grid, Paper, Box, Divider, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';
import SimpleLayout from '../../components/layout/SimpleLayout';

// Dashboard sub-pages
import Profile from './Profile';
import Users from './Users';
import AdminServices from './Services';
import AdminCategories from './Categories';
import ContentManagement from './ContentManagement';
import Bookings from './Bookings';
import VendorSubscriptionManagement from './VendorSubscriptionManagement';

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
      <Box sx={{ fontSize: '3rem', color: 'error.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" color="text.primary">
        {value}
      </Typography>
    </Item>
  );
};

const AdminHome = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    bookings: 0,
    services: 0,
    vendors: 0,
    subscriptions: 0,
    activeSubscriptions: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const { data } = await axios.get('/api/dashboard/admin', config);
        
        setDashboardData({
          users: data.users || 0,
          bookings: data.bookings || 0,
          services: data.services || 0,
          vendors: data.vendors || 0,
          subscriptions: data.subscriptions || 0,
          activeSubscriptions: data.activeSubscriptions || 0,
          revenue: data.revenue || 0
        });
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
        System overview and management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Users" value={dashboardData.users} icon={<PeopleIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Bookings" value={dashboardData.bookings} icon={<CalendarTodayIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Services" value={dashboardData.services} icon={<MiscellaneousServicesIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Vendors" value={dashboardData.vendors} icon={<StorefrontIcon fontSize="large" />} />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recent Users
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Role
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Joined
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" color="text.secondary" align="center">
          No recent users to display.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        System Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h4" color="error.main">
              {formatCurrency(dashboardData.revenue)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Active Subscriptions
            </Typography>
            <Typography variant="h4" color="error.main">
              {dashboardData.activeSubscriptions}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Subscriptions
            </Typography>
            <Typography variant="h4" color="error.main">
              {dashboardData.subscriptions}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Typography variant="h4" color="error.main">
              98%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const AdminDashboard = () => {
  // Define sidebar menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
    },
    {
      text: 'Services',
      icon: <MiscellaneousServicesIcon />,
      path: '/admin/services',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: '/admin/categories',
    },
    {
      text: 'Content',
      icon: <HomeIcon />,
      path: '/admin/content',
    },
    {
      text: 'Bookings',
      icon: <CalendarTodayIcon />,
      path: '/admin/bookings',
    },
    {
      text: 'Vendor Subscriptions',
      icon: <SubscriptionsIcon />,
      path: '/admin/vendor-subscriptions',
    },
    {
      text: 'Subscription Plans',
      icon: <StorefrontIcon />,
      path: '/admin/subscription-plans',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/admin/profile',
    },
  ];

  return (
    <Routes>
      {/* Dashboard Pages - with sidebar */}
      <Route path="/" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <AdminHome />
        </DashboardLayout>
      } />
      <Route path="/profile" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <Profile />
        </DashboardLayout>
      } />
      <Route path="/users" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <Users />
        </DashboardLayout>
      } />
      <Route path="/services" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <AdminServices />
        </DashboardLayout>
      } />
      <Route path="/categories" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <AdminCategories />
        </DashboardLayout>
      } />
      <Route path="/content" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <ContentManagement />
        </DashboardLayout>
      } />
      <Route path="/bookings" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <Bookings />
        </DashboardLayout>
      } />
      <Route path="/subscription-plans" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <React.Suspense fallback={<Typography>Loading...</Typography>}>
            {React.createElement(React.lazy(() => import('./SubscriptionPlans')))}
          </React.Suspense>
        </DashboardLayout>
      } />
      <Route path="/vendor-subscriptions" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <VendorSubscriptionManagement />
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

export default AdminDashboard;