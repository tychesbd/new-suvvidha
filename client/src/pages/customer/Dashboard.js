import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../components/ui/utils';

// Custom Components
import DashboardCard from '../../components/ui/DashboardCard';

// Material UI imports
import { Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

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

// Enhanced Paper for recent bookings section
const EnhancedPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

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
        Here's an overview of your activity
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Active Bookings" value={dashboardData.activeBookings} icon={<ShoppingCartIcon fontSize="large" />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Completed" value={dashboardData.completedBookings} icon={<CheckCircleIcon fontSize="large" />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Cancelled" value={dashboardData.cancelledBookings} icon={<CancelIcon fontSize="large" />} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Spent" value={formatCurrency(dashboardData.totalSpent)} icon={<PaymentIcon fontSize="large" />} color="info" />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6, mb: 3 }}>
        <Typography variant="h5">
          Recent Bookings
        </Typography>
        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 500 }}>
          View All
        </Typography>
      </Box>
      <EnhancedPaper>
        {dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking._id.substring(0, 8)}</TableCell>
                    <TableCell>{booking.service ? booking.service.name || booking.service.title : booking.serviceName}</TableCell>
                    <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={
                          booking.status === 'completed' ? 'success' : 
                          booking.status === 'in-progress' || booking.status === 'pending' ? 'primary' : 
                          booking.status === 'cancelled' ? 'error' : 'warning'
                        }
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(booking.amount || 0)}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            You don't have any recent bookings.
          </Typography>
        )}
      </EnhancedPaper>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recommended Services
      </Typography>
      <Grid container spacing={3}>
        {['Home Cleaning', 'Plumbing', 'Electrical Repair', 'Painting'].map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.default',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.light',
                  mb: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white'
                }}
              >
                {index === 0 && <CleaningServicesIcon />}
                {index === 1 && <PlumbingIcon />}
                {index === 2 && <ElectricalServicesIcon />}
                {index === 3 && <FormatPaintIcon />}
              </Box>
              <Typography variant="subtitle1">{service}</Typography>
              <Typography variant="body2" color="text.secondary">
                Starting from ₹{(index + 5) * 100}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
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