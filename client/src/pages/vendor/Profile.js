import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, reset } from '../../features/auth/authSlice';
import { getCategories } from '../../features/categories/categorySlice';
import { toast } from 'react-toastify';
import ChangePasswordForm from '../../components/forms/ChangePasswordForm';

// Material UI imports
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  margin: 'auto',
  backgroundColor: theme.palette.secondary.main,
  fontSize: '3rem',
}));

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);
  const [isEditing, setIsEditing] = useState(false);
  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState('');
  
  // Initialize form data with all user fields
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    address: userInfo?.address || '',
    pincodes: userInfo?.pincodes || [''],
    yearsOfExperience: userInfo?.yearsOfExperience || 0,
    serviceExpertise: userInfo?.serviceExpertise || [],
  });
  
  // Update form data when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        pincodes: userInfo.pincodes && userInfo.pincodes.length > 0 ? userInfo.pincodes : [''],
        yearsOfExperience: userInfo.yearsOfExperience || 0,
        serviceExpertise: userInfo.serviceExpertise || [],
      });
    }
  }, [userInfo]);

  const { name, email, phone, address, pincodes, yearsOfExperience, serviceExpertise } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && isEditing) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      
      // Reset file state after successful update
      setIdProofFile(null);
      setIdProofPreview('');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, isEditing]);
  
  // Fetch categories for service expertise dropdown
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'serviceExpertise') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: typeof value === 'string' ? value.split(',') : value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };
  
  // Handle pincode changes
  const handlePincodeChange = (index, value) => {
    const newPincodes = [...pincodes];
    newPincodes[index] = value;
    setFormData({
      ...formData,
      pincodes: newPincodes,
    });
  };

  // Add new pincode field
  const addPincodeField = () => {
    setFormData({
      ...formData,
      pincodes: [...pincodes, ''],
    });
  };

  // Remove pincode field
  const removePincodeField = (index) => {
    const newPincodes = [...pincodes];
    newPincodes.splice(index, 1);
    setFormData({
      ...formData,
      pincodes: newPincodes.length > 0 ? newPincodes : [''],
    });
  };
  
  // Handle ID proof document upload
  const handleIdProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdProofFile(file);
      setIdProofPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIdProofFile(null);
    setIdProofPreview('');
    setFormData({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      address: userInfo?.address || '',
      pincodes: userInfo?.pincodes && userInfo.pincodes.length > 0 ? userInfo.pincodes : [''],
      yearsOfExperience: userInfo?.yearsOfExperience || 0,
      serviceExpertise: userInfo?.serviceExpertise || [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('phone', phone);
    formDataToSend.append('address', address);
    
    // Append pincodes as JSON string
    const filteredPincodes = pincodes.filter(pincode => pincode.trim() !== '');
    formDataToSend.append('pincodes', JSON.stringify(filteredPincodes));
    
    formDataToSend.append('yearsOfExperience', yearsOfExperience);
    
    // Append service expertise
    if (serviceExpertise && serviceExpertise.length > 0) {
      formDataToSend.append('serviceExpertise', JSON.stringify(serviceExpertise));
    }
    
    // Append ID proof document if selected
    if (idProofFile) {
      formDataToSend.append('idProofDocument', idProofFile);
    }
    
    dispatch(updateProfile(formDataToSend));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vendor Profile
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage your vendor account information
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <StyledAvatar>
                <StorefrontIcon fontSize="large" />
              </StyledAvatar>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {userInfo?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {userInfo?.role.charAt(0).toUpperCase() + userInfo?.role.slice(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {userInfo?.email}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 3 }}
                startIcon={<EditIcon />}
                onClick={handleEdit}
                disabled={isEditing}
                color="secondary"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            {isEditing ? (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  Edit Vendor Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={email}
                      onChange={onChange}
                      required
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={phone}
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Years of Experience"
                      name="yearsOfExperience"
                      type="number"
                      value={yearsOfExperience}
                      onChange={onChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  
                  {/* Multi-pincode fields */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Service Area Pincodes
                    </Typography>
                    {pincodes.map((pincode, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                          fullWidth
                          label={`Pincode ${index + 1}`}
                          value={pincode}
                          onChange={(e) => handlePincodeChange(index, e.target.value)}
                          inputProps={{ maxLength: 6 }}
                          placeholder="Enter 6-digit pincode"
                          sx={{ mr: 1 }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={pincodes.length <= 1}
                          onClick={() => removePincodeField(index)}
                          sx={{ minWidth: '40px', width: '40px', height: '40px', p: 0 }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addPincodeField}
                      sx={{ mt: 1 }}
                    >
                      Add Pincode
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        ID Proof Document
                      </Typography>
                      <input
                        accept="image/*,.pdf"
                        style={{ display: 'none' }}
                        id="id-proof-upload"
                        type="file"
                        onChange={handleIdProofUpload}
                      />
                      <label htmlFor="id-proof-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{ mt: 1 }}
                        >
                          Upload Document
                        </Button>
                      </label>
                      {idProofPreview && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Document Preview:
                          </Typography>
                          <img 
                            src={idProofPreview} 
                            alt="ID Proof Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100px' }} 
                          />
                        </Box>
                      )}
                      {userInfo?.idProofDocument && !idProofPreview && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Document already uploaded. Upload a new one to replace it.
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="service-expertise-label">Service Expertise</InputLabel>
                      <Select
                        labelId="service-expertise-label"
                        id="service-expertise"
                        multiple
                        value={serviceExpertise}
                        onChange={onChange}
                        input={<OutlinedInput label="Service Expertise" />}
                        name="serviceExpertise"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {categories && categories.map((category) => (
                          <MenuItem key={category._id} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Address"
                      name="address"
                      value={address}
                      onChange={onChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={isLoading ? <CircularProgress size={24} /> : <SaveIcon />}
                    disabled={isLoading}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Vendor Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Business Name
                    </Typography>
                    <Typography variant="body1">{userInfo?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1">{userInfo?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {userInfo?.phone || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Years of Experience
                    </Typography>
                    <Typography variant="body1">
                      {userInfo?.yearsOfExperience || '0'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Service Area Pincodes
                    </Typography>
                    {userInfo?.pincodes && userInfo.pincodes.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {userInfo.pincodes.map((pincode, index) => (
                          <Chip key={index} label={pincode} size="small" color="primary" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1">No service areas specified</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      ID Proof Document
                    </Typography>
                    <Typography variant="body1">
                      {userInfo?.idProofDocument ? (
                        <Button 
                          variant="text" 
                          color="primary" 
                          component="a" 
                          href={userInfo.idProofDocument} 
                          target="_blank"
                          size="small"
                        >
                          View Document
                        </Button>
                      ) : (
                        'Not provided'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Service Expertise
                    </Typography>
                    {userInfo?.serviceExpertise && userInfo.serviceExpertise.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {userInfo.serviceExpertise.map((service, index) => (
                          <Chip key={index} label={service} size="small" color="secondary" variant="outlined" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1">Not specified</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Business Address
                    </Typography>
                    <Typography variant="body1">
                      {userInfo?.address || 'Not provided'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
          
          {/* Add Change Password Form */}
          <ChangePasswordForm />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;