import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Styled components
const PlanCard = styled(Card)(({ theme, selected }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  transform: selected ? 'scale(1.03)' : 'scale(1)',
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  boxShadow: selected 
    ? `0 8px 16px 0 ${theme.palette.primary.light}` 
    : theme.shadows[1],
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const FeatureItem = ({ text }) => (
  <ListItem>
    <ListItemIcon>
      <CheckCircleIcon color="success" fontSize="small" />
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

/**
 * SubscriptionPlans Component
 * 
 * @param {Object} props
 * @param {Array} props.plans - Array of subscription plan objects
 * @param {string} props.selectedPlan - ID of the currently selected plan
 * @param {Function} props.onSelectPlan - Function to call when a plan is selected
 */
const SubscriptionPlans = ({ plans, selectedPlan, onSelectPlan }) => {
  // If no plans are provided, return null
  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Select a Subscription Plan
      </Typography>
      
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <PlanCard selected={selectedPlan === plan.id}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {plan.name}
                </Typography>
                
                <PriceTypography variant="h4" gutterBottom>
                  ₹{plan.price}
                </PriceTypography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {plan.duration}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  {plan.features && plan.features.map((feature, index) => (
                    <FeatureItem key={index} text={feature} />
                  ))}
                </List>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant={selectedPlan === plan.id ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => onSelectPlan(plan.id)}
                  fullWidth
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardActions>
            </PlanCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubscriptionPlans;