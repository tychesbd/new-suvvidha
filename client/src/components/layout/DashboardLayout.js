import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import NotificationIcon from '../notifications/NotificationIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../language/LanguageSelector';

// Material UI imports
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// Removing unused SettingsIcon import
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

const drawerWidth = 240;

const DashboardLayout = ({ children, title, menuItems }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getTranslation } = useLanguage();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // First navigate to login page, then dispatch logout action
    // This prevents errors from trying to access userInfo after it's set to null
    navigate('/login');
    dispatch(logout());
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

  // Create a safe drawer component that handles null userInfo
  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link to={`/${userInfo?.role || 'guest'}/home`}>
            <img src="/logo1.png" alt="Suvvidha Logo" height="40" />
          </Link>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems && menuItems.map((item) => {
          const userRole = userInfo?.role || 'guest';
          const isActive = location.pathname === item.path || 
                         (item.path !== `/${userRole}` && location.pathname.includes(item.path));
          return (
            <ListItem key={item.text} disablePadding onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}>
              <ListItemButton 
                sx={{
                  bgcolor: isActive ? 'rgba(106, 27, 154, 0.08)' : 'transparent',
                  borderLeft: isActive ? '4px solid' : 'none',
                  borderColor: isActive ? '#6a1b9a' : 'transparent',
                  pl: isActive ? 1.5 : 2,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(106, 27, 154, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#6a1b9a' : '#666666', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ color: isActive ? '#6a1b9a' : '#333333' }} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#ffffff',
          color: '#333333',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: 3 }}>
            <Link to={`/${userInfo?.role || 'guest'}/home`}>
              <img src="/logo1.png" alt="Suvvidha Logo" height="40" />
            </Link>
            {/* Title removed as requested */}
          </Box>
          
          {/* Navbar Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              to={`/${userInfo?.role || 'guest'}/home`}
              sx={{
                color: '#333333',
                mx: 1,
                fontWeight: 500,
                fontSize: '1rem',
                borderBottom: location.pathname.includes(`/${userInfo?.role || 'guest'}/home`) ? '2px solid #6a1b9a' : 'none',
                borderRadius: 0,
                paddingBottom: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(106, 27, 154, 0.04)',
                  color: '#6a1b9a'
                }
              }}
              startIcon={<HomeIcon sx={{ color: '#6a1b9a' }} />}
            >
              {getTranslation('home')}
            </Button>
            <Button
              component={Link}
              to={`/${userInfo?.role || 'guest'}/services`}
              sx={{
                color: '#333333',
                mx: 1,
                fontWeight: 500,
                fontSize: '1rem',
                borderBottom: location.pathname.includes(`/${userInfo?.role || 'guest'}/services`) ? '2px solid #6a1b9a' : 'none',
                borderRadius: 0,
                paddingBottom: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(106, 27, 154, 0.04)',
                  color: '#6a1b9a'
                }
              }}
              startIcon={<MiscellaneousServicesIcon sx={{ color: '#6a1b9a' }} />}
            >
              {getTranslation('services')}
            </Button>
            <Button
              component={Link}
              to={`/${userInfo?.role || 'guest'}/about`}
              sx={{
                color: '#333333',
                mx: 1,
                fontWeight: 500,
                fontSize: '1rem',
                borderBottom: location.pathname.includes(`/${userInfo?.role || 'guest'}/about`) ? '2px solid #6a1b9a' : 'none',
                borderRadius: 0,
                paddingBottom: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(106, 27, 154, 0.04)',
                  color: '#6a1b9a'
                }
              }}
              startIcon={<InfoIcon sx={{ color: '#6a1b9a' }} />}
            >
              {getTranslation('aboutUs')}
            </Button>
          </Box>
          
          {/* Notification Icon */}
          <Box sx={{ flexGrow: 0, mr: 2 }}>
            <NotificationIcon sx={{ color: '#6a1b9a' }} />
          </Box>
          
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <LanguageSelector />
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Open settings">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0,
                    border: '2px solid #f0f0f0',
                    '&:hover': { backgroundColor: 'rgba(106, 27, 154, 0.04)' }
                  }}
                >
                  <Avatar 
                    alt={userInfo?.name} 
                    src="/static/images/avatar/2.svg" 
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
                <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" sx={{ color: '#6a1b9a' }} />
                  </ListItemIcon>
                  <Typography textAlign="center" fontWeight={500}>{getTranslation('profile')}</Typography>
                </MenuItem>
                <MenuItem onClick={handleDashboardClick} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" sx={{ color: '#6a1b9a' }} />
                  </ListItemIcon>
                  <Typography textAlign="center" fontWeight={500}>{getTranslation('dashboard')}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: '#ff6f00' }} />
                  </ListItemIcon>
                  <Typography textAlign="center" fontWeight={500}>{getTranslation('logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;