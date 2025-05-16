import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import indianFlag from './indianflag.jpg';

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
} from '@mui/material';
import HandymanIcon from '@mui/icons-material/Handyman';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import PestControlIcon from '@mui/icons-material/PestControl';
import HouseIcon from '@mui/icons-material/House';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });

  const { name, email, password, confirmPassword, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || userInfo) {
      // Redirect to home page after successful registration
      navigate('/');
    }

    dispatch(reset());
  }, [userInfo, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
        role,
      };

      dispatch(register(userData));
    }
  };

  // Service icons with animation
  const services = [
    { icon: <HandymanIcon sx={{ fontSize: 40 }} />, name: "Maintenance" },
    { icon: <LocalLaundryServiceIcon sx={{ fontSize: 40 }} />, name: "Laundry" },
    { icon: <PestControlIcon sx={{ fontSize: 40 }} />, name: "Pest Control" },
    { icon: <HouseIcon sx={{ fontSize: 40 }} />, name: "Home Care" },
  ];

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={2} sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${indianFlag})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              color: 'white',
              width: '100%',
            }}
          >
            <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '80px', marginBottom: '20px' }} />
            <Typography variant="h3" component="h1" gutterBottom>
              Join Suvvidha Today
            </Typography>
            <Typography variant="h6" gutterBottom>
              Register for Quality Home Services at Your Fingertips
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
              {services.map((service, index) => (
                <Fade in={true} style={{ transitionDelay: `${index * 300}ms` }} key={index}>
                  <Card sx={{ 
                    width: 120, 
                    height: 120, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}>
                    <CardContent>
                      <Box sx={{ color: 'secondary.main' }}>{service.icon}</Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>{service.name}</Typography>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '60px', marginBottom: '16px' }} />
            <Typography component="h1" variant="h5" gutterBottom>
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Join thousands of satisfied customers using our services
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoFocus
                    value={name}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={role}
                      label="Role"
                      onChange={onChange}
                    >
                      <MenuItem value="customer">Customer</MenuItem>
                      {/* <MenuItem value="vendor">Vendor</MenuItem> */}
                      {/* <MenuItem value="admin">Admin</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;