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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

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



const BookingList = ({ type = 'active' }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
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
        
        const response = await axios.get('/api/bookings', config);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Filter bookings based on type
  const filteredBookings = bookings.filter(booking => {
    if (type === 'active') {
      return ['in-progress', 'pending'].includes(booking.status);
    } else if (type === 'history') {
      return ['completed', 'cancelled'].includes(booking.status);
    }
    return true;
  });

  // Handle opening cancel dialog
  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  // Handle cancel dialog close
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setSelectedBooking(null);
    setCancelReason('');
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason) return;
    
    setLoading(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo || !userInfo.token) {
        setError('You must be logged in to cancel a booking');
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Make API call to cancel booking
      await axios.put(`/api/bookings/${selectedBooking._id}/cancel`, { cancelReason }, config);
      
      // Update the booking status in the local state
      const updatedBookings = bookings.map(booking => {
        if (booking._id === selectedBooking._id) {
          return { ...booking, status: 'cancelled', cancelReason };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      setLoading(false);
      handleCancelDialogClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel booking');
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
  if (filteredBookings.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          {type === 'active' 
            ? 'You don\'t have any active bookings.'
            : 'You don\'t have any booking history.'}
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
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell>Date & Time</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              {type === 'active' && <StyledTableCell align="center">Action</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking._id} hover>
                <TableCell>{booking._id}</TableCell>
                <TableCell>{booking.serviceName}</TableCell>
                <TableCell>{new Date(booking.dateTime).toLocaleString()}</TableCell>
                <TableCell>
                  <StatusChip 
                    label={booking.status} 
                    status={booking.status} 
                    size="small" 
                  />
                </TableCell>
                {type === 'active' && (
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => handleCancelClick(booking)}
                      disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCancelDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Are you sure you want to cancel this booking?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Booking Details:
            </Typography>
            {selectedBooking && (
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">Service: {selectedBooking.serviceName}</Typography>
                <Typography variant="body2">Date & Time: {selectedBooking.dateTime}</Typography>
              </Box>
            )}
          </Box>
          <TextField
            select
            label="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="schedule_conflict">Schedule Conflict</MenuItem>
            <MenuItem value="found_alternative">Found Alternative Service</MenuItem>
            <MenuItem value="price_issue">Price Issue</MenuItem>
            <MenuItem value="no_longer_needed">Service No Longer Needed</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          {cancelReason === 'other' && (
            <TextField
              label="Please specify"
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} color="inherit">
            Back
          </Button>
          <Button 
            onClick={handleCancelBooking} 
            color="error" 
            variant="contained"
            disabled={!cancelReason || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Processing...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookingList;