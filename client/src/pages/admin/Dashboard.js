import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatCurrency } from '../../components/ui/utils';

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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// Custom Components
import DashboardCard from '../../components/ui/DashboardCard';

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

// Enhanced Paper for recent users section
const EnhancedPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

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

  // Format currency is now imported at the top of the file

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
          <DashboardCard title="Users" value={dashboardData.users} icon={<PeopleIcon fontSize="large" />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Bookings" value={dashboardData.bookings} icon={<CalendarTodayIcon fontSize="large" />} color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Services" value={dashboardData.services} icon={<MiscellaneousServicesIcon fontSize="large" />} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Vendors" value={dashboardData.vendors} icon={<StorefrontIcon fontSize="large" />} color="info" />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <DashboardCard 
            title="Total Revenue" 
            value={formatCurrency(dashboardData.revenue || 0)} 
            icon={<MonetizationOnIcon fontSize="large" />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <DashboardCard 
            title="Active Subscriptions" 
            value={dashboardData.activeSubscriptions || 0} 
            icon={<SubscriptionsIcon fontSize="large" />} 
            color="warning" 
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6, mb: 3 }}>
        <Typography variant="h5">
          Recent Users
        </Typography>
        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 500 }}>
          View All
        </Typography>
      </Box>
      <EnhancedPaper>
        <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Name
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Email
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Role
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Joined
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
          No recent users to display.
        </Typography>
        </Box>
      </EnhancedPaper>

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