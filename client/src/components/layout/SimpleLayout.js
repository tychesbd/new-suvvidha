import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../language/LanguageSelector';

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
  const { getTranslation } = useLanguage();

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
            to={`/${userRole}/home`}
            sx={{
              textAlign: 'center',
              borderBottom: location.pathname.includes(`/${userRole}/home`) ? '2px solid #F56227' : 'none',
            }}
          >
            <ListItemText primary={getTranslation('home')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to={`/${userRole}/services`}
            sx={{
              textAlign: 'center',
              borderBottom: location.pathname.includes(`/${userRole}/services`) ? '2px solid #F56227' : 'none',
            }}
          >
            <ListItemText primary={getTranslation('services')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to={`/${userRole}/about`}
            sx={{
              textAlign: 'center',
              borderBottom: location.pathname.includes(`/${userRole}/about`) ? '2px solid #F56227' : 'none',
            }}
          >
            <ListItemText primary={getTranslation('aboutUs')} />
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
      <AppBar position="fixed" sx={{ backgroundColor: '#F56227' }}>
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
            <Link to={`/${userRole}/home`}>
              <img src="/logo1.png" alt="Suvvidha Logo" height="40" />
            </Link>
            {/* Title removed as requested */}
          </Box>
          
          {/* Navbar Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              to={`/${userRole}/home`}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userRole}/home`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<HomeIcon />}
            >
              {getTranslation('home')}
            </Button>
            <Button
              component={Link}
              to={`/${userRole}/services`}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userRole}/services`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<MiscellaneousServicesIcon />}
            >
              {getTranslation('services')}
            </Button>
            <Button
              component={Link}
              to={`/${userRole}/about`}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userRole}/about`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<InfoIcon />}
            >
              {getTranslation('aboutUs')}
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <LanguageSelector />
            {userInfo ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={userInfo?.name} src="/static/images/avatar/2.svg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
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
                  <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={getTranslation('profile')} />
                  </MenuItem>
                  <MenuItem onClick={handleDashboardClick}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={getTranslation('dashboard')} />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={getTranslation('logout')} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 'bold' }}
              >
                {getTranslation('signIn')}
              </Button>
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