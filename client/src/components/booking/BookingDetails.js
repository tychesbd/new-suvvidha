import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  Rating,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

// Styled components
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

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ color: 'primary.main', mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);



const BookingDetails = ({ bookingId }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignVendorDialogOpen, setAssignVendorDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [vendorFilters, setVendorFilters] = useState({
    pincode: '',
    minRating: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (!userInfo || !userInfo.token) {
          setError('You must be logged in to view booking details');
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        const response = await axios.get(`/api/bookings/${bookingId}`, config);
        setBooking(response.data);
        setNewStatus(response.data.status);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch booking details');
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);
  
  // Fetch vendors when assign vendor dialog opens
  const fetchVendors = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo || !userInfo.token) {
        setError('You must be logged in to view vendors');
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      setLoading(true);
      
      // Get customer pincode from booking for filtering vendors
      const pincode = booking.customer.pincode;
      
      // Fetch vendors from the API with pincode filter if available
      const response = await axios.get(
        `/api/users/vendors${pincode ? `?pincode=${pincode}` : ''}`,
        config
      );
      
      // Use all vendors from the API response instead of filtering
      console.log('Vendors API response:', response.data);
      setVendors(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError(error.response?.data?.message || 'Failed to fetch vendors');
      setLoading(false);
    }
  };

  // Handle status change dialog open
  const handleStatusChangeClick = () => {
    setNewStatus(booking.status);
    setStatusNote('');
    setStatusDialogOpen(true);
  };

  // Handle status dialog close
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    
    setLoading(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo || !userInfo.token) {
        setError('You must be logged in to update booking status');
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const response = await axios.put(
        `/api/bookings/${booking._id}/status`,
        { status: newStatus, statusNote },
        config
      );
      
      setBooking(response.data);
      setLoading(false);
      setStatusDialogOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update booking status');
      setLoading(false);
    }
  };

  // Handle assign vendor dialog open
  const handleAssignVendorClick = () => {
    setSelectedVendor(null);
    setVendorSearchQuery('');
    setVendorFilters({
      pincode: '',
      minRating: 0
    });
    setAssignVendorDialogOpen(true);
    fetchVendors();
  };

  // Handle assign vendor dialog close
  const handleAssignVendorDialogClose = () => {
    setAssignVendorDialogOpen(false);
  };

  // Handle vendor selection
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
  };

  // Handle vendor assignment
  const handleAssignVendor = async () => {
    if (!selectedVendor) return;
    
    setLoading(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo || !userInfo.token) {
        setError('You must be logged in to assign a vendor');
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const response = await axios.put(
        `/api/bookings/${booking._id}/assign`,
        { vendorId: selectedVendor._id },
        config
      );
      
      setBooking(response.data);
      setLoading(false);
      setAssignVendorDialogOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign vendor');
      setLoading(false);
    }
  };

  // Handle vendor search
  const handleVendorSearch = (e) => {
    setVendorSearchQuery(e.target.value);
  };

  // Handle filter dialog open
  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  };

  // Handle filter dialog close
  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    // In a real application, this would filter vendors from the API
    setFilterDialogOpen(false);
  };

  // Filter vendors based on search query and filters
  const filteredVendors = vendors.filter(vendor => {
    // Skip invalid vendor objects
    if (!vendor || typeof vendor !== 'object') {
      console.warn('Invalid vendor object found:', vendor);
      return false;
    }
    
    const matchesSearch = vendor.name?.toLowerCase().includes(vendorSearchQuery.toLowerCase()) || false;
    const matchesPincode = !vendorFilters.pincode || vendor.pincode === vendorFilters.pincode;
    const matchesRating = vendor.rating >= vendorFilters.minRating;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && vendor.isActive) || 
      (statusFilter === 'blocked' && !vendor.isActive);
    
    return matchesSearch && matchesPincode && matchesRating && matchesStatus;
  });
  
  // Log filtered vendors for debugging
  console.log('Filtered vendors:', filteredVendors.length, 'out of', vendors.length);
  
  // Sort vendors: active first, then by rating
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    // First sort by active status
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1; // Active vendors first
    }
    // Then sort by rating
    return b.rating - a.rating;
  });

  // Render loading state
  if (loading && !booking) {
    return (
      <Paper elevation={2} sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} sx={{ mr: 2 }} />
        <Typography variant="body1">Loading booking details...</Typography>
      </Paper>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }
  
  // Render if booking not found
  if (!booking) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Booking not found or you don't have permission to view it.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Booking Details</Typography>
          <StatusChip 
            label={booking.status} 
            status={booking.status} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Booking Information</Typography>
            
            <InfoItem 
              icon={<CalendarTodayIcon />}
              label="Booking ID"
              value={booking._id}
            />
            
            <InfoItem 
              icon={<MiscellaneousServicesIcon />}
              label="Service"
              value={booking.serviceName}
            />
            
            <InfoItem 
              icon={<AccessTimeIcon />}
              label="Date & Time"
              value={new Date(booking.dateTime).toLocaleString()}
            />
            
            <InfoItem 
              icon={<CalendarTodayIcon />}
              label="Created On"
              value={new Date(booking.createdAt).toLocaleString()}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            
            <InfoItem 
              icon={<PersonIcon />}
              label="Name"
              value={booking.customer.name}
            />
            
            <InfoItem 
              icon={<PhoneIcon />}
              label="Phone"
              value={booking.customer.phoneNumber}
            />
            
            <InfoItem 
              icon={<LocationOnIcon />}
              label="Pincode"
              value={booking.customer.pincode}
            />
            
            <InfoItem 
              icon={<LocationOnIcon />}
              label="Location"
              value={booking.customer.location}
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {booking.vendor ? (
          <Box>
            <Typography variant="h6" gutterBottom>Assigned Vendor</Typography>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {booking.vendor && booking.vendor.name ? booking.vendor.name.charAt(0) : 'V'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{booking.vendor.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={booking.vendor.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({booking.vendor.reviews} reviews)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAssignVendorClick}
              disabled={booking.status !== 'pending'}
            >
              Assign Vendor
            </Button>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleStatusChangeClick}
          >
            Change Status
          </Button>
          
          {!booking.vendor && booking.status === 'pending' && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAssignVendorClick}
            >
              Assign Vendor
            </Button>
          )}
        </Box>
      </Paper>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Booking Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Notes (Optional)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            color="primary" 
            variant="contained"
            disabled={!newStatus || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Processing...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Vendor Dialog */}
      <Dialog 
        open={assignVendorDialogOpen} 
        onClose={handleAssignVendorDialogClose} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Assign Vendor</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Booking: {booking.id} - {booking.serviceName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: {booking.customer.name} | Location: {booking.customer.pincode}
            </Typography>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Search vendors by name"
                value={vendorSearchQuery}
                onChange={handleVendorSearch}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={handleFilterDialogOpen}
                fullWidth
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              Available Vendors ({filteredVendors.length})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filteredVendors.filter(v => v && v.isActive).length} active, {filteredVendors.filter(v => v && !v.isActive).length} blocked
            </Typography>
          </Box>
          
          {sortedVendors.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 3 }}>
              No vendors found matching your criteria.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {sortedVendors.map((vendor) => (
                <Grid item xs={12} sm={6} key={vendor._id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedVendor?._id === vendor._id ? '2px solid' : '1px solid',
                      borderColor: selectedVendor?._id === vendor._id ? 'primary.main' : 'divider',
                    }}
                    onClick={() => handleVendorSelect(vendor)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            {vendor && vendor.name ? vendor.name.charAt(0) : 'V'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">{vendor.name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={vendor.rating} precision={0.1} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                ({vendor.reviews} reviews)
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {selectedVendor?._id === vendor._id && (
                          <CheckCircleIcon color="primary" />
                        )}
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Pincode: {vendor.pincode}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={vendor.isActive ? 'Active' : 'Blocked'}
                            color={vendor.isActive ? 'success' : 'error'}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Distance: {vendor.distance}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignVendorDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleAssignVendor} 
            color="primary" 
            variant="contained"
            disabled={!selectedVendor || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Processing...
              </>
            ) : (
              'Assign Vendor'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={handleFilterDialogClose}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filter Vendors</Typography>
            <IconButton onClick={handleFilterDialogClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Pincode"
            value={vendorFilters.pincode}
            onChange={(e) => setVendorFilters({ ...vendorFilters, pincode: e.target.value })}
            fullWidth
            margin="normal"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Minimum Rating
            </Typography>
            <Rating
              value={vendorFilters.minRating}
              onChange={(event, newValue) => {
                setVendorFilters({ ...vendorFilters, minRating: newValue });
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setVendorFilters({
                pincode: '',
                minRating: 0
              });
              setStatusFilter('all');
            }} 
            color="inherit"
          >
            Clear All
          </Button>
          <Button 
            onClick={handleApplyFilters} 
            color="primary" 
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingDetails;