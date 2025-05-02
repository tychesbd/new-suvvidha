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
  
  if (status === 'active' || status === 'approved') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === 'expired' || status === 'denied') {
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

const VendorSubscriptionManagement = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    plan: '',
    status: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  
  // Dialog states
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
      result = result.filter(sub => sub.planName === filters.plan);
    }
    
    if (filters.status) {
      result = result.filter(sub => sub.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(sub => 
        (sub.vendor?.name?.toLowerCase().includes(searchLower)) ||
        (sub.vendor?.phone?.toLowerCase().includes(searchLower))
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

  // Handle approve subscription
  const handleApproveSubscription = async (subscriptionId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      await axios.put(
        `/api/subscriptions/${subscriptionId}/approve`, 
        {},
        config
      );
      
      // Show success message
      setActionFeedback({
        message: 'Subscription approved successfully',
        severity: 'success',
        show: true
      });
      
      // Refresh subscriptions
      fetchSubscriptions();
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to approve subscription'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle deny subscription
  const handleDenySubscription = async (subscriptionId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      await axios.put(
        `/api/subscriptions/${subscriptionId}/deny`, 
        {},
        config
      );
      
      // Show success message
      setActionFeedback({
        message: 'Subscription denied',
        severity: 'info',
        show: true
      });
      
      // Refresh subscriptions
      fetchSubscriptions();
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to deny subscription'
      );
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

  if (loading && subscriptions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get unique plan names for filter
  const planOptions = [...new Set(subscriptions.map(sub => sub.planName))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Subscriptions
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {actionFeedback.show && (
        <Alert 
          severity={actionFeedback.severity} 
          sx={{ mb: 3 }}
          onClose={() => setActionFeedback(prev => ({ ...prev, show: false }))}
        >
          {actionFeedback.message}
        </Alert>
      )}
      
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Filters
          </Typography>
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            <FilterListIcon />
          </IconButton>
        </Box>
        
        {showFilters && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="denied">Denied</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Subscription Plan</InputLabel>
                <Select
                  name="plan"
                  value={filters.plan}
                  label="Subscription Plan"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {planOptions.map(plan => (
                    <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                name="search"
                label="Search by Vendor Name/Phone"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: <SearchIcon color="action" />,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button variant="outlined" size="small" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>
      
      {/* Subscriptions Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
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
                <TableCell colSpan={9} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription._id}>
                  <TableCell>{subscription.vendor?.name || 'N/A'}</TableCell>
                  <TableCell>{subscription.vendor?.phone || 'N/A'}</TableCell>
                  <TableCell>{subscription.planName}</TableCell>
                  <TableCell>
                    {subscription.services?.length || 0} services
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewDetails(subscription)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {subscription.screenshot ? (
                      <Tooltip title="View Screenshot">
                        <IconButton size="small" onClick={() => handleViewScreenshot(subscription)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      'Not uploaded'
                    )}
                  </TableCell>
                  <TableCell>{subscription.transactionId || 'N/A'}</TableCell>
                  <TableCell>
                    {subscription.bookingLimit - (subscription.usedBookings || 0)} / {subscription.bookingLimit}
                  </TableCell>
                  <TableCell>
                    <StatusChip 
                      label={subscription.status} 
                      status={subscription.status} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {subscription.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApproveSubscription(subscription._id)}
                          disabled={loading}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDenySubscription(subscription._id)}
                          disabled={loading}
                        >
                          Deny
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Subscription Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Subscription Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubscription && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Vendor
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedSubscription.vendor?.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedSubscription.vendor?.phone} | {selectedSubscription.vendor?.email}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Subscription Plan
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedSubscription.planName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <StatusChip 
                  label={selectedSubscription.status} 
                  status={selectedSubscription.status} 
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedSubscription.startDate)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedSubscription.endDate)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedSubscription.transactionId || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Amount Paid
                </Typography>
                <Typography variant="body1" gutterBottom>
                  ₹{selectedSubscription.amount}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Selected Services
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {selectedSubscription.services?.map((service) => (
                    <Chip 
                      key={service._id} 
                      label={service.name} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                    />
                  ))}
                </Box>
              </Grid>
              
              {selectedSubscription.screenshot && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Screenshot
                  </Typography>
                  <Box 
                    component="img" 
                    src={selectedSubscription.screenshot} 
                    alt="Payment Screenshot" 
                    sx={{ 
                      width: '100%', 
                      maxHeight: 300, 
                      objectFit: 'contain',
                      mt: 1,
                      border: '1px solid #eee',
                      borderRadius: 1
                    }}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Screenshot Preview Dialog */}
      <Dialog
        open={screenshotOpen}
        onClose={() => setScreenshotOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Payment Screenshot
        </DialogTitle>
        <DialogContent>
          {selectedSubscription && selectedSubscription.screenshot && (
            <Box 
              component="img" 
              src={selectedSubscription.screenshot} 
              alt="Payment Screenshot" 
              sx={{ 
                width: '100%', 
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (selectedSubscription && selectedSubscription.screenshot) {
                window.open(selectedSubscription.screenshot, '_blank');
              }
            }}
          >
            Download
          </Button>
          <Button onClick={() => setScreenshotOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorSubscriptionManagement;