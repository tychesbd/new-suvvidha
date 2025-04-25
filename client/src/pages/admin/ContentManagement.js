import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  TextField,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getContentByType, createOrUpdateContent, reset } from '../../features/content/contentSlice';

const ContentManagement = () => {
  const dispatch = useDispatch();
  const { currentContent, isLoading, isSuccess, isError, message } = useSelector((state) => state.content);
  
  const [activeTab, setActiveTab] = useState('hero');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'hero',
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    image: ''
  });

  // Fetch content when component mounts or tab changes
  useEffect(() => {
    dispatch(getContentByType(activeTab));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, activeTab]);
  
  // Update form data when content is fetched
  useEffect(() => {
    if (currentContent) {
      setFormData({
        type: currentContent.type || activeTab,
        title: currentContent.title || '',
        subtitle: currentContent.subtitle || '',
        description: currentContent.description || '',
        buttonText: currentContent.buttonText || '',
        buttonLink: currentContent.buttonLink || '',
        image: currentContent.image || ''
      });
    } else {
      // Reset form if no content found
      setFormData({
        type: activeTab,
        title: '',
        subtitle: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        image: ''
      });
    }
  }, [currentContent, activeTab]);
  
  // Show success/error messages
  useEffect(() => {
    if (isSuccess && message) {
      setSnackbar({
        open: true,
        message: message,
        severity: 'success'
      });
    }
    
    if (isError && message) {
      setSnackbar({
        open: true,
        message: message,
        severity: 'error'
      });
    }
  }, [isSuccess, isError, message]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  // Save content
  const handleSave = () => {
    // Validate form
    if (!formData.title) {
      setSnackbar({
        open: true,
        message: 'Please provide a title',
        severity: 'error'
      });
      return;
    }

    // Update content
    dispatch(createOrUpdateContent({
      ...formData,
      type: activeTab
    }));
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Content Management
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Hero Section" value="hero" />
          <Tab label="Why Us Section" value="whyUs" />
          <Tab label="Ads Section" value="ads" />
        </Tabs>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit {activeTab === 'hero' ? 'Hero Section' : activeTab === 'whyUs' ? 'Why Us Section' : 'Ads Section'}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              name="title"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            
            <TextField
              name="subtitle"
              label="Subtitle"
              fullWidth
              value={formData.subtitle}
              onChange={handleInputChange}
              margin="normal"
            />
            
            <TextField
              name="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
            />
            
            <TextField
              name="buttonText"
              label="Button Text"
              fullWidth
              value={formData.buttonText}
              onChange={handleInputChange}
              margin="normal"
            />
            
            <TextField
              name="buttonLink"
              label="Button Link"
              fullWidth
              value={formData.buttonLink}
              onChange={handleInputChange}
              margin="normal"
            />
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Section Image
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
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {activeTab === 'hero' && (
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={formData.image || 'https://source.unsplash.com/random/1200x600/?service'}
                  alt="Hero Section"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {formData.title || 'Hero Title'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {formData.subtitle || 'Hero Subtitle'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formData.description || 'Hero description goes here...'}
                  </Typography>
                  {formData.buttonText && (
                    <Button variant="contained" size="small" sx={{ mt: 2 }}>
                      {formData.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'whyUs' && (
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={formData.image || 'https://source.unsplash.com/random/1200x600/?team'}
                  alt="Why Us Section"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {formData.title || 'Why Choose Us'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {formData.subtitle || 'Reasons to choose our services'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formData.description || 'Why us description goes here...'}
                  </Typography>
                  {formData.buttonText && (
                    <Button variant="contained" size="small" sx={{ mt: 2 }}>
                      {formData.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'ads' && (
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={formData.image || 'https://source.unsplash.com/random/1200x600/?advertisement'}
                  alt="Ads Section"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {formData.title || 'Advertisement'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {formData.subtitle || 'Special offers and promotions'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formData.description || 'Advertisement description goes here...'}
                  </Typography>
                  {formData.buttonText && (
                    <Button variant="contained" size="small" sx={{ mt: 2 }}>
                      {formData.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentManagement;