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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';

// Mock data - in a real app, this would come from an API
const mockSubscriptions = [
  {
    _id: '1',
    vendor: { _id: '101', name: 'Vendor 1', email: 'vendor1@example.com' },
    plan: 'premium',
    price: 4999,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-04-01'),
    status: 'active',
    paymentStatus: 'paid',
    features: ['Premium service listing', 'Dedicated customer support', 'Advanced analytics', 'Marketing tools', '180 days validity'],
  },
  {
    _id: '2',
    vendor: { _id: '102', name: 'Vendor 2', email: 'vendor2@example.com' },
    plan: 'standard',
    price: 2499,
    startDate: new Date('2023-11-15'),
    endDate: new Date('2024-02-15'),
    status: 'active',
    paymentStatus: 'paid',
    features: ['Featured service listing', 'Priority customer support', 'Analytics dashboard', '90 days validity'],
  },
  {
    _id: '3',
    vendor: { _id: '103', name: 'Vendor 3', email: 'vendor3@example.com' },
    plan: 'basic',
    price: 999,
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-01-01'),
    status: 'expired',
    paymentStatus: 'paid',
    features: ['Basic service listing', 'Customer support', '30 days validity'],
  },
  {
    _id: '4',
    vendor: { _id: '104', name: 'Vendor 4', email: 'vendor4@example.com' },
    plan: 'premium',
    price: 4999,
    startDate: new Date('2023-12-15'),
    endDate: new Date('2024-06-15'),
    status: 'pending',
    paymentStatus: 'pending',
    features: ['Premium service listing', 'Dedicated customer support', 'Advanced analytics', 'Marketing tools', '180 days validity'],
  },
];

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

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState(mockSubscriptions);
  const [filters, setFilters] = useState({
    plan: '',
    status: '',
    paymentStatus: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  // In a real app, you would fetch subscriptions from an API
  useEffect(() => {
    // Simulating API call
    // const fetchSubscriptions = async () => {
    //   const response = await fetch('/api/subscriptions');
    //   const data = await response.json();
    //   setSubscriptions(data);
    //   setFilteredSubscriptions(data);
    // };
    // fetchSubscriptions();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...subscriptions];
    
    if (filters.plan) {
      result = result.filter(sub => sub.plan === filters.plan);
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      plan: '',
      status: '',
      paymentStatus: '',
      search: '',
    });
  };

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setDetailsOpen(true);
  };

  const handleVerifyPayment = (subscription) => {
    setSelectedSubscription(subscription);
    setVerifyDialogOpen(true);
  };

  const confirmVerifyPayment = async () => {
    // In a real app, you would make an API call to update the subscription
    // const response = await fetch(`/api/subscriptions/${selectedSubscription._id}/verify`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ paymentStatus: 'paid' })
    // });
    // const updatedSubscription = await response.json();
    
    // Mock update
    const updatedSubscriptions = subscriptions.map(sub => {
      if (sub._id === selectedSubscription._id) {
        return {
          ...sub,
          paymentStatus: 'paid',
          status: 'active'
        };
      }
      return sub;
    });
    
    setSubscriptions(updatedSubscriptions);
    setVerifyDialogOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage vendor subscriptions and payment verifications
      </Typography>

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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <Typography variant="body2">{subscription.vendor.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {subscription.vendor.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{subscription.plan}</TableCell>
                    <TableCell>₹{subscription.price}</TableCell>
                    <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusChip 
                        label={subscription.status} 
                        status={subscription.status} 
                        size="small"
                      />
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
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent dividers>
          {selectedSubscription && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                {selectedSubscription.plan} Plan
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
                    {new Date(selectedSubscription.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">End Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(selectedSubscription.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Features</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {selectedSubscription.features.map((feature, index) => (
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
          <Button onClick={confirmVerifyPayment} color="success" variant="contained">
            Verify Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscriptions;