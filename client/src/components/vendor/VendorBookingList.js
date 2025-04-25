import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';

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

const VendorBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  // Fetch vendor's assigned bookings from API
  useEffect(() => {
    const fetchVendorBookings = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (!userInfo || !userInfo.token) {
          setError('You must be logged in to view bookings');
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        const response = await axios.get('/api/bookings/vendor', config);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };
    
    fetchVendorBookings();
  }, []);

  // Handle opening status update dialog
  const handleUpdateStatusClick = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusNote(booking.statusNote || '');
    setStatusDialogOpen(true);
  };

  // Handle status dialog close
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedBooking(null);
    setNewStatus('');
    setStatusNote('');
  };

  // Handle booking status update
  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    
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
      
      // Make API call to update booking status
      const { data } = await axios.put(
        `/api/bookings/${selectedBooking._id}/vendor-status`,
        { status: newStatus, statusNote },
        config
      );
      
      // Update the booking status in the local state
      const updatedBookings = bookings.map(booking => {
        if (booking._id === selectedBooking._id) {
          return { ...booking, status: newStatus, statusNote };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      setLoading(false);
      handleStatusDialogClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update booking status');
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} sx={{ mr: 2 }} />
        <Typography variant="body1">Loading bookings...</Typography>
      </Paper>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      </Paper>
    );
  }
  
  // Render empty state if no bookings
  if (bookings.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          You don't have any assigned bookings.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={2} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Booking ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} hover>
                <TableCell>{booking._id.substring(0, 8)}...</TableCell>
                <TableCell>{booking.customer.name}</TableCell>
                <TableCell>{booking.serviceName}</TableCell>
                <TableCell>{booking.customer.location}</TableCell>
                <TableCell>
                  <StatusChip 
                    label={booking.status} 
                    status={booking.status} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="center">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    onClick={() => handleUpdateStatusClick(booking)}
                    disabled={booking.status === 'cancelled'}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Box sx={{ mb: 3, mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Booking Details:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<PersonIcon />}
                      label="Customer Name"
                      value={selectedBooking.customer.name}
                    />
                    <InfoItem 
                      icon={<PhoneIcon />}
                      label="Phone Number"
                      value={selectedBooking.customer.phoneNumber}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<LocationOnIcon />}
                      label="Location"
                      value={selectedBooking.customer.location}
                    />
                  </Grid>
                </Grid>
              </Box>

              <TextField
                select
                label="Update Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                fullWidth
                margin="normal"
                required
              >
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
              
              <TextField
                label="Status Note (Optional)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                placeholder="Add any notes about this status update"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
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
    </>
  );
};

export default VendorBookingList;