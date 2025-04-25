import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getServices, createService, updateService, deleteService, reset } from '../../features/services/serviceSlice';
import { getCategories } from '../../features/categories/categorySlice';


// Fallback services in case API fails
const fallbackServices = [
  {
    id: 1,
    name: 'Home Cleaning',
    category: 'Cleaning',
    minPrice: 499,
    description: 'Professional home cleaning services for a spotless living space.',
    image: 'https://source.unsplash.com/random/300x200/?cleaning',
  },
  {
    id: 2,
    name: 'Plumbing',
    category: 'Plumbing',
    minPrice: 299,
    description: 'Expert plumbing services for all your repair and installation needs.',
    image: 'https://source.unsplash.com/random/300x200/?plumbing',
  },
  {
    id: 3,
    name: 'Electrical Work',
    category: 'Electrical',
    minPrice: 399,
    description: 'Reliable electrical services for your home and office.',
    image: 'https://source.unsplash.com/random/300x200/?electrical',
  },
];

const AdminServices = () => {
  const dispatch = useDispatch();
  const { services: apiServices, isLoading, isSuccess, isError, message } = useSelector((state) => state.services);
  const { categories: apiCategories } = useSelector((state) => state.categories);
  
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch services and categories when component mounts
  useEffect(() => {
    dispatch(getServices());
    dispatch(getCategories());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  
  // Update local state when API data changes
  useEffect(() => {
    if (apiServices && apiServices.length > 0) {
      setServices(apiServices);
    } else if (isError && message) {
      setSnackbar({
        open: true,
        message: message,
        severity: 'error'
      });
      setServices(fallbackServices);
    }
  }, [apiServices, isError, message]);
  
  // Show success messages
  useEffect(() => {
    if (isSuccess && message) {
      setSnackbar({
        open: true,
        message: message,
        severity: 'success'
      });
    }
  }, [isSuccess, message]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    minPrice: '',
    description: '',
    image: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open dialog for adding new service
  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      category: '',
      minPrice: '',
      description: '',
      image: ''
    });
    setOpenDialog(true);
  };

  // Open dialog for editing service
  const handleEdit = (service) => {
    setIsEditing(true);
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      minPrice: service.minPrice,
      description: service.description,
      image: service.image,
      isActive: service.isActive !== undefined ? service.isActive : true
    });
    setOpenDialog(true);
  };

  // Open confirmation dialog for deleting service
  const handleDeleteConfirm = (service) => {
    setCurrentService(service);
    setOpenDeleteDialog(true);
  };

  // Close all dialogs
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
  };

  // Save new or edited service
  const handleSave = () => {
    // Validate form
    if (!formData.name || !formData.category || !formData.minPrice || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    if (isEditing && currentService) {
      // Update existing service
      dispatch(updateService({
        id: currentService._id,
        serviceData: formData
      }));
    } else {
      // Add new service
      dispatch(createService(formData));
    }

    handleCloseDialog();
  };

  // Delete service
  const handleDelete = () => {
    if (currentService) {
      dispatch(deleteService(currentService._id));
      setOpenDeleteDialog(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the UI
      const previewUrl = URL.createObjectURL(file);
      
      // Store the file in formData for submission
      setFormData({
        ...formData,
        image: previewUrl,
        imageFile: file
      });
      
      setSnackbar({
        open: true,
        message: 'Image selected successfully',
        severity: 'success'
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter services based on search term
  const filteredServices = services.filter((service) => {
    return (
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Services Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          disabled={isLoading}
        >
          Add New Service
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search services by name, category or description"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Min Price (₹)</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {services.length === 0 ? 'No services found' : 'No matching services found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service._id || service.id}>
                  <TableCell>{service._id || service.id}</TableCell>
                  <TableCell>
                    <Avatar
                      src={service.image}
                      alt={service.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>₹{service.minPrice}</TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Typography noWrap>{service.description}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(service)} disabled={isLoading}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteConfirm(service)} disabled={isLoading}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Service Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Service Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {apiCategories && apiCategories.length > 0 ? (
                    apiCategories.map((category) => (
                      <MenuItem key={category._id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No categories available</MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                name="minPrice"
                label="Minimum Price (₹)"
                type="number"
                fullWidth
                value={formData.minPrice}
                onChange={handleInputChange}
                required
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Service Image
                  </Typography>
                  <Box
                    sx={{
                      border: '1px dashed grey',
                      borderRadius: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      mb: 2,
                      height: 150,
                      backgroundImage: formData.image ? `url(${formData.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!formData.image && (
                      <Typography variant="body2" color="text.secondary" align="center">
                        No image selected
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                  >
                    Upload Image
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the service "{currentService?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminServices;