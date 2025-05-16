import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { register, reset } from '../features/auth/authSlice';

// Material UI imports
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Divider,
  OutlinedInput,
  Chip,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')(({ theme }) => ({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    pincode: '',
    yearsOfExperience: 0,
    serviceExpertise: [],
  });

  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword, phone, address, pincode, yearsOfExperience, serviceExpertise } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Fetch available services for the multi-select dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services');
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || userInfo) {
      // Redirect to home page after successful registration
      navigate('/');
      toast.success('Registration successful! Please wait for admin approval.');
    }

    dispatch(reset());
  }, [userInfo, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'serviceExpertise') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  // Handle ID proof document upload
  const handleIdProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdProofFile(file);
      setIdProofPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!idProofFile) {
      toast.error('Please upload an ID proof document');
      setLoading(false);
      return;
    }

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('email', email);
      formDataToSend.append('password', password);
      formDataToSend.append('role', 'vendor');
      formDataToSend.append('phone', phone);
      formDataToSend.append('address', address);
      formDataToSend.append('pincode', pincode);
      formDataToSend.append('yearsOfExperience', yearsOfExperience);
      
      // Append service expertise as comma-separated string
      if (serviceExpertise && serviceExpertise.length > 0) {
        formDataToSend.append('serviceExpertise', serviceExpertise.join(','));
      }
      
      // Append ID proof document
      formDataToSend.append('idProofDocument', idProofFile);
      
      // Register the vendor
      const response = await axios.post('/api/users/vendor-register', formDataToSend);
      
      if (response.data) {
        toast.success('Registration successful! Please wait for admin approval.');
        navigate('/');
      }
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Link to="/">
          <img src="/logo1.png" alt="Suvvidha Logo" height="60" />
        </Link>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Become a Vendor
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Join our platform as a service provider and grow your business
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Benefits of becoming a vendor:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  Access to a large customer base
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Easy booking management
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Flexible subscription plans
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Increased visibility for your services
                </Typography>
                <Typography component="li">
                  Professional profile to showcase your expertise
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Already registered?
              </Typography>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ mt: 2 }}
              >
                Login to your account
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StorefrontIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
              <Typography variant="h5">
                Vendor Registration Form
              </Typography>
            </Box>
            
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Full Name"
                    value={name}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    value={phone}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="pincode"
                    label="Pincode"
                    value={pincode}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    value={address}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="yearsOfExperience"
                    label="Years of Experience"
                    type="number"
                    value={yearsOfExperience}
                    onChange={onChange}
                    fullWidth
                    required
                    margin="normal"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="service-expertise-label">Service Expertise</InputLabel>
                    <Select
                      labelId="service-expertise-label"
                      id="service-expertise"
                      multiple
                      name="serviceExpertise"
                      value={serviceExpertise}
                      onChange={onChange}
                      input={<OutlinedInput label="Service Expertise" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const service = services.find(s => s._id === value || s.name === value);
                            return (
                              <Chip key={value} label={service ? service.name : value} />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {services.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          <Checkbox checked={serviceExpertise.indexOf(service._id) > -1} />
                          <ListItemText primary={service.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ID Proof Document *
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1 }}
                    >
                      Upload ID Proof
                      <VisuallyHiddenInput 
                        type="file" 
                        onChange={handleIdProofUpload} 
                        accept="image/*,.pdf"
                      />
                    </Button>
                    {idProofPreview && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Preview:
                        </Typography>
                        {idProofFile.type.includes('image') ? (
                          <Box
                            component="img"
                            src={idProofPreview}
                            alt="ID Proof Preview"
                            sx={{ maxWidth: '100%', maxHeight: 200 }}
                          />
                        ) : (
                          <Typography variant="body2">
                            {idProofFile.name} (Document uploaded)
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || isLoading}
              >
                {(loading || isLoading) ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                    Registering...
                  </>
                ) : 'Register as Vendor'}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VendorRegister;