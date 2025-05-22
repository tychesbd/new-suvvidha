import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  SearchBar,
  Select,
  Grid,
  Modal,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Container,
  theme,
  colors,
  TextField,
  DashboardTile
} from '../../components/neumorphic';

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
    <Container>
      <Box display="flex" flexDirection="column" gap={2} p={2}>
        <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: '1rem' }}>
          Services Management
        </Typography>

        {/* Action Feedback */}
        {snackbar.open && (
          <Alert 
            severity={snackbar.severity} 
            style={{ marginBottom: '1rem' }}
            onClose={handleCloseSnackbar}
          >
            {snackbar.message}
          </Alert>
        )}

        {/* Search and Add New Service */}
        <Card variant="flat" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <SearchBar
                placeholder="Search by name, category or description"
                value={searchTerm}
                onChange={handleSearchChange}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                fullWidth
                variant="primary"
                onClick={handleAddNew}
                startIcon={<AddIcon />}
                style={{ height: '42px' }}
              >
                Add New Service
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Services Table */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress size="large" />
          </Box>
        ) : (
          <Card variant="flat" style={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell header>ID</TableCell>
                    <TableCell header>Image</TableCell>
                    <TableCell header>Name</TableCell>
                    <TableCell header>Category</TableCell>
                    <TableCell header>Price (₹)</TableCell>
                    <TableCell header>Description</TableCell>
                    <TableCell header align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color={colors.text.secondary}>
                          {services.length === 0 ? 'No services found' : 'No matching services found'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServices.map((service) => (
                      <TableRow key={service._id || service.id}>
                        <TableCell>{service._id || service.id}</TableCell>                        <TableCell style={{ width: 80, padding: '8px' }}>
                          {service.image ? (
                            <Box
                              component="img"
                              src={`${process.env.REACT_APP_API_URL || ''}/uploads/${service.image.split('/').pop()}`}
                              alt={service.name}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '8px',
                                objectFit: 'cover',
                                backgroundColor: colors.background,
                                display: 'block'
                              }}
                              onError={(e) => {
                                console.error('Image load error:', e);
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                              }}
                            />
                          ) : (
                            <Box
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '8px',
                                backgroundColor: colors.border,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.text.secondary,
                                fontSize: '12px'
                              }}
                            >
                              No Image
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={service.category}
                            variant="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>₹{service.minPrice}</TableCell>
                        <TableCell style={{ maxWidth: 250 }}>
                          <Typography 
                            style={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: '1.2em',
                              maxHeight: '2.4em'
                            }}
                          >
                            {service.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Button
                              variant="text"
                              onClick={() => handleEdit(service)}
                              title="Edit Service"
                            >
                              <EditIcon style={{ fontSize: '1.25rem' }} />
                            </Button>
                            <Button
                              variant="text"
                              color="error"
                              onClick={() => handleDeleteConfirm(service)}
                              title="Delete Service"
                            >
                              <DeleteIcon style={{ fontSize: '1.25rem' }} />
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

      {/* Add/Edit Service Modal */}
        <Modal
          open={openDialog}
          onClose={handleCloseDialog}
          title={isEditing ? "Edit Service" : "Add New Service"}
          maxWidth="md"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Service Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <Select
                label="Category"
                options={Array.isArray(apiCategories) && apiCategories.length > 0 
                  ? apiCategories.map(cat => ({ value: cat.name, label: cat.name }))
                  : [{ value: "", label: "No categories available" }]
                }
                value={formData.category}
                onChange={(value) => handleInputChange({ target: { name: 'category', value }})}
                style={{ marginTop: '1rem' }}
                fullWidth
                required
              />
              
              <TextField
                name="minPrice"
                label="Minimum Price (₹)"
                type="number"
                fullWidth
                value={formData.minPrice}
                onChange={handleInputChange}
                required
                style={{ marginTop: '1rem' }}
                min={0}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" gutterBottom>Service Image</Typography>
                <Box
                  style={{
                    border: `1px dashed ${colors.border}`,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    marginBottom: '1rem',
                    height: '200px',
                    backgroundImage: formData.image ? `url(${formData.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!formData.image && (
                    <Typography variant="body2" color={colors.text.secondary} align="center">
                      No image selected
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="primary"
                  component="label"
                  startIcon={<UploadIcon />}
                  style={{ width: '100%' }}
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
                style={{ marginTop: '1rem' }}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              variant="text"
              onClick={handleCloseDialog}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              startIcon={<SaveIcon />}
            >
              Save Service
            </Button>
          </Box>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Modal
          open={openDeleteDialog}
          onClose={handleCloseDialog}
          title="Confirm Delete"
          maxWidth="sm"
        >
          <Typography variant="body1" color={colors.text.primary} style={{ marginBottom: '1.5rem' }}>
            Are you sure you want to delete the service "{currentService?.name}"? This action cannot be undone.
          </Typography>
          
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="text" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default AdminServices;