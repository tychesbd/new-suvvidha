import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
// Removed language imports as per requirements

// Material UI imports
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import MenuIcon from '@mui/icons-material/Menu';

const SimpleLayout = ({ children, title }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Removed language context usage

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleCloseUserMenu();
    // Navigate to profile page based on user role
    if (userInfo && userInfo.role) {
      navigate(`/${userInfo.role}/profile`);
    } else {
      navigate('/login');
    }
  };

  const handleDashboardClick = () => {
    handleCloseUserMenu();
    // Navigate to dashboard based on user role
    if (userInfo && userInfo.role) {
      navigate(`/${userInfo.role}`);
    } else {
      navigate('/login');
    }
  };

  // Check if userInfo exists before accessing properties
  const userRole = userInfo?.role || 'guest';
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Mobile drawer content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2, pb: 2 }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
      <img src="/logo1.png" alt="Suvvidha Logo" height="40" sx={{ my: 2 }} /> </Link>
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to={userInfo ? `/${userRole}/home` : '/'}
            sx={{
              textAlign: 'center',
              borderBottom: location.pathname === '/' || location.pathname.includes(`/${userRole}/home`) ? '2px solid white' : 'none',
            }}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to={userInfo ? `/${userRole}/services` : '/'}
            sx={{
              textAlign: 'center',
              borderBottom: location.pathname.includes(`/${userRole}/services`) ? '2px solid #ad6fa9' : 'none',
            }}
          >
            <ListItemText primary="Services" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to={userInfo ? `/${userRole}/about` : '/'}
            sx={{
              textAlign: 'center',
              borderBottom: location.pathname.includes(`/${userRole}/about`) ? '2px solid #ad6fa9' : 'none',
            }}
          >
            <ListItemText primary="About Us" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <AppBar position="fixed" sx={{ backgroundColor: '#ad6fa9' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: 3 }}>
            <Link to={'/'}>
              <img src="/logo1.png" alt="Suvvidha Logo" height="40" />
            </Link>
            {/* Title removed as requested */}
          </Box>
          
          {/* Navbar Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              to={userInfo ? `/${userRole}/home` : '/'}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname === '/' || location.pathname.includes(`/${userRole}/home`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              component={Link}
              to={userInfo ? `/${userRole}/services` : '/'}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userRole}/services`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<MiscellaneousServicesIcon />}
            >
              Services
            </Button>
            <Button
              component={Link}
              to={userInfo ? `/${userRole}/about` : '/'}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userRole}/about`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<InfoIcon />}
            >
              About Us
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* Added Become a Vendor button */}
            {!userInfo && (
              <Button
                component={Link}
                to="/vendor-register"
                variant="contained"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#6a1b9a', 
                  '&:hover': { bgcolor: '#f5f5f5' },
                  mr: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 10px rgba(106, 27, 154, 0.2)'
                }}
              >
                Become a Vendor
              </Button>
            )}
            
            {userInfo ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0, 
                      ml: 2,
                      border: '2px solid #f0f0f0',
                      '&:hover': { backgroundColor: 'rgba(106, 27, 154, 0.04)' }
                    }}
                  >
                    <Avatar 
                      alt={userInfo.name} 
                      src="/static/images/avatar/2.jpg" 
                      sx={{ width: 38, height: 38 }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ 
                    mt: '45px',
                    '& .MuiPaper-root': {
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      minWidth: '200px'
                    }
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleDashboardClick} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" sx={{ color: '#6a1b9a' }} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 500 }} />
                  </MenuItem>
                  <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" sx={{ color: '#6a1b9a' }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 500 }} />
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: '#ff6f00' }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{ 
                    color: '#6a1b9a', 
                    borderColor: '#6a1b9a',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#6a1b9a',
                      backgroundColor: 'rgba(106, 27, 154, 0.04)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{ 
                    bgcolor: '#6a1b9a', 
                    color: 'white', 
                    fontWeight: 600,
                    boxShadow: '0 4px 10px rgba(106, 27, 154, 0.2)',
                    '&:hover': { 
                      bgcolor: '#5c1786',
                      boxShadow: '0 6px 12px rgba(106, 27, 154, 0.25)'
                    } 
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default SimpleLayout;