import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledCard = styled(Card)(({ theme, selected }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const SubscriptionPlans = ({ plans, selectedPlan, onSelectPlan }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Select a Subscription Plan
      </Typography>
      
      <RadioGroup
        value={selectedPlan}
        onChange={(e) => onSelectPlan(e.target.value)}
      >
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <FormControlLabel
                value={plan.id}
                control={<Radio sx={{ display: 'none' }} />}
                label=""
                sx={{ m: 0, width: '100%' }}
              >
                <StyledCard 
                  variant="outlined" 
                  selected={selectedPlan === plan.id}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      {plan.name}
                    </Typography>
                    
                    <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                      ₹{plan.price}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Duration: {plan.duration}
                    </Typography>
                    
                    <List dense sx={{ mb: 2 }}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box sx={{ mt: 'auto', textAlign: 'center' }}>
                      <Button 
                        variant={selectedPlan === plan.id ? "contained" : "outlined"}
                        color="primary"
                        fullWidth
                        onClick={() => onSelectPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>
              </FormControlLabel>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </Box>
  );
};

export default SubscriptionPlans;