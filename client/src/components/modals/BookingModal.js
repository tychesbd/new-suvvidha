import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const BookingModal = ({ open, onClose, service }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    pincode: '',
    location: '',
    locationType: 'manual' // 'manual' or 'current'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle location type change
  const handleLocationTypeChange = (e) => {
    const locationType = e.target.value;
    setFormData({
      ...formData,
      locationType,
      location: locationType === 'current' ? 'Detecting your location...' : ''
    });
    
    if (locationType === 'current') {
      getCurrentLocation();
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use reverse geocoding to convert coordinates to an address
          const { latitude, longitude } = position.coords;
          
          // Store coordinates for backend processing
          const coordinates = { latitude, longitude };
          
          // Use Nominatim OpenStreetMap API for reverse geocoding (free and doesn't require API key)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              // Format the address from the response
              const address = data.display_name || 
                `${data.address.road || ''}, ${data.address.suburb || ''}, ${data.address.city || ''}`;
              
              setFormData({
                ...formData,
                location: address,
                locationType: 'current',
                coordinates: JSON.stringify(coordinates)
              });
              setLoading(false);
            })
            .catch(error => {
              console.error('Error in reverse geocoding:', error);
              // Fallback to a more user-friendly location format if geocoding fails
              const location = `Near location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              setFormData({
                ...formData,
                location,
                locationType: 'current',
                coordinates: JSON.stringify(coordinates)
              });
              setLoading(false);
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          setSnackbar({
            open: true,
            message: 'Could not detect your location. Please enter manually.',
            severity: 'error'
          });
          setFormData({
            ...formData,
            locationType: 'manual',
            location: ''
          });
          setLoading(false);
        }
      );
    } else {
      setSnackbar({
        open: true,
        message: 'Geolocation is not supported by your browser. Please enter location manually.',
        severity: 'error'
      });
      setFormData({
        ...formData,
        locationType: 'manual',
        location: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    if (formData.locationType === 'manual' && !formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Get token from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (!userInfo || !userInfo.token) {
          setSnackbar({
            open: true,
            message: 'You must be logged in to book a service',
            severity: 'error'
          });
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // Prepare booking data
        const bookingData = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          pincode: formData.pincode,
          location: formData.location,
          coordinates: formData.coordinates,
          serviceId: service._id,
        };
        
        // Make API call to create booking
        const response = await axios.post('/api/bookings', bookingData, config);
        
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Booking submitted successfully!',
          severity: 'success'
        });
        
        // Reset form and close modal after a delay
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1500);
      } catch (error) {
        setLoading(false);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to create booking. Please try again.',
          severity: 'error'
        });
      }
    }
  };


  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      pincode: '',
      location: '',
      locationType: 'manual',
      coordinates: null
    });
    setErrors({});
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div">
            Book Service
            {service && (
              <Typography variant="subtitle1" color="text.secondary">
                {service.title || service.name}
              </Typography>
            )}
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Please provide your details to book this service
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              variant="outlined"
              required
            />
            
            <TextField
              fullWidth
              label="Phone Number *"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              margin="normal"
              variant="outlined"
              inputProps={{ maxLength: 10 }}
              required
            />
            
            <TextField
              fullWidth
              label="Pincode *"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              error={!!errors.pincode}
              helperText={errors.pincode}
              margin="normal"
              variant="outlined"
              inputProps={{ maxLength: 6 }}
              required
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Location
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                name="locationType"
                value={formData.locationType}
                onChange={handleLocationTypeChange}
                row
              >
                <FormControlLabel 
                  value="current" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MyLocationIcon color="primary" sx={{ mr: 0.5 }} />
                      <span>Use current location</span>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="manual" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon color="primary" sx={{ mr: 0.5 }} />
                      <span>Enter manually</span>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
            
            {formData.locationType === 'manual' ? (
              <TextField
                fullWidth
                label="Enter your address"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                margin="normal"
                variant="outlined"
                multiline
                rows={2}
              />
            ) : (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography>Detecting your location...</Typography>
                  </Box>
                ) : (
                  <Typography>
                    {formData.location || 'Location will be detected when you select this option'}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              'Book Now'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingModal;