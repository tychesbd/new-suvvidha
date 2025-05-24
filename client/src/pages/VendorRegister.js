import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { reset } from '../features/auth/authSlice';

// Neumorphic UI imports
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  Select,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Chip,
} from '../components/neumorphic';
import '../neumorphic.css'; // Ensure neumorphic styles are loaded

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    pincodes: [], // Changed to array for multiple pincodes
    yearsOfExperience: 0,
    serviceExpertise: [],
  });

  // State for file uploads
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPincode, setNewPincode] = useState('');

  const { name, email, password, confirmPassword, phone, address, pincodes, yearsOfExperience, serviceExpertise } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Fetch available services for the multi-select dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services');
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || userInfo) {
      // Redirect to home page after successful registration
      navigate('/');
      toast.success('Registration successful! Please wait for admin approval.');
    }

    dispatch(reset());
  }, [userInfo, isError, isSuccess, message, navigate, dispatch]); const onChange = (e) => {
    // Check if this is a direct value from select component
    if (Array.isArray(e)) {
      setFormData((prevState) => ({
        ...prevState,
        serviceExpertise: e
      }));
      return;
    }

    // Handle regular input change
    if (e && e.target) {
      const { name, value, type } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      // Add new files to existing files
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

      // Create preview URLs for new files
      const newPreviews = selectedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));

      setFilePreview(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  // Remove a file
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(filePreview[index].url);
    setFilePreview(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  // Handle adding a new pincode
  const handleAddPincode = () => {
    if (newPincode && newPincode.length === 6 && !pincodes.includes(newPincode)) {
      setFormData(prevState => ({
        ...prevState,
        pincodes: [...prevState.pincodes, newPincode]
      }));
      setNewPincode('');
    } else if (newPincode.length !== 6) {
      toast.error('Pincode must be 6 digits');
    } else if (pincodes.includes(newPincode)) {
      toast.error('Pincode already added');
    }
  };

  // Handle removing a pincode
  const handleRemovePincode = (pincode) => {
    setFormData(prevState => ({
      ...prevState,
      pincodes: prevState.pincodes.filter(p => p !== pincode)
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (files.length === 0) {
      toast.error('Please upload at least one ID proof document');
      setLoading(false);
      return;
    }

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('email', email);
      formDataToSend.append('password', password);
      formDataToSend.append('role', 'vendor');
      formDataToSend.append('phone', phone);
      formDataToSend.append('address', address);

      // Append pincodes as JSON string
      formDataToSend.append('pincodes', JSON.stringify(pincodes));

      formDataToSend.append('yearsOfExperience', yearsOfExperience);
      // Append service expertise as JSON string
      if (serviceExpertise && serviceExpertise.length > 0) {
        formDataToSend.append('serviceExpertise', JSON.stringify(serviceExpertise));
      }

      // Append all files
      files.forEach((file, index) => {
        formDataToSend.append('documents', file);
      });

      // Register the vendor
      const response = await axios.post('/api/users/vendor-register', formDataToSend);

      if (response.data) {
        toast.success('Registration successful! Please wait for admin approval.');
        navigate('/');
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingTop: '2rem', paddingBottom: '2rem', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/images/team/login.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Grid container spacing={3} style={{ flexGrow: 1, alignItems: 'stretch' }}>
        {/* Right Panel: Registration Form */}
        <Grid item xs={12} md={12}>
          <Card variant="convex" style={{ padding: '2rem' }}>
            <Box style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Link to="/">
                <img src="/logo1.png" alt="Suvvidha Logo" style={{ height: '60px', marginBottom: '16px', display: { xs: 'block', md: 'none' }, cursor: 'pointer' }} />
              </Link>
            </Box>
            <Typography variant="h4" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              Vendor Registration Form
            </Typography>
            <Divider style={{ marginBottom: '1.5rem' }} />

            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={onChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    value={yearsOfExperience}
                    onChange={onChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={address}
                    onChange={onChange}
                    fullWidth
                    required
                    style={{ marginBottom: '1rem' }}
                  />
                </Grid>

                {/* Multi-pincode input */}
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                    Service Pincodes
                  </Typography>
                  <Box style={{ display: 'flex', marginBottom: '1rem' }}>
                    <TextField
                      label="Add Pincode"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      style={{ flexGrow: 1, marginRight: '1rem' }}
                    />
                    <Button
                      variant="primary"
                      onClick={handleAddPincode}
                      style={{ minWidth: '100px' }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {pincodes.map((pincode, index) => (
                      <Chip
                        key={index}
                        label={pincode}
                        onDelete={() => handleRemovePincode(pincode)}
                        style={{ margin: '0.25rem' }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Service expertise selection */}
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                    Service Expertise
                  </Typography>                  <Select
                    multiple
                    name="serviceExpertise"
                    value={serviceExpertise}
                    onChange={onChange}
                    options={services.map(service => ({
                      value: service._id,
                      label: service.name
                    }))}
                    fullWidth
                    required
                    style={{ marginBottom: '1rem' }}
                  />
                </Grid>

                {/* Multi-file upload */}
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                    ID Proof Documents
                  </Typography>
                  <Box style={{
                    border: '2px dashed var(--primary-light)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    backgroundColor: 'rgba(108, 92, 231, 0.05)'
                  }}>
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="primary"
                        component="span"
                        style={{ marginBottom: '1rem' }}
                      >
                        Upload Documents
                      </Button>
                    </label>
                    <Typography variant="body2">
                      Upload ID proof, certificates, or any relevant documents (Max 5MB each)
                    </Typography>
                  </Box>

                  {/* File preview section */}
                  {filePreview.length > 0 && (
                    <Box style={{ marginBottom: '1.5rem' }}>
                      <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                        Uploaded Documents:
                      </Typography>
                      <Grid container spacing={2}>
                        {filePreview.map((file, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="flat" style={{ padding: '0.5rem', position: 'relative' }}>
                              {file.type.includes('image') ? (
                                <img
                                  src={file.url}
                                  alt={`Preview ${index}`}
                                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }}
                                />
                              ) : (
                                <Box style={{
                                  height: '120px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'var(--background-color)',
                                  borderRadius: 'var(--border-radius-sm)'
                                }}>
                                  <Typography variant="body2">{file.name}</Typography>
                                </Box>
                              )}
                              <Button
                                variant="error"
                                onClick={() => removeFile(index)}
                                style={{
                                  position: 'absolute',
                                  top: '0.5rem',
                                  right: '0.5rem',
                                  minWidth: 'auto',
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  padding: 0
                                }}
                              >
                                ×
                              </Button>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading || isLoading}
                style={{ marginTop: '2rem', padding: '1rem' }}
              >
                {(loading || isLoading) ? (
                  <>
                    <CircularProgress size="small" style={{ marginRight: '0.5rem' }} />
                    Registering...
                  </>
                ) : 'Register as Vendor'}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VendorRegister;