import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';

// Neumorphic UI imports
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
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

  return (
    <Container style={{ paddingTop: '2rem', paddingBottom: '2rem', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/images/team/login.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Grid container spacing={2} style={{ flexGrow: 1, alignItems: 'stretch' }}>
        {/* Right Panel: Registration Form */}
        <Grid item xs={12} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <Link to="/">
                <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '60px', marginBottom: '16px', display: { xs: 'block', md: 'none' }, cursor: 'pointer' }} />
              </Link>
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
                <Button
                  variant="secondary"
                  onClick={() => navigate('/vendor-register')}
                  style={{
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>Become a Vendor</span>
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