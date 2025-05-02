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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

const SubscriptionPlans = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentPlan, setCurrentPlan] = useState({
    name: '',
    price: '',
    description: '',
    bookingLimit: '',
    validityPeriod: '',
    isActive: true,
  });
  
  // Delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Fetch subscription plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/subscription-plans/admin', config);
      setPlans(data);
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
    fetchPlans();
  }, [userInfo]);

  // Handle dialog open for add/edit
  const handleOpenDialog = (mode, plan = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && plan) {
      setCurrentPlan({
        _id: plan._id,
        name: plan.name,
        price: plan.price,
        description: plan.description,
        bookingLimit: plan.bookingLimit,
        validityPeriod: plan.validityPeriod,
        isActive: plan.isActive,
      });
    } else {
      // Reset form for add mode
      setCurrentPlan({
        name: '',
        price: '',
        description: '',
        bookingLimit: '',
        validityPeriod: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPlan({
      ...currentPlan,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Convert string values to numbers
      const planData = {
        ...currentPlan,
        price: Number(currentPlan.price),
        bookingLimit: Number(currentPlan.bookingLimit),
        validityPeriod: Number(currentPlan.validityPeriod),
      };

      if (dialogMode === 'add') {
        await axios.post('/api/subscription-plans/admin', planData, config);
      } else {
        await axios.put(`/api/subscription-plans/admin/${currentPlan._id}`, planData, config);
      }

      // Refresh plans list
      fetchPlans();
      handleCloseDialog();
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

  // Handle delete confirmation dialog
  const handleOpenDeleteDialog = (plan) => {
    setPlanToDelete(plan);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPlanToDelete(null);
  };

  // Handle delete plan
  const handleDeletePlan = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/subscription-plans/admin/${planToDelete._id}`, config);

      // Refresh plans list
      fetchPlans();
      handleCloseDeleteDialog();
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Subscription Plans
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Add New Plan
        </Button>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.dark' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Price (₹)</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Booking Limit</StyledTableCell>
              <StyledTableCell>Validity (days)</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>₹{plan.price}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>{plan.bookingLimit}</TableCell>
                <TableCell>{plan.validityPeriod}</TableCell>
                <TableCell>
                  {plan.isActive ? (
                    <Tooltip title="Active">
                      <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        Active
                      </Box>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Inactive">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        Inactive
                      </Box>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog('edit', plan)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleOpenDeleteDialog(plan)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {plans.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No subscription plans found. Create your first plan!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Subscription Plan' : 'Edit Subscription Plan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Plan Name"
                value={currentPlan.name}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price (₹)"
                type="number"
                value={currentPlan.price}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={currentPlan.description}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="bookingLimit"
                label="Booking Limit"
                type="number"
                value={currentPlan.bookingLimit}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
                inputProps={{ min: 1 }}
                helperText="Maximum number of bookings allowed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="validityPeriod"
                label="Validity Period (days)"
                type="number"
                value={currentPlan.validityPeriod}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
                inputProps={{ min: 1 }}
                helperText="Subscription validity in days"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentPlan.isActive}
                    onChange={handleInputChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {dialogMode === 'add' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the subscription plan "{planToDelete?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeletePlan} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPlans;