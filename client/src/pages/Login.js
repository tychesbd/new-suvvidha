import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';

// Neumorphic UI imports
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
  // Assuming a simple neumorphic card can be used for service display
} from '../components/neumorphic'; 
import '../neumorphic.css'; // Ensure neumorphic styles are loaded

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || userInfo) {
      navigate(redirect);
    }

    dispatch(reset());
  }, [userInfo, isError, isSuccess, message, navigate, dispatch, redirect]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    // Include rememberMe logic if needed for backend
    dispatch(login(userData));
  };

  const categories = [
    { name: "Home Maintanance" },
    { name: "Cleaning" },
    { name: "Appliances Repair" },
    { name: "Plumbing" },
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
              Welcome to Suvvidha
            </Typography>
            <Typography variant="h6" style={{ marginBottom: '32px' }}>
              Your One-Stop Solution for All Services
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {categories.map((categories, index) => (
                <Grid item key={index} xs={6} sm={4} md={3}>
                  <Card 
                    variant="convex" 
                    style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)', // Light neumorphic card on dark bg
                      backdropFilter: 'blur(5px)',
                      color: 'white',
                      height: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body1">{categories.name}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Right Panel: Login Form */}
        <Grid item xs={12} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card 
            variant="convex" // or "concave" or "flat" based on your neumorphic Card's API
            style={{ 
              padding: '32px', 
              width: '100%', 
              maxWidth: '450px', 
              margin: 'auto' 
            }}
          >
            <Box style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '60px', marginBottom: '16px', display: { xs: 'block', md: 'none' } }} />
            </Box>
            
            <form onSubmit={onSubmit}>
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
              <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  name="rememberMe"
                  id="rememberMe"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" style={{ marginLeft: '8px', cursor: 'pointer' }}>
                  <Typography variant="body2">Remember me</Typography>
                </label>
              </Box>
              
              <Button 
                type="submit" 
                variant="primary" // Assuming 'primary' is a valid neumorphic button style
                fullWidth 
                disabled={isLoading}
                style={{ marginBottom: '24px', minHeight: '44px' }}
              >
                {isLoading ? <CircularProgress size="small" /> : 'Sign In'}
              </Button>
            </form>
            
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                style={{ 
                  color: 'inherit', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minWidth: 'auto'
                }}
              >
                <span style={{ color: 'var(--text-primary)' }}>Register</span>
              </Button>
              </Grid>
              <Grid item>
                 <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="small"> {/* Assuming 'secondary' is a style */}
                        Return to Home
                    </Button>
                 </Link>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
