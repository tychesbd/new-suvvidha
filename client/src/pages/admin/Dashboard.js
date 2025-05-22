import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatCurrency } from '../../components/ui/utils';
import '../../components/neumorphic/DashboardTile.css';

// Neumorphic components
import {
  Typography,
  Grid,
  Box,
  Divider,
  Alert,
  DashboardTile,
  Container,
  CircularProgress,
  Card,
  Paper
} from '../../components/neumorphic';

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

// Custom styles are now handled by neumorphic components

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
          <Grid item xs={6} sm={6} md={3}>
            <DashboardTile
              variant="convex"
              icon={
                <div className="dashboard-tile-icon">
                  <PeopleIcon style={{ fontSize: '1.75rem', color: 'var(--primary-main)' }} />
                </div>
              }
              title="Total Users"
              className="dashboard-tile"
            >
              <Typography className="dashboard-tile-value" style={{ color: 'var(--primary-main)' }}>
                {dashboardData.users}
              </Typography>
            </DashboardTile>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <DashboardTile
              variant="convex"
              icon={
                <div className="dashboard-tile-icon">
                  <CalendarTodayIcon style={{ fontSize: '1.75rem', color: 'var(--info-main)' }} />
                </div>
              }
              title="Bookings"
              className="dashboard-tile"
            >
              <Typography className="dashboard-tile-value" style={{ color: 'var(--info-main)' }}>
                {dashboardData.bookings}
              </Typography>
            </DashboardTile>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <DashboardTile
              variant="convex"
              icon={
                <div className="dashboard-tile-icon">
                  <MiscellaneousServicesIcon style={{ fontSize: '1.75rem', color: 'var(--success-main)' }} />
                </div>
              }
              title="Services"
              className="dashboard-tile"
            >
              <Typography className="dashboard-tile-value" style={{ color: 'var(--success-main)' }}>
                {dashboardData.services}
              </Typography>
            </DashboardTile>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <DashboardTile
              variant="convex"
              icon={
                <div className="dashboard-tile-icon">
                  <StorefrontIcon style={{ fontSize: '1.75rem', color: 'var(--primary-main)' }} />
                </div>
              }
              title="Vendors"
              className="dashboard-tile"
            >
              <Typography className="dashboard-tile-value" style={{ color: 'var(--primary-main)' }}>
                {dashboardData.vendors}
              </Typography>
            </DashboardTile>
          </Grid>
        </Grid>

        <Box my={2}>
          <Typography 
            variant="h5" 
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}
          >
            Revenue & Subscriptions
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DashboardTile
              variant="concave"
              title="Total Revenue"
              icon={
                <div className="dashboard-tile-icon">
                  <MonetizationOnIcon style={{ fontSize: '1.75rem', color: 'var(--success-main)' }} />
                </div>
              }
              className="dashboard-tile revenue"
            >
              <Typography className="dashboard-tile-value" style={{ color: 'var(--success-main)' }}>
                {formatCurrency(dashboardData.revenue)}
              </Typography>
            </DashboardTile>
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardTile
              variant="concave"
              title="Active Subscriptions"
              icon={
                <div className="dashboard-tile-icon">
                  <SubscriptionsIcon style={{ fontSize: '1.75rem', color: 'var(--success-main)' }} />
                </div>
              }
              className="dashboard-tile subscriptions"
            >
              <Typography className="dashboard-tile-value" style={{ color: 'var(--success-main)' }}>
                {dashboardData.activeSubscriptions} / {dashboardData.subscriptions}
              </Typography>
            </DashboardTile>
          </Grid>
        </Grid>
      </Box>
    </Container>
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