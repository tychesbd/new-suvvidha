import React from 'react';
import { Paper, Box, Typography, LinearProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { formatCurrency } from './utils';

const StyledCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}));

const StatusBadge = styled(Box)(({ theme, status }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  backgroundColor: status === 'active' ? theme.palette.success.light : 
                  status === 'expired' ? theme.palette.error.light : 
                  theme.palette.warning.light,
  color: status === 'active' ? theme.palette.success.dark : 
         status === 'expired' ? theme.palette.error.dark : 
         theme.palette.warning.dark,
}));

const SubscriptionStatusCard = ({ subscription }) => {
  if (!subscription) {
    return (
      <StyledCard>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <SubscriptionsIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No Active Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Subscribe to a plan to access vendor features
          </Typography>
          <Button variant="contained" color="primary" href="/vendor/subscription">
            View Plans
          </Button>
        </Box>
      </StyledCard>
    );
  }

  // Calculate days remaining and percentage
  const today = new Date();
  const endDate = new Date(subscription.endDate);
  const startDate = new Date(subscription.startDate);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  const percentRemaining = Math.round((daysRemaining / totalDays) * 100);
  
  const status = today > endDate ? 'expired' : 
                daysRemaining < 7 ? 'expiring' : 'active';

  return (
    <StyledCard>
      <StatusBadge status={status}>
        {status}
      </StatusBadge>
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
        {subscription.plan.name}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subscription.plan.description}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          Subscription Status
        </Typography>
        <Typography variant="body2" fontWeight={500} color={status === 'active' ? 'success.main' : status === 'expired' ? 'error.main' : 'warning.main'}>
          {status === 'active' ? 'Active' : status === 'expired' ? 'Expired' : 'Expiring Soon'}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          Price
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {formatCurrency(subscription.plan.price)}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Expires On
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {new Date(subscription.endDate).toLocaleDateString()}
        </Typography>
      </Box>
      
      {status !== 'expired' && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Days Remaining
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {daysRemaining} of {totalDays} days
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={percentRemaining} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              mb: 3,
              backgroundColor: 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: status === 'active' ? 'success.main' : 'warning.main'
              }
            }} 
          />
        </>
      )}
      
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          href="/vendor/subscription"
        >
          {status === 'expired' ? 'Renew Subscription' : 'Manage Subscription'}
        </Button>
      </Box>
    </StyledCard>
  );
};

export default SubscriptionStatusCard;