import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

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

const SubscriptionCard = ({ subscription, onBuyClick, isVendor = true }) => {
  // If no subscription, show a placeholder card
  if (!subscription) {
    return (
      <StyledCard variant="outlined">
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            No Active Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Subscribe to a plan to access all vendor features
          </Typography>
          {isVendor && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onBuyClick}
              sx={{ mt: 2 }}
            >
              Buy Subscription
            </Button>
          )}
        </CardContent>
      </StyledCard>
    );
  }

  // Calculate days left
  const today = new Date();
  const endDate = new Date(subscription.endDate);
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  
  // Calculate progress percentage
  const startDate = new Date(subscription.startDate);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const daysUsed = totalDays - daysLeft;
  const progressPercentage = Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));

  return (
    <StyledCard variant="outlined">
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div">
            {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
          </Typography>
          <StatusChip 
            label={subscription.status} 
            status={subscription.status} 
            size="small"
          />
        </Box>
        
        <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
          ₹{subscription.price}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TimerIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {daysLeft} days left
          </Typography>
        </Box>
        
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Valid until: {endDate.toLocaleDateString()}
        </Typography>
        
        <List dense sx={{ mb: 2 }}>
          {subscription.features && subscription.features.map((feature, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 'auto' }}>
          {isVendor && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onBuyClick}
              fullWidth
              disabled={subscription.status === 'active'}
            >
              {subscription.status === 'active' ? 'Active' : 'Renew Subscription'}
            </Button>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default SubscriptionCard;