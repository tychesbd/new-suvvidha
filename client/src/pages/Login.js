import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import axios from 'axios';

// Neumorphic UI imports
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Modal,
  // Assuming a simple neumorphic card can be used for service display
} from '../components/neumorphic'; 
import '../neumorphic.css'; // Ensure neumorphic styles are loaded

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  //const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // const handleRememberMeChange = (e) => {
  //   setRememberMe(e.target.checked);
  // };

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordStep(1);
    setForgotPasswordEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  const handleSendOTP = async () => {
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/users/forgot-password', { email: forgotPasswordEmail });
      toast.success(response.data.message);
      setForgotPasswordStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/users/verify-otp', { email: forgotPasswordEmail, otp });
      toast.success(response.data.message);
      setForgotPasswordStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/users/reset-password', { 
        email: forgotPasswordEmail, 
        newPassword 
      });
      toast.success(response.data.message);
      setForgotPasswordOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Right Panel: Login Form */}
        <Grid item xs={12} md={12}     sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <Link to="/">
                <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '60px', marginBottom: '16px', display: { xs: 'block', md: 'none' }, cursor: 'pointer' }} />
              </Link>
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
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Typography>
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

      {/* Forgot Password Modal */}
      <Modal
        open={forgotPasswordOpen}
        onClose={handleCloseForgotPassword}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          variant="convex"
          style={{
            padding: '32px',
            width: '90%',
            maxWidth: '450px',
            margin: 'auto',
            outline: 'none',
          }}
        >
          <Typography variant="h5" style={{ marginBottom: '24px', textAlign: 'center' }}>
            {forgotPasswordStep === 1 && 'Forgot Password'}
            {forgotPasswordStep === 2 && 'Verify OTP'}
            {forgotPasswordStep === 3 && 'Reset Password'}
          </Typography>

          {forgotPasswordStep === 1 && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="forgotPasswordEmail"
                label="Email Address"
                name="forgotPasswordEmail"
                autoComplete="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSendOTP}
                disabled={isSubmitting}
                style={{ marginTop: '16px' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </>
          )}

          {forgotPasswordStep === 2 && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleVerifyOTP}
                disabled={isSubmitting}
                style={{ marginTop: '16px' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
            </>
          )}

          {forgotPasswordStep === 3 && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                disabled={isSubmitting}
                style={{ marginTop: '16px' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </>
          )}

          <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Button onClick={handleCloseForgotPassword} color="secondary">
              Cancel
            </Button>
          </Box>
        </Card>
      </Modal>
    </Container>
  );
};

export default Login;
