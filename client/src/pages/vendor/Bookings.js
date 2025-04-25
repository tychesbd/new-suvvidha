import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import VendorBookingList from '../../components/vendor/VendorBookingList';

const Bookings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Assigned Bookings
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        View and manage bookings assigned to you by admin
      </Typography>
      
      <Paper elevation={0} sx={{ p: 0 }}>
        <VendorBookingList />
      </Paper>
    </Box>
  );
};

export default Bookings;