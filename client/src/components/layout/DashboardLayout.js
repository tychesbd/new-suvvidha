import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import NotificationIcon from '../notifications/NotificationIcon';

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
          <img src="/logo1.png" alt="Suvvidha Logo" height="40" />
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
                  bgcolor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  borderLeft: isActive ? '4px solid' : 'none',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  pl: isActive ? 1.5 : 2
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: isActive ? 'primary.main' : 'inherit' }} />
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
            {/* Title removed as requested */}
          </Box>
          
          {/* Navbar Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              to={`/${userInfo?.role || 'guest'}/home`}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userInfo?.role || 'guest'}/home`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              component={Link}
              to={`/${userInfo?.role || 'guest'}/services`}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userInfo?.role || 'guest'}/services`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<MiscellaneousServicesIcon />}
            >
              Services
            </Button>
            <Button
              component={Link}
              to={`/${userInfo?.role || 'guest'}/about`}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom: location.pathname.includes(`/${userInfo?.role || 'guest'}/about`) ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '4px'
              }}
              startIcon={<InfoIcon />}
            >
              About Us
            </Button>
          </Box>
          {/* Notification Icon */}
          <Box sx={{ flexGrow: 0, mr: 2 }}>
            <NotificationIcon />
          </Box>
          
          <Box sx={{ flexGrow: 0 }}>
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
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleDashboardClick}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Dashboard</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
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