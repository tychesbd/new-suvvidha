import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, reset } from '../../features/auth/authSlice';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  margin: 'auto',
  backgroundColor: theme.palette.error.main,
  fontSize: '3rem',
}));

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form data with user fields
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    address: userInfo?.address || '',
    pincode: userInfo?.pincode || ''
  });
  
  // Update form data when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        pincode: userInfo.pincode || ''
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && isEditing) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, isEditing]);

  const { name, email, phone, address, pincode } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      address: userInfo?.address || '',
      pincode: userInfo?.pincode || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      name,
      email,
      phone,
      address,
      pincode,
    };
    
    dispatch(updateProfile(userData));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Profile
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage your administrator account
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <StyledAvatar>
                <AdminPanelSettingsIcon fontSize="large" />
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
                color="error"
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
                  Edit Admin Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
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
                      label="Pincode"
                      name="pincode"
                      value={pincode}
                      onChange={onChange}
                      inputProps={{ maxLength: 6 }}
                      placeholder="Enter 6-digit pincode"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
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
                    color="error"
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
                  Admin Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
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
                      Role
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', color: 'error.main', fontWeight: 'bold' }}>
                      {userInfo?.role}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Pincode
                    </Typography>
                    <Typography variant="body1">
                      {userInfo?.pincode || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Address
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