import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';

// Material UI imports
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
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
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import PlumbingIcon from '@mui/icons-material/Plumbing';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

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
      // Redirect to home page after successful login
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

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  // Service icons with animation
  const services = [
    { icon: <HomeRepairServiceIcon sx={{ fontSize: 40 }} />, name: "Home Repair" },
    { icon: <CleaningServicesIcon sx={{ fontSize: 40 }} />, name: "Cleaning" },
    { icon: <ElectricalServicesIcon sx={{ fontSize: 40 }} />, name: "Electrical" },
    { icon: <PlumbingIcon sx={{ fontSize: 40 }} />, name: "Plumbing" },
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
            backgroundImage: 'url(https://source.unsplash.com/random?home-service)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
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
              Welcome to Suvvidha
            </Typography>
            <Typography variant="h6" gutterBottom>
              Your One-Stop Solution for All Home Services
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
                      <Box sx={{ color: 'primary.main' }}>{service.icon}</Box>
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
              Sign in to your account
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Access all your home service needs in one place
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={onChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    {"Don't have an account? Sign Up"}
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

export default Login;
