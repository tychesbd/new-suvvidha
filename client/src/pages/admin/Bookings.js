import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogContent,
  Divider,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

// Import booking components
import BookingDetails from '../../components/booking/BookingDetails';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;
  
  if (status === 'completed') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === 'cancelled') {
    color = theme.palette.error.main;
    backgroundColor = theme.palette.error.light;
  } else if (status === 'in-progress') {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning.light;
  } else if (status === 'pending') {
    color = theme.palette.info.main;
    backgroundColor = theme.palette.info.light;
  }
  
  return {
    color: color,
    backgroundColor: backgroundColor,
    fontWeight: 'bold',
    '& .MuiChip-label': {
      textTransform: 'capitalize',
    },
  };
});



const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  
  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (!userInfo || !userInfo.token || userInfo.role !== 'admin') {
          setError('You must be logged in as an admin to view bookings');
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // Make API request to get admin bookings
        console.log('Making API request with token:', userInfo.token.substring(0, 10) + '...');
        console.log('User role:', userInfo.role);
        
        // Add timestamp to prevent caching issues
        const timestamp = new Date().getTime();
        const response = await axios.get(`/api/bookings/admin?t=${timestamp}`, config);
        
        // Process the response data
        console.log('Admin bookings API response:', response.data);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.data) {
          console.error('No data received from API');
          setError('No booking data received from server');
          setLoading(false);
          return;
        }
        
        // Ensure we're working with an array
        const bookingsData = Array.isArray(response.data) ? response.data : [];
        console.log('Processed bookings:', bookingsData.length, 'bookings loaded');
        
        // Log each booking for debugging
        bookingsData.forEach((booking, index) => {
          console.log(`Booking ${index + 1}:`, {
            id: booking._id,
            customer: booking.customer ? booking.customer.name : 'N/A',
            service: booking.serviceName,
            status: booking.status
          });
        });
        
        if (bookingsData.length === 0) {
          console.log('No bookings found in the response data');
          // Don't set error, just show empty state
        }
        
        // Set the bookings state
        setBookings(bookingsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin bookings:', error);
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          
          if (error.response.status === 401) {
            setError('Authentication error: You may not have admin privileges or your session has expired');
          } else {
            setError(error.response.data?.message || `Server error: ${error.response.status}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
          setError('Network error: No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
          setError(`Request setup error: ${error.message}`);
        }
        
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle view details
  const handleViewDetails = (bookingId) => {
    if (!bookingId) {
      console.error('Invalid booking ID');
      return;
    }
    setSelectedBookingId(bookingId);
    setDetailsDialogOpen(true);
  };

  // Handle details dialog close
  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
  };

  // Filter bookings based on search query and active tab
  const filteredBookings = bookings.filter(booking => {
    // Skip invalid booking objects
    if (!booking || typeof booking !== 'object') {
      return false;
    }

    // Safely access booking properties
    const bookingId = booking._id ? booking._id.toString().toLowerCase() : '';
    const customerName = booking.customer && booking.customer.name ? booking.customer.name.toLowerCase() : '';
    const serviceNameLower = booking.serviceName ? booking.serviceName.toLowerCase() : '';
    const pincode = booking.customer && booking.customer.pincode ? booking.customer.pincode : '';
    const searchQueryLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      bookingId.includes(searchQueryLower) ||
      customerName.includes(searchQueryLower) ||
      serviceNameLower.includes(searchQueryLower) ||
      pincode.includes(searchQuery);
    
    const bookingStatus = booking.status || 'pending';
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && bookingStatus === 'pending') ||
      (activeTab === 'in-progress' && bookingStatus === 'in-progress') ||
      (activeTab === 'completed' && bookingStatus === 'completed') ||
      (activeTab === 'cancelled' && bookingStatus === 'cancelled');
    
    return matchesSearch && matchesTab;
  });
  
  console.log('Filtered bookings:', filteredBookings.length, 'out of', bookings.length);
  
  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading bookings...</Typography>
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage all customer bookings and assign vendors
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            placeholder="Search by ID, customer, service or pincode"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Bookings" value="all" />
          <Tab label="Pending" value="pending" />
          <Tab label="In Progress" value="in-progress" />
          <Tab label="Completed" value="completed" />
          <Tab label="Cancelled" value="cancelled" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Booking ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell>Date & Time</StyledTableCell>
              <StyledTableCell>Pincode</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking._id} hover>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.customer && booking.customer.name ? booking.customer.name : 'N/A'}</TableCell>
                  <TableCell>{booking.serviceName || 'N/A'}</TableCell>
                  <TableCell>{booking.dateTime ? new Date(booking.dateTime).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>{booking.customer && booking.customer.pincode ? booking.customer.pincode : 'N/A'}</TableCell>
                  <TableCell>
                    <StatusChip 
                      label={booking.status || 'pending'} 
                      status={booking.status || 'pending'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleViewDetails(booking._id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                    No bookings found matching your criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={handleDetailsDialogClose} 
        maxWidth="md" 
        fullWidth
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDetailsDialogClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          {selectedBookingId && (
            <BookingDetails bookingId={selectedBookingId} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Bookings;