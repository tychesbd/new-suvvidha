import React, { useState, useEffect, useCallback } from 'react';
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
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSelector } from 'react-redux';
import SubscriptionPlans from '../../components/subscription/SubscriptionPlans';

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

// FeatureItem component removed as it's not being used

const SubscriptionManagement = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const paymentInfo = {
    upiId: 'suvvidha@upi',
    accountName: 'Suvvidha Services',
    bankName: 'State Bank of India'
  };
  const [paymentProof, setPaymentProof] = useState({
    screenshot: null,
    transactionId: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  // Fetch vendor subscription
  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/subscriptions/vendor', config);
      setSubscription(data);
      setError(null);
    } catch (err) {
      // If it's a 404 error, it means the vendor has no subscription yet
      // This is not an error condition, just set subscription to null
      if (err.response && err.response.status === 404) {
        console.log('No subscription found - this is expected for new vendors');
        setSubscription(null);
        setError(null);
      } else {
        // For other errors, display the error message
        console.error('Error fetching subscription:', err);
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      }
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  // Fetch subscription plans
  const fetchPlans = useCallback(async () => {
    try {
      // Don't set loading to true here, as it might interfere with other loading operations
      // Use the correct endpoint for subscription plans
      const { data } = await axios.get('/api/subscription-plans');
      console.log('Fetched plans data:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        // Format plans data to match what SubscriptionPlans component expects
        const formattedPlans = data.map(plan => ({
          id: plan._id,
          name: plan.name,
          price: plan.price,
          duration: `${plan.validityPeriod} days`,
          features: [
            `${plan.bookingLimit} bookings allowed`,
            ...(plan.features || [])
          ]
        }));
        setPlans(formattedPlans);
        console.log('Formatted plans:', formattedPlans);
      } else {
        console.warn('No subscription plans returned from API');
        setPlans([]);
        setError('No subscription plans are currently available. Please try again later or contact support.');
      }
      return data;
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load subscription plans. Please try again later.');
      throw err;
    }
  }, []);

  // Fetch available services
  const fetchServices = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/services');
      setServices(data);
      return data;
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load available services');
      throw err;
    }
  }, []);



  useEffect(() => {
    if (userInfo && userInfo.token) {
      setLoading(true);
      // Fetch subscription data and other resources in parallel
      Promise.all([
        fetchSubscription().catch(err => {
          // If it's a 404, we already handle it in fetchSubscription
          // This prevents the Promise.all from failing completely
          if (err.response && err.response.status === 404) {
            return null;
          }
          throw err;
        }),
        fetchPlans(),
        fetchServices()
      ])
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading resources:', err);
        setLoading(false);
      });
    }
  }, [userInfo, fetchSubscription, fetchPlans, fetchServices]);
  
  // Function to refresh plans
  const refreshPlans = () => {
    setError(null);
    fetchPlans();
  };

  // Handle plan selection
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  // Handle service selection
  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        // Limit to 10 services
        if (prev.length < 10) {
          return [...prev, serviceId];
        }
        return prev;
      }
    });
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, JPG, GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB. Please upload a smaller image.');
        return;
      }
      
      setError(null); // Clear any previous errors
      setPaymentProof(prev => ({
        ...prev,
        screenshot: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.onerror = () => {
        setError('Failed to read the image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle transaction ID input
  const handleTransactionIdChange = (event) => {
    setPaymentProof(prev => ({
      ...prev,
      transactionId: event.target.value
    }));
  };

  // Handle next step
  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0 && plans.length === 0) {
      setError('No subscription plans are available. Please try again later.');
      return;
    }
    
    if (activeStep === 0 && !selectedPlan) {
      setError('Please select a subscription plan to continue.');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle subscription submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null); // Clear any previous errors
      
      // Validate required fields
      if (!selectedPlan) {
        throw new Error('Please select a subscription plan');
      }
      
      if (selectedServices.length === 0) {
        throw new Error('Please select at least one service');
      }
      
      if (!paymentProof.transactionId || !paymentProof.screenshot) {
        throw new Error('Please provide both transaction ID and payment screenshot');
      }
      
      const formData = new FormData();
      formData.append('planId', selectedPlan);
      formData.append('services', JSON.stringify(selectedServices));
      formData.append('transactionId', paymentProof.transactionId);
      if (paymentProof.screenshot) {
        formData.append('screenshot', paymentProof.screenshot);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Log the data being sent for debugging
      console.log('Submitting subscription with data:', {
        planId: selectedPlan,
        services: selectedServices,
        transactionId: paymentProof.transactionId,
        hasScreenshot: !!paymentProof.screenshot
      });
      
      // Verify FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'screenshot' ? 'File data' : pair[1]));
      }
      
      // Make the API call
      const response = await axios.post('/api/subscriptions', formData, config);
      console.log('Subscription submission response:', response.data);
      
      setSuccessMessage('Subscription submitted successfully! It is now pending approval.');
      // Refresh subscription data
      fetchSubscription();
      // Reset form
      setActiveStep(0);
      setSelectedPlan('');
      setSelectedServices([]);
      setPaymentProof({
        screenshot: null,
        transactionId: '',
      });
      setPreviewImage(null);
    } catch (err) {
      console.error('Subscription submission error:', err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message || 'Failed to submit subscription'
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  // Steps for the subscription process
  const steps = ['Select Plan', 'Choose Services', 'Payment Details', 'Upload Proof'];

  // Check if current step is valid
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return plans.length > 0 && selectedPlan !== '';
      case 1:
        return selectedServices.length > 0;
      case 2:
        return true; // Payment details are pre-filled
      case 3:
        // Ensure both screenshot and transaction ID are provided
        return paymentProof.screenshot && 
               paymentProof.transactionId && 
               paymentProof.transactionId.trim() !== '';
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show success message
  if (successMessage) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setSuccessMessage('')}
        >
          Back to Subscription Management
        </Button>
      </Box>
    );
  }

  // Show current subscription if exists
  if (subscription) {
    const daysRemaining = calculateDaysRemaining(subscription.endDate);
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Subscription
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
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
                      <CalendarTodayIcon color="error" sx={{ mr: 1 }} />
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
                      <TimerIcon color="warning" sx={{ mr: 1 }} />
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
                      <EventAvailableIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Bookings Remaining
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {subscription.bookingLimit - (subscription.usedBookings || 0)} of {subscription.bookingLimit}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Allowed Services
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {subscription.services && subscription.services.map((service) => (
                    <Chip 
                      key={service._id} 
                      label={service.name} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                    />
                  ))}
                </Box>
                
                {subscription.status === 'pending' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your subscription is pending approval. You will be notified once it's approved.
                  </Alert>
                )}
                
                {subscription.status === 'denied' && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Your subscription was denied. Please contact support for more information.
                  </Alert>
                )}
                
                {subscription.status === 'expired' && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => {
                        setSubscription(null);
                        setActiveStep(0);
                      }}
                    >
                      Renew Subscription
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Payment Details Card */}
          <Grid item xs={12} md={5}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Payment Details
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Amount Paid
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{subscription.amount}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1">
                    {subscription.transactionId}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(subscription.paymentDate)}
                  </Typography>
                </Box>
                
                {subscription.screenshot && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Payment Screenshot
                    </Typography>
                    <Box 
                      component="img" 
                      src={subscription.screenshot} 
                      alt="Payment Screenshot" 
                      sx={{ 
                        width: '100%', 
                        maxHeight: 200, 
                        objectFit: 'contain',
                        cursor: 'pointer',
                        border: '1px solid #eee',
                        borderRadius: 1
                      }}
                      onClick={() => setImagePreviewOpen(true)}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Image Preview Dialog */}
        <Dialog
          open={imagePreviewOpen}
          onClose={() => setImagePreviewOpen(false)}
          maxWidth="md"
        >
          <DialogContent>
            <Box 
              component="img" 
              src={subscription.screenshot} 
              alt="Payment Screenshot" 
              sx={{ 
                width: '100%', 
                objectFit: 'contain'
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImagePreviewOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // New subscription flow
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Subscribe to a Plan
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          {error.includes('subscription plans') && (
            <Button 
              size="small" 
              sx={{ ml: 2 }} 
              onClick={refreshPlans}
            >
              Retry
            </Button>
          )}
        </Alert>
      )}
      
      {plans.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No subscription plans are currently available. The administrator needs to add plans before you can subscribe.
        </Alert>
      )}
      
      {loading && activeStep === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Loading subscription plans...
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Step content */}
        <Box sx={{ mt: 2, minHeight: 300 }}>
          {/* Display error message specifically for the final step */}
          {activeStep === steps.length - 1 && error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {activeStep === 0 && (
            <Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : plans.length > 0 ? (
                <SubscriptionPlans 
                  plans={plans} 
                  selectedPlan={selectedPlan} 
                  onSelectPlan={handlePlanSelect} 
                />
              ) : (
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No subscription plans available
                  </Typography>
                  <Typography variant="body1" paragraph>
                    The administrator has not added any subscription plans yet. Please try again later or contact support.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={refreshPlans}
                  >
                    Refresh Plans
                  </Button>
                </Paper>
              )}
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Services (Up to 10)
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Selected: {selectedServices.length}/10
              </Typography>
              
              <Grid container spacing={2}>
                {services.map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service._id}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={selectedServices.includes(service._id)}
                          onChange={() => handleServiceToggle(service._id)}
                          disabled={!selectedServices.includes(service._id) && selectedServices.length >= 10}
                        />
                      }
                      label={service.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Please make the payment using the UPI ID below and proceed to the next step to upload the payment proof.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    UPI ID
                  </Typography>
                  <Typography variant="h6">
                    {paymentInfo.upiId}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Account Name
                  </Typography>
                  <Typography variant="h6">
                    {paymentInfo.accountName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bank Name
                  </Typography>
                  <Typography variant="h6">
                    {paymentInfo.bankName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount to Pay
                  </Typography>
                  <Typography variant="h5" color="primary">
                    ₹{plans.find(p => p.id === selectedPlan)?.price || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Upload Payment Proof
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Please upload a screenshot of your payment and enter the transaction ID to complete your subscription.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ mb: 2 }}
                    color={paymentProof.screenshot ? "success" : "primary"}
                  >
                    {paymentProof.screenshot ? "Change Screenshot" : "Upload Screenshot"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  
                  {!paymentProof.screenshot && (
                    <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                      * Required
                    </Typography>
                  )}
                  
                  {previewImage && (
                    <Box sx={{ mt: 2, mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Preview:
                      </Typography>
                      <Box 
                        component="img" 
                        src={previewImage} 
                        alt="Payment Screenshot" 
                        sx={{ 
                          width: '100%', 
                          maxHeight: 200, 
                          objectFit: 'contain',
                          border: '1px solid #eee',
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Transaction ID (URN)"
                    variant="outlined"
                    value={paymentProof.transactionId}
                    onChange={handleTransactionIdChange}
                    helperText="Enter the transaction ID or reference number from your payment"
                    error={activeStep === 3 && !paymentProof.transactionId}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        
        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!isStepValid() || submitting}
              sx={{ minWidth: '180px' }}
            >
              {submitting ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Submitting...
                </>
              ) : (
                'Submit for Approval'
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SubscriptionManagement;