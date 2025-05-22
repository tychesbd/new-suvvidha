import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../components/ui/utils';
import '../../components/neumorphic/DashboardTile.css';

// Material UI imports
import { 
  Typography, 
  Grid, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button, 
  CircularProgress, 
  Alert,
  Container 
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';
import SimpleLayout from '../../components/layout/SimpleLayout';
import BookingList from '../../components/booking/BookingList';

// Dashboard sub-pages
import Profile from './Profile';

// Common pages
import Home from '../common/Home';
import Services from '../common/Services';
import AboutUs from '../common/AboutUs';

const CustomerHome = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    recentBookings: []
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
        const { data } = await axios.get('/api/dashboard/customer', config);
        
        setDashboardData({
          activeBookings: data.activeBookings || 0,
          completedBookings: data.completedBookings || 0,
          cancelledBookings: data.cancelledBookings || 0,
          totalSpent: data.totalSpent || 0,
          recentBookings: data.recentBookings || []
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
          {/* Active Bookings */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile">
              <div className="dashboard-tile-icon">
                <ShoppingCartIcon style={{ fontSize: '1.75rem', color: 'var(--primary-main)' }} />
              </div>
              <Typography className="dashboard-tile-title">Active Bookings</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--primary-main)' }}>
                {dashboardData.activeBookings}
              </Typography>
            </Box>
          </Grid>

          {/* Completed Bookings */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile">
              <div className="dashboard-tile-icon">
                <CheckCircleIcon style={{ fontSize: '1.75rem', color: 'var(--success-main)' }} />
              </div>
              <Typography className="dashboard-tile-title">Completed</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--success-main)' }}>
                {dashboardData.completedBookings}
              </Typography>
            </Box>
          </Grid>

          {/* Cancelled Bookings */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile">
              <div className="dashboard-tile-icon">
                <CancelIcon style={{ fontSize: '1.75rem', color: 'var(--error-main)' }} />
              </div>
              <Typography className="dashboard-tile-title">Cancelled</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--error-main)' }}>
                {dashboardData.cancelledBookings}
              </Typography>
            </Box>
          </Grid>

          {/* Total Spent */}
          <Grid item xs={6} sm={6} md={3}>
            <Box className="dashboard-tile revenue">
              <div className="dashboard-tile-icon">
                <PaymentIcon style={{ fontSize: '1.75rem', color: 'var(--success-dark)' }} />
              </div>
              <Typography className="dashboard-tile-title">Total Spent</Typography>
              <Typography className="dashboard-tile-value" style={{ color: 'var(--success-dark)' }}>
                {formatCurrency(dashboardData.totalSpent)}
              </Typography>
            </Box>
          </Grid>        </Grid>


      </Box>
    </Container>
  );
};

const CustomerDashboard = () => {
  // Define sidebar menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/customer',
    },
    {
      text: 'Booking',
      icon: <ShoppingCartIcon />,
      path: '/customer/booking',
    },
    {
      text: 'Booking History',
      icon: <HistoryIcon />,
      path: '/customer/booking-history',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/customer/profile',
    },
  ];

  return (
    <Routes>
      {/* Dashboard Pages - with sidebar */}
      <Route path="/" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <CustomerHome />
        </DashboardLayout>
      } />
      <Route path="/profile" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <Profile />
        </DashboardLayout>
      } />
      <Route path="/booking" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <Typography variant="h4">Booking</Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            View your in-progress bookings
          </Typography>
          <BookingList type="active" />
        </DashboardLayout>
      } />
      <Route path="/booking-history" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <Typography variant="h4">Booking History</Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            View your completed and cancelled bookings
          </Typography>
          <BookingList type="history" />
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

export default CustomerDashboard;