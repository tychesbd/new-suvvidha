import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import indianFlag from './indianflag.jpg';

// Neumorphic UI imports
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  Select, // Assuming Select takes options prop or similar
  Typography,
  Box,
  CircularProgress,
} from '../components/neumorphic';
import '../neumorphic.css'; // Ensure neumorphic styles are loaded

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Added phone field
    password: '',
    confirmPassword: '',
    role: 'customer', // Default role
  });

  const { name, email, phone, password, confirmPassword, role } = formData;

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
      navigate('/'); // Redirect to home page after successful registration
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
        phone,
        password,
        role,
      };
      dispatch(register(userData));
    }
  };

  const services = [
    { name: "Maintenance" },
    { name: "Laundry" },
    { name: "Pest Control" },
    { name: "Home Care" },
  ];

  const roleOptions = [
    { value: 'customer', label: 'Customer' },
    // { value: 'vendor', label: 'Vendor' }, // Uncomment if needed
    // { value: 'admin', label: 'Admin' },   // Uncomment if needed
  ];

  return (
    <Container style={{ paddingTop: '2rem', paddingBottom: '2rem', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={2} style={{ flexGrow: 1, alignItems: 'stretch' }}>
        {/* Left Panel: Promotional Content */}
        <Grid item xs={12} md={7} style={{ display: { xs: 'none', md: 'flex' }, position: 'relative', borderRadius: '15px', overflow: 'hidden' }}>
          <Box
            style={{
              position: 'relative',
              zIndex: 3,
              textAlign: 'center',
              color: 'white',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '80px', marginBottom: '20px' }} />
            <Typography variant="h3" component="h1" style={{ marginBottom: '16px' }}>
              Join Suvvidha Today
            </Typography>
            <Typography variant="h6" style={{ marginBottom: '32px' }}>
              Register for Quality Services at Your Fingertips
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {services.map((service, index) => (
                <Grid item key={index} xs={6} sm={4} md={3}>
                  <Card 
                    variant="convex" 
                    style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(5px)',
                      color: 'white',
                      height: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body1">{service.name}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Right Panel: Registration Form */}
        <Grid item xs={12} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card 
            variant="convex" 
            style={{ 
              padding: '32px', 
              width: '100%', 
              maxWidth: '480px', // Slightly wider for more fields
              margin: 'auto' 
            }}
          >
            <Box style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '60px', marginBottom: '16px', display: { xs: 'block', md: 'none' } }} />
              <Typography variant="body1" color="textSecondary">
                Get started with Suvvidha
              </Typography>
            </Box>
            
            <form onSubmit={onSubmit}>
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                value={name}
                onChange={onChange}
                required
                autoFocus
                style={{ marginBottom: '20px' }}
                disabled={isLoading}
              />
              <TextField
                label="Email Address"
                name="email"
                type="email"
                fullWidth
                value={email}
                onChange={onChange}
                required
                style={{ marginBottom: '20px' }}
                disabled={isLoading}
                placeholder="Enter your E-mail"
              />
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                fullWidth
                value={phone}
                onChange={onChange}
                required
                style={{ marginBottom: '20px' }}
                disabled={isLoading}
                placeholder="Enter your phone number"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={password}
                onChange={onChange}
                required
                style={{ marginBottom: '20px' }}
                disabled={isLoading}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={onChange}
                required
                style={{ marginBottom: '20px' }}
                disabled={isLoading}
              />
              
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={isLoading}
                style={{ marginBottom: '24px', minHeight: '44px' }}
              >
                {isLoading ? <CircularProgress size="small" /> : 'Sign Up'}
              </Button>
            </form>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
              <Button
                variant="secondary"
                onClick={() => navigate('/login')}
                style={{ 
                  color: 'inherit', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minWidth: 'auto'
                }}
              >
                <span style={{ color: 'var(--text-primary)' }}>Login</span>
              </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;