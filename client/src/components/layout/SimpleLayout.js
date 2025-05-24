import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import useMediaQuery from '../../hooks/useMediaQuery';

// Neumorphic components
import Box from '../neumorphic/Box';
import Button from '../neumorphic/Button';
import Container from '../neumorphic/Container';
import Paper from '../neumorphic/Paper';

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import MenuIcon from '@mui/icons-material/Menu';

const SimpleLayout = ({ children }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const userRole = userInfo?.role || 'guest';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    navigate(`/${userRole}/profile`);
    setShowUserMenu(false);
  };
  const handleDashboardClick = () => {
    navigate(userRole === 'admin' ? '/admin' : 
            userRole === 'vendor' ? '/vendor' : 
            userRole === 'customer' ? '/customer' : '/');
    setShowUserMenu(false);
  };
  // Navigation links
  const navLinks = [
    { to: userInfo ? `/${userRole}` : '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/services', label: 'Services', icon: <MiscellaneousServicesIcon /> },
    { to: '/about', label: 'About Us', icon: <InfoIcon /> },
  ];

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}      <Paper
        variant="flat"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile ? '0.5rem' : '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '60px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {/* Logo and mobile menu button */}
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <Button
              variant="text"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{ marginRight: '1rem' }}
            >
              <MenuIcon />
            </Button>
          )}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="/logo1.png" alt="Suvvidha Logo" height="40" />
          </Link>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box style={{ display: 'flex', gap: '1rem' }}>
            {navLinks.map((link) => (              <Button
                key={link.to}
                onClick={() => navigate(link.to)}
                variant={location.pathname === link.to ? 'primary' : 'text'}
                startIcon={link.icon}
                style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span style={{ color: 'var(--text-primary)' }}>{link.label}</span>
              </Button>
            ))}
          </Box>
        )}        {/* Auth Buttons */}
        <Box style={{ 
          display: 'flex', 
          gap: isMobile ? '0.5rem' : '1rem', 
          alignItems: 'center',
          flexWrap: isMobile ? 'nowrap' : 'wrap'
        }}>
          {userInfo ? (
            <Box style={{ position: 'relative' }}>
              <Button
                variant="text"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ padding: '0.5rem' }}
              >
                <AccountCircleIcon />
              </Button>
              {showUserMenu && (
                <Paper
                  variant="flat"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    minWidth: '200px',
                    padding: '0.5rem'
                  }}
                >                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleDashboardClick}
                    startIcon={<DashboardIcon />}
                    style={{ 
                      justifyContent: 'flex-start', 
                      marginBottom: '0.5rem',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Dashboard</span>
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleProfileClick}
                    startIcon={<AccountCircleIcon />}
                    style={{ 
                      justifyContent: 'flex-start', 
                      marginBottom: '0.5rem',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Profile</span>
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    style={{ 
                      justifyContent: 'flex-start',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Logout</span>
                  </Button>
                </Paper>
              )}
            </Box>          ) : (
            <Box style={{
              display: 'flex',
              gap: isMobile ? '0.5rem' : '1rem',
              alignItems: 'center'
            }}>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                style={{ 
                  color: 'inherit', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minWidth: isMobile ? 'auto' : undefined
                }}
              >
                <span style={{ color: 'var(--text-primary)' }}>{isMobile ? 'Log in' : 'Login'}</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                style={{ 
                  color: 'inherit', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minWidth: isMobile ? 'auto' : undefined
                }}
              >
                <span style={{ color: 'var(--text-primary)' }}>Register</span>
              </Button>
            </Box>
          )}
        </Box>
      </Paper>      {/* Mobile Menu */}
      {isMobile && (
        <Paper
          variant="flat"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            zIndex: 99,
            padding: '0.5rem',
            transform: showMobileMenu ? 'translateY(0)' : 'translateY(-100%)',
            opacity: showMobileMenu ? 1 : 0,
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxHeight: showMobileMenu ? 'calc(100vh - 60px)' : '0',
            overflow: 'auto'
          }}
        >
          {navLinks.map((link) => (            <Button
              key={link.to}
              variant={location.pathname === link.to ? 'primary' : 'text'}
              fullWidth
              startIcon={link.icon}
              style={{ 
                marginBottom: '0.5rem', 
                color: 'inherit', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem'
              }}
              onClick={() => {
                navigate(link.to);
                setShowMobileMenu(false);
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>{link.label}</span>
            </Button>
          ))}
        </Paper>
      )}      {/* Main Content */}      <Box style={{ 
        paddingTop: '60px', 
        minHeight: 'calc(100vh - 60px)',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Container style={{
          padding: isMobile ? '1rem' : '2rem',
          width: '100%',
          maxWidth: '100%',
          flex: 1
        }}>
          {children}
        </Container>

        {/* Neumorphic Footer */}
        <Paper
          variant="flat"
          style={{
            padding: isMobile ? '2rem 1rem' : '3rem 2rem',
            marginTop: 'auto',
            backgroundColor: 'var(--background)',
            width: '100%'
          }}
        >
          <Container>
            <Box style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '2rem' : '3rem'
            }}>
              {/* About Section */}
              <Box>
                <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '40px', marginBottom: '1rem' }} />
                <Box style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Your one-stop solution for all your service needs. We provide high-quality services at affordable prices.
                </Box>
              </Box>

              {/* Quick Links */}
              <Box>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Links</h3>
                <Box style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5rem' 
                }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/')}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Home</span>
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => navigate('/services')}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Services</span>
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => navigate('/about')}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>About Us</span>
                  </Button>
                </Box>
              </Box>

              {/* Services */}
              <Box>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Our Services</h3>
                <Box style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <Button
                    variant="text"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Home Cleaning</span>
                  </Button>
                  <Button
                    variant="text"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Electrical Services</span>
                  </Button>
                  <Button
                    variant="text"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Plumbing</span>
                  </Button>
                </Box>
              </Box>

              {/* Contact Info */}
              <Box>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Contact Us</h3>
                <Box style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  <div>Email: info@suvvidha.com</div>
                  <div>Phone: +91 9731146047</div>
                  <div>Location: Bangalore, Karnataka, India</div>
                </Box>
              </Box>
            </Box>

            {/* Copyright Section */}
            <Paper
              variant="flat"
              style={{
                marginTop: isMobile ? '2rem' : '3rem',
                padding: '1rem',
                textAlign: 'center',
                color: 'var(--text-primary)'
              }}
            >
              © {new Date().getFullYear()} Suvvidha & Shiv Bijay Deep. All rights reserved.
            </Paper>
          </Container>
        </Paper>
      </Box>
    </Box>
  );
};

export default SimpleLayout;