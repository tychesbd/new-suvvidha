import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;
  
  if (status === 'active' || status === 'approved') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === 'expired' || status === 'denied') {
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

/**
 * SubscriptionCard Component
 * 
 * @param {Object} props
 * @param {Object} props.subscription - Subscription details
 * @param {Function} props.onBuyClick - Function to call when buy/renew button is clicked
 * @param {boolean} props.isVendor - Whether the user is a vendor
 */
const SubscriptionCard = ({ subscription, onBuyClick, isVendor = false }) => {
  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining(subscription.endDate);
  const bookingProgress = subscription.bookingLimit > 0 
    ? (subscription.usedBookings / subscription.bookingLimit) * 100 
    : 0;

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" color="primary">
            {subscription.plan} Plan
          </Typography>
          <StatusChip 
            label={subscription.status} 
            status={subscription.status} 
          />
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Subscription Period
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CalendarTodayIcon color="primary" sx={{ mr: 1, fontSize: 'small' }} />
            <Typography variant="body1">
              {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Days Remaining
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TimerIcon color="warning" sx={{ mr: 1, fontSize: 'small' }} />
            <Typography variant="body1">
              {daysRemaining} days
            </Typography>
          </Box>
        </Box>
        
        {isVendor && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Bookings Usage
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <EventAvailableIcon color="success" sx={{ mr: 1, fontSize: 'small' }} />
              <Typography variant="body1">
                {subscription.bookingLimit - subscription.usedBookings} of {subscription.bookingLimit} remaining
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={bookingProgress} 
              sx={{ mt: 1, height: 8, borderRadius: 4 }} 
            />
          </Box>
        )}
        
        {subscription.features && subscription.features.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Features
            </Typography>
            <List dense>
              {subscription.features.map((feature, index) => (
                <FeatureItem key={index} text={feature} />
              ))}
            </List>
          </Box>
        )}
        
        {subscription.status === 'pending' && (
          <Box sx={{ mt: 2, bgcolor: 'warning.light', p: 1, borderRadius: 1 }}>
            <Typography variant="body2" color="warning.dark">
              Your subscription is pending approval. You will be notified once it's approved.
            </Typography>
          </Box>
        )}
      </CardContent>
      
      {(subscription.status === 'expired' || !isVendor) && (
        <CardActions sx={{ p: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            onClick={onBuyClick}
          >
            {subscription.status === 'expired' ? 'Renew Subscription' : 'Buy Now'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default SubscriptionCard;