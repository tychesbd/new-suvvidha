import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import { useSelector } from 'react-redux';

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;
  
  if (status === 'active') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === 'expired') {
    color = theme.palette.error.main;
    backgroundColor = theme.palette.error.light;
  } else if (status === 'pending') {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning.light;
  }
  
  return {
    color: color,
    backgroundColor: backgroundColor,
    fontWeight: 'bold',
    '& .MuiChip-label': {
      textTransform: 'capitalize',
    },
  };
});

const FeatureItem = ({ text }) => (
  <ListItem>
    <ListItemIcon>
      <CheckCircleIcon color="success" fontSize="small" />
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

const Subscription = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    used: 0,
    remaining: 0
  });

  // Fetch vendor subscription
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/subscriptions/vendor', config);
      setSubscription(data);
      
      // Calculate booking stats
      if (data && data.bookingLimit) {
        const usedBookings = data.usedBookings || 0;
        setBookingStats({
          total: data.bookingLimit,
          used: usedBookings,
          remaining: data.bookingLimit - usedBookings
        });
      }
      
      setError(null);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchSubscription();
    }
  }, [userInfo]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!subscription) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Subscription
        </Typography>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You don't have an active subscription
          </Typography>
          <Typography variant="body1" paragraph>
            Subscribe to a plan to start accepting bookings and grow your business.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            href="/vendor/subscription-management"
          >
            View Subscription Plans
          </Button>
        </Paper>
      </Box>
    );
  }

  const daysRemaining = calculateDaysRemaining(subscription.endDate);
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Subscription
      </Typography>
      
      <Grid container spacing={3}>
        {/* Subscription Details Card */}
        <Grid item xs={12} md={7}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
                  {subscription.planName} Plan
                </Typography>
                <StatusChip 
                  label={subscription.status} 
                  status={subscription.status} 
                />
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatDate(subscription.startDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      End Date
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatDate(subscription.endDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimerIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Days Remaining
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {daysRemaining} days
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PaymentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Payment Status
                    </Typography>
                  </Box>
                  <StatusChip 
                    label={subscription.paymentStatus} 
                    status={subscription.paymentStatus === 'paid' ? 'active' : 'pending'} 
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Plan Features
              </Typography>
              
              <List dense>
                {subscription.features && subscription.features.map((feature, index) => (
                  <FeatureItem key={index} text={feature} />
                ))}
              </List>
            </CardContent>
            
            {subscription.status === 'expired' && (
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary"
                  href="/vendor/subscription-management"
                  fullWidth
                >
                  Renew Subscription
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
        
        {/* Booking Stats Card */}
        <Grid item xs={12} md={5}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Allowance
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EventAvailableIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Booking Limit
                  </Typography>
                  <Typography variant="h5">
                    {bookingStats.total}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Used
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {bookingStats.used}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Remaining
                    </Typography>
                    <Typography variant="h6" color="success.dark">
                      {bookingStats.remaining}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              {subscription.status === 'active' && bookingStats.remaining <= 5 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  You're running low on bookings. Consider upgrading your plan.
                </Alert>
              )}
              
              {subscription.status === 'active' && bookingStats.remaining === 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  You've reached your booking limit. Upgrade your plan to accept more bookings.
                </Alert>
              )}
            </CardContent>
            
            {subscription.status === 'active' && (
              <CardActions>
                <Button 
                  variant="outlined" 
                  color="primary"
                  href="/vendor/subscription-management"
                  fullWidth
                >
                  Upgrade Plan
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Subscription;