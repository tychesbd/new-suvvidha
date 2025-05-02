import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;
  
  if (status === 'active') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === 'expired') {
    color = theme.palette.error.main;
    backgroundColor = theme.palette.error.light;
  } else if (status === 'pending') {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning.light;
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

const FeatureItem = ({ text }) => (
  <ListItem>
    <ListItemIcon>
      <CheckCircleIcon color="success" fontSize="small" />
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

const VendorSubscriptions = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    plan: '',
    status: '',
    paymentStatus: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  
  // Dialog states
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({ message: '', severity: 'success', show: false });

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/subscriptions/admin', config);
      setSubscriptions(data);
      setFilteredSubscriptions(data);
      setError(null);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchSubscriptions();
    }
  }, [userInfo]);

  // Apply filters
  useEffect(() => {
    let result = [...subscriptions];
    
    if (filters.plan) {
      result = result.filter(sub => sub.planName === filters.plan);
    }
    
    if (filters.status) {
      result = result.filter(sub => sub.status === filters.status);
    }
    
    if (filters.paymentStatus) {
      result = result.filter(sub => sub.paymentStatus === filters.paymentStatus);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(sub => 
        sub.vendor.name.toLowerCase().includes(searchLower) ||
        sub.vendor.email.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredSubscriptions(result);
  }, [filters, subscriptions]);

  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      plan: '',
      status: '',
      paymentStatus: '',
      search: '',
    });
  };

  // Handle view details
  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setDetailsOpen(true);
  };

  // Handle verify payment dialog
  const handleVerifyPayment = (subscription) => {
    setSelectedSubscription(subscription);
    setVerifyDialogOpen(true);
  };

  // Confirm verify payment
  const confirmVerifyPayment = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      await axios.put(
        `/api/subscriptions/admin/${selectedSubscription._id}/verify`, 
        { status: 'active', paymentStatus: 'paid' },
        config
      );
      
      // Update local state
      const updatedSubscriptions = subscriptions.map(sub => {
        if (sub._id === selectedSubscription._id) {
          return {
            ...sub,
            status: 'active',
            paymentStatus: 'paid'
          };
        }
        return sub;
      });
      
      setSubscriptions(updatedSubscriptions);
      setVerifyDialogOpen(false);
      
      // Show success message
      setActionFeedback({
        message: 'Payment verified successfully',
        severity: 'success',
        show: true
      });
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setActionFeedback({ ...actionFeedback, show: false });
      }, 3000);
      
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      
      // Show error message
      setActionFeedback({
        message: 'Failed to verify payment',
        severity: 'error',
        show: true
      });
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setActionFeedback({ ...actionFeedback, show: false });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage vendor subscriptions and payment verifications
      </Typography>
      
      {/* Feedback Alert */}
      {actionFeedback.show && (
        <Alert 
          severity={actionFeedback.severity} 
          sx={{ mb: 2 }}
          onClose={() => setActionFeedback({ ...actionFeedback, show: false })}
        >
          {actionFeedback.message}
        </Alert>
      )}
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search by vendor name or email"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            sx={{ width: { xs: '100%', sm: '300px' } }}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            color="primary"
            variant="outlined"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
        
        {showFilters && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Plan</InputLabel>
                <Select
                  name="plan"
                  value={filters.plan}
                  onChange={handleFilterChange}
                  label="Plan"
                >
                  <MenuItem value="">All Plans</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  label="Payment Status"
                >
                  <MenuItem value="">All Payment Statuses</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button variant="text" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        )}
        
        {/* Subscriptions Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Vendor</StyledTableCell>
                <StyledTableCell>Plan</StyledTableCell>
                <StyledTableCell>Price (₹)</StyledTableCell>
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>End Date</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Payment</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <Typography variant="body2">{subscription.vendor.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {subscription.vendor.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {subscription.planName}
                    </TableCell>
                    <TableCell>₹{subscription.price}</TableCell>
                    <TableCell>{formatDate(subscription.startDate)}</TableCell>
                    <TableCell>{formatDate(subscription.endDate)}</TableCell>
                    <TableCell>
                      <StatusChip label={subscription.status} status={subscription.status} size="small" />
                    </TableCell>
                    <TableCell>
                      <StatusChip 
                        label={subscription.paymentStatus} 
                        status={subscription.paymentStatus === 'paid' ? 'active' : 
                               subscription.paymentStatus === 'pending' ? 'pending' : 'expired'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewDetails(subscription)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {subscription.paymentStatus === 'pending' && (
                        <Tooltip title="Verify Payment">
                          <IconButton 
                            size="small" 
                            color="success" 
                            onClick={() => handleVerifyPayment(subscription)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No subscriptions found matching the filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Subscription Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent dividers>
          {selectedSubscription && (
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ textTransform: 'capitalize' }}
              >
                {selectedSubscription.planName} Plan
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Vendor</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedSubscription.vendor.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedSubscription.vendor.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Price</Typography>
                  <Typography variant="body2" gutterBottom>
                    ₹{selectedSubscription.price}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <StatusChip 
                    label={selectedSubscription.status} 
                    status={selectedSubscription.status} 
                    size="small" 
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Start Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {formatDate(selectedSubscription.startDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">End Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {formatDate(selectedSubscription.endDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Booking Limit</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedSubscription.bookingLimit || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Used Bookings</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedSubscription.usedBookings || 0}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Features</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {selectedSubscription.features && selectedSubscription.features.map((feature, index) => (
                      <Typography component="li" variant="body2" key={index}>
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          {selectedSubscription && selectedSubscription.paymentStatus === 'pending' && (
            <Button 
              onClick={() => {
                setDetailsOpen(false);
                handleVerifyPayment(selectedSubscription);
              }} 
              color="success" 
              variant="contained"
            >
              Verify Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Verify Payment Dialog */}
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
        <DialogTitle>Verify Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to verify the payment for this subscription?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will mark the payment as paid and activate the subscription.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmVerifyPayment} 
            color="success" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorSubscriptions;