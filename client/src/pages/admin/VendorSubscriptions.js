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
import DownloadIcon from '@mui/icons-material/Download';
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
  const [screenshotOpen, setScreenshotOpen] = useState(false);
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
      result = result.filter(sub => 
        (sub.plan && sub.plan.toLowerCase() === filters.plan.toLowerCase()) || 
        (sub.planName && sub.planName.toLowerCase() === filters.plan.toLowerCase())
      );
    }
    
    if (filters.status) {
      result = result.filter(sub => sub.status === filters.status);
    }
    
    if (filters.paymentStatus) {
      result = result.filter(sub => sub.paymentStatus === filters.paymentStatus);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(sub => {
        // Safely access nested properties with optional chaining
        const vendorName = sub.vendor?.name?.toLowerCase() || '';
        const vendorEmail = sub.vendor?.email?.toLowerCase() || '';
        const vendorPhone = sub.vendor?.phone?.toLowerCase() || '';
        
        return vendorName.includes(searchLower) || 
               vendorEmail.includes(searchLower) || 
               vendorPhone.includes(searchLower);
      });
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

  // Handle view screenshot
  const handleViewScreenshot = (subscription) => {
    setSelectedSubscription(subscription);
    setScreenshotOpen(true);
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
      
      // Send verification request with status update
      const response = await axios.put(
        `/api/subscriptions/${selectedSubscription._id}/verify`, 
        { 
          paymentStatus: 'paid',
          status: 'active'
        },
        config
      );
      
      // Update local state with response data or fallback to local update
      if (response.data) {
        // If server returns updated subscription, use that
        const updatedSubscriptions = subscriptions.map(sub => {
          if (sub._id === selectedSubscription._id) {
            return response.data;
          }
          return sub;
        });
        setSubscriptions(updatedSubscriptions);
      } else {
        // Fallback to local update if server doesn't return updated data
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
      }
      
      setVerifyDialogOpen(false);
      
      // Show success message
      setActionFeedback({
        message: 'Payment verified successfully',
        severity: 'success',
        show: true
      });
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setActionFeedback(prev => ({ ...prev, show: false }));
      }, 3000);
      
      // Refresh subscriptions list
      fetchSubscriptions();
      
    } catch (err) {
      console.error('Payment verification error:', err);
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
        setActionFeedback(prev => ({ ...prev, show: false }));
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Deny payment
  const denyPayment = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Send denial request with status update
      const response = await axios.put(
        `/api/subscriptions/${selectedSubscription._id}/verify`, 
        { 
          paymentStatus: 'failed',
          status: 'cancelled'
        },
        config
      );
      
      // Update local state with response data or fallback to local update
      if (response.data) {
        // If server returns updated subscription, use that
        const updatedSubscriptions = subscriptions.map(sub => {
          if (sub._id === selectedSubscription._id) {
            return response.data;
          }
          return sub;
        });
        setSubscriptions(updatedSubscriptions);
      } else {
        // Fallback to local update if server doesn't return updated data
        const updatedSubscriptions = subscriptions.map(sub => {
          if (sub._id === selectedSubscription._id) {
            return {
              ...sub,
              status: 'cancelled',
              paymentStatus: 'failed'
            };
          }
          return sub;
        });
        setSubscriptions(updatedSubscriptions);
      }
      
      setVerifyDialogOpen(false);
      
      // Show success message
      setActionFeedback({
        message: 'Payment denied successfully',
        severity: 'info',
        show: true
      });
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setActionFeedback(prev => ({ ...prev, show: false }));
      }, 3000);
      
      // Refresh subscriptions list
      fetchSubscriptions();
      
    } catch (err) {
      console.error('Payment denial error:', err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      
      // Show error message
      setActionFeedback({
        message: 'Failed to deny payment',
        severity: 'error',
        show: true
      });
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setActionFeedback(prev => ({ ...prev, show: false }));
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
                <StyledTableCell>Vendor Name</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Selected Subscription</StyledTableCell>
                <StyledTableCell>Selected Services</StyledTableCell>
                <StyledTableCell>Screenshot</StyledTableCell>
                <StyledTableCell>URN</StyledTableCell>
                <StyledTableCell>Bookings Left</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <Typography variant="body2">{subscription.vendor.name}</Typography>
                    </TableCell>
                    <TableCell>{subscription.vendor.phone || 'N/A'}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {subscription.planName || subscription.plan || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {subscription.selectedServices && subscription.selectedServices.length > 0 ? 
                        `${subscription.selectedServices.length} services` : '0 services'}
                    </TableCell>
                    <TableCell>
                      {subscription.paymentProof ? (
                        <Button 
                          size="small" 
                          variant="text" 
                          onClick={() => handleViewScreenshot && handleViewScreenshot(subscription)}
                        >
                          View
                        </Button>
                      ) : (
                        'Not uploaded'
                      )}
                    </TableCell>
                    <TableCell>{subscription.transactionId || 'N/A'}</TableCell>
                    <TableCell>{subscription.bookingsLeft || 'N/A'}</TableCell>
                    <TableCell>
                      <StatusChip label={subscription.status} status={subscription.status} size="small" />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewDetails(subscription)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {subscription.status === 'pending' && (
                        <Tooltip title="Approve">
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
                  <TableCell colSpan={9} align="center">
                    No subscriptions found matching the filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Screenshot Dialog */}
      <Dialog open={screenshotOpen} onClose={() => setScreenshotOpen(false)} maxWidth="md">
        <DialogTitle>
          Payment Proof
          <IconButton
            aria-label="close"
            onClick={() => setScreenshotOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedSubscription && selectedSubscription.paymentProof && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <img 
                src={`/api/uploads/${selectedSubscription.paymentProof}`} 
                alt="Payment Proof" 
                style={{ maxWidth: '100%', maxHeight: '70vh' }} 
              />
            </Box>
          )}
          {selectedSubscription && !selectedSubscription.paymentProof && (
            <Typography variant="body1" align="center" color="text.secondary">
              No payment proof uploaded
            </Typography>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Subscription Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent dividers>
          {selectedSubscription && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Subscription Plan</Typography>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ textTransform: 'capitalize' }}
                >
                  {selectedSubscription.planName || selectedSubscription.plan || 'Unknown'} Plan
                </Typography>
              </Box>
              
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
                  <Typography variant="subtitle2">Amount Paid</Typography>
                  <Typography variant="body2" gutterBottom>
                    ₹{selectedSubscription.price || 0}
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
                    {selectedSubscription.bookingsLeft || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Transaction ID</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedSubscription.transactionId || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Selected Services</Typography>
                  <Box sx={{ mt: 1, border: '1px solid #eee', borderRadius: 1, p: 2 }}>
                    {selectedSubscription.selectedServices && selectedSubscription.selectedServices.length > 0 ? (
                      <Grid container spacing={1}>
                        {selectedSubscription.selectedServices.map((service) => (
                          <Grid item xs={6} key={service._id || service.id || Math.random().toString()}>
                            <Chip 
                              label={service.name || service.serviceName || 'Service'} 
                              size="small" 
                              sx={{ mr: 1, mb: 1 }}
                              variant="outlined"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2">No services selected</Typography>
                    )}
                  </Box>
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
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>Payment Proof</Typography>
                    {selectedSubscription.paymentProof && (
                      <Tooltip title="Download Payment Proof">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            const imgUrl = `/api/uploads/${selectedSubscription.paymentProof}`;
                            const link = document.createElement('a');
                            link.href = imgUrl;
                            link.download = `payment-proof-${selectedSubscription._id}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Box sx={{ mt: 1, border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
                    {selectedSubscription.paymentProof ? (
                      <img 
                        src={`/api/uploads/${selectedSubscription.paymentProof}`} 
                        alt="Payment Proof" 
                        style={{ maxWidth: '100%', maxHeight: '300px' }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = selectedSubscription.paymentProof; // Fallback to direct URL if path is wrong
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No payment proof uploaded
                      </Typography>
                    )}
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
        <DialogTitle>Approve Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Do you want to approve or deny this payment?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Approving will mark the payment as paid and activate the subscription.
            Denying will mark the payment as failed and cancel the subscription.
          </Typography>
          
          <Box sx={{ mt: 2, border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Payment Proof</Typography>
              {selectedSubscription && selectedSubscription.paymentProof && (
                <Tooltip title="Download Payment Proof">
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      const imgUrl = `/api/uploads/${selectedSubscription.paymentProof}`;
                      const link = document.createElement('a');
                      link.href = imgUrl;
                      link.download = `payment-proof-${selectedSubscription._id}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            {selectedSubscription && selectedSubscription.paymentProof ? (
              <img 
                src={`/api/uploads/${selectedSubscription.paymentProof}`} 
                alt="Payment Proof" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = selectedSubscription.paymentProof; // Fallback to direct URL if path is wrong
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No payment proof uploaded
              </Typography>
            )}
          </Box>
          
          {selectedSubscription && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Transaction ID</Typography>
              <Typography variant="body2">
                {selectedSubscription.transactionId || 'Not provided'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={denyPayment} 
            color="error" 
            variant="outlined"
            disabled={loading}
            sx={{ mr: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Deny Payment'}
          </Button>
          <Button 
            onClick={confirmVerifyPayment} 
            color="success" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'APPROVE'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorSubscriptions;