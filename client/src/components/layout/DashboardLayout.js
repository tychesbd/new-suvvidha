import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import useMediaQuery from '../../hooks/useMediaQuery';

// Neumorphic components
import Box from '../neumorphic/Box';
import Button from '../neumorphic/Button';
import Paper from '../neumorphic/Paper';
import Container from '../neumorphic/Container';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const DashboardLayout = ({ children, title, menuItems }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    navigate(`/${userInfo?.role}/profile`);
    setShowUserMenu(false);
  };

  // Sidebar content
  const drawer = (
    <Box style={{ padding: '1rem' }}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path || 
                       (item.path !== `/${userInfo?.role}` && location.pathname.includes(item.path));
        return (          <Button
            key={item.text}
            component={Link}
            to={item.path}
            variant={isActive ? 'primary' : 'text'}
            fullWidth
            startIcon={item.icon}
            style={{ 
              justifyContent: 'flex-start',
              marginBottom: '0.5rem',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative'
            }}
            onClick={() => isMobile && setShowMobileMenu(false)}
          >
            <span style={{ 
              color: isActive ? '#fff' : 'var(--text-primary)', // White text for active (primary bg), dark text for inactive
              fontWeight: isActive ? '500' : 'normal'
            }}>
              {item.text}
            </span>
          </Button>
        );
      })}
    </Box>
  );

  return (
    <Box style={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--background)'
    }}>
      {/* Header */}
      <Paper
        variant="flat"
        style={{
          position: 'fixed',
          top: 0,
          left: isMobile ? 0 : drawerWidth,
          right: 0,
          zIndex: 100,
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {isMobile && (
          <Button
            variant="text"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MenuIcon />
          </Button>
        )}
        
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Link to={`/${userInfo?.role}/home`}>
            <img src="/logo1.png" alt="Suvvidha Logo" height="40" />
          </Link>
        </Box>

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
            >
              <Button
                variant="text"
                fullWidth
                onClick={handleProfileClick}
                startIcon={<AccountCircleIcon />}
                style={{ justifyContent: 'flex-start', marginBottom: '0.5rem' }}
              >
                Profile
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                style={{ justifyContent: 'flex-start' }}
              >
                Logout
              </Button>
            </Paper>
          )}
        </Box>
      </Paper>

      {/* Sidebar */}
      <Paper
        variant="flat"
        style={{
          width: drawerWidth,
          flexShrink: 0,
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          display: isMobile ? 'none' : 'block'
        }}
      >
        {drawer}
      </Paper>

      {/* Mobile Sidebar */}
      {isMobile && showMobileMenu && (
        <Paper
          variant="flat"
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            width: drawerWidth,
            height: 'calc(100vh - 72px)',
            zIndex: 99
          }}
        >
          {drawer}
        </Paper>
      )}

      {/* Main Content */}
      <Box
        style={{
          flexGrow: 1,
          padding: '1rem',
          marginLeft: isMobile ? 0 : drawerWidth,
          marginTop: '72px'
        }}
      >
        <Container>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;