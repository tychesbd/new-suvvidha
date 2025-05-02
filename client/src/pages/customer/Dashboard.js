import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI imports
import { Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
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
      <Box sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" color="text.primary">
        {value}
      </Typography>
    </Item>
  );
};

const CustomerHome = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Here's an overview of your activity
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Active Bookings" value="3" icon={<ShoppingCartIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Completed" value="8" icon={<CheckCircleIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Cancelled" value="2" icon={<CancelIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Spent" value="₹4,250" icon={<PaymentIcon fontSize="large" />} />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recent Bookings
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Mock booking data - in a real app, this would come from an API */}
        {[1, 2, 3].length > 0 ? (
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
                {[
                  {
                    id: 'BK001',
                    service: 'Home Cleaning',
                    date: '2023-12-15',
                    status: 'completed',
                    amount: 1200
                  },
                  {
                    id: 'BK002',
                    service: 'Plumbing Service',
                    date: '2023-12-20',
                    status: 'active',
                    amount: 850
                  },
                  {
                    id: 'BK003',
                    service: 'Electrical Repair',
                    date: '2023-12-25',
                    status: 'pending',
                    amount: 1500
                  }
                ].map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={
                          booking.status === 'completed' ? 'success' : 
                          booking.status === 'active' ? 'primary' : 
                          booking.status === 'cancelled' ? 'error' : 'warning'
                        }
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>₹{booking.amount}</TableCell>
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
      </Paper>

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