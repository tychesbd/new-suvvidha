import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Container,
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
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';

// Components
import SimpleLayout from '../components/layout/SimpleLayout';

const PlanCard = styled(Card)(({ theme, featured }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
  ...(featured && {
    border: `2px solid ${theme.palette.primary.main}`,
    position: 'relative',
    '&::before': {
      content: '"POPULAR"',
      position: 'absolute',
      top: '10px',
      right: '0',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      padding: '4px 12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
    },
  }),
}));

const FeatureItem = ({ text }) => (
  <ListItem>
    <ListItemIcon>
      <CheckCircleIcon color="success" fontSize="small" />
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

const Plans = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/subscriptions/plans');
        setPlans(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to load subscription plans'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!userInfo) {
      navigate('/login?redirect=plans');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Create a subscription
      await axios.post(
        '/api/subscriptions',
        { planId },
        config
      );

      // Redirect to vendor dashboard
      navigate('/vendor');
    } catch (err) {
      console.error('Error subscribing to plan:', err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to subscribe to plan'
      );
    }
  };

  if (loading) {
    return (
      <SimpleLayout title="Subscription Plans">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout title="Subscription Plans">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Choose Your Subscription Plan
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Select the plan that best fits your business needs
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {plans.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No subscription plans available at the moment.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={plan._id || index}>
                <PlanCard elevation={3} featured={index === 1}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" color="primary" gutterBottom>
                      ₹{plan.price}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {plan.validityPeriod} days validity
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" paragraph>
                      {plan.description}
                    </Typography>
                    
                    <List dense>
                      <FeatureItem text={`${plan.bookingLimit} bookings allowed`} />
                      {plan.features && plan.features.map((feature, idx) => (
                        <FeatureItem key={idx} text={feature} />
                      ))}
                    </List>
                  </CardContent>
                  <CardActions>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={() => handleSubscribe(plan._id)}
                    >
                      Subscribe Now
                    </Button>
                  </CardActions>
                </PlanCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </SimpleLayout>
  );
};

export default Plans;