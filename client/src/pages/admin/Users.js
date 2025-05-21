import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
  DashboardTile
} from '../../components/neumorphic';

import {
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Users = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // State for users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for user detail dialog
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // State for action feedback
  const [actionFeedback, setActionFeedback] = useState({ message: '', severity: 'success', show: false });

  const { createNeumorphicStyle } = theme;

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setError(null);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchUsers();
  }, [userInfo, fetchUsers]);

  // Handle pagination changes
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(value);
    setPage(0);
  };

  // Handle search and filter changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  // Handle user detail dialog
  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/users/${userToDelete._id}`, config);
      
      // Update users list by removing the deleted user
      setUsers(users.filter(user => user._id !== userToDelete._id));
      
      // Show feedback message
      setActionFeedback({
        message: 'User deleted successfully',
        severity: 'success',
        show: true
      });

      // Close the dialog
      setDeleteDialogOpen(false);
      setUserToDelete(null);

      // Hide feedback after 3 seconds
      setTimeout(() => {
        setActionFeedback({ ...actionFeedback, show: false });
      }, 3000);

    } catch (error) {
      setActionFeedback({
        message: error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to delete user',
        severity: 'error',
        show: true
      });

      // Hide feedback after 3 seconds
      setTimeout(() => {
        setActionFeedback({ ...actionFeedback, show: false });
      }, 3000);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Handle block/unblock user
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/users/${userId}/toggle-status`,
        { status: !currentStatus },
        config
      );

      // Update users list with the updated user
      setUsers(users.map(user => user._id === userId ? { ...user, isActive: data.isActive } : user));
      
      // Show feedback message
      setActionFeedback({
        message: `User ${data.isActive ? 'unblocked' : 'blocked'} successfully`,
        severity: 'success',
        show: true
      });

      // If the user detail dialog is open and it's the same user, update the selected user
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, isActive: data.isActive });
      }

      // Hide feedback after 3 seconds
      setTimeout(() => {
        setActionFeedback({ ...actionFeedback, show: false });
      }, 3000);

    } catch (error) {
      setActionFeedback({
        message: error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update user status',
        severity: 'error',
        show: true
      });

      // Hide feedback after 3 seconds
      setTimeout(() => {
        setActionFeedback({ ...actionFeedback, show: false });
      }, 3000);
    }
  };

  // Filter users based on search term and filters
  const filteredUsers = Array.isArray(users) ? users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'blocked' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  }) : [];

  // Get current page of users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" gap={2} p={2}>
        <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: '1rem' }}>
          Users Management
        </Typography>

        {/* Feedback Alert */}
        {actionFeedback.show && (
          <Alert 
            severity={actionFeedback.severity} 
            style={{ marginBottom: '1rem' }}
            onClose={() => setActionFeedback({ ...actionFeedback, show: false })}
          >
            {actionFeedback.message}
          </Alert>
        )}

        {/* Search and Filters */}
        <Card variant="flat" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <SearchBar
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={handleSearchChange}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                options={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'vendor', label: 'Vendor' },
                  { value: 'customer', label: 'Customer' }
                ]}
                value={roleFilter}
                onChange={handleRoleFilterChange}
                label="Role"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'blocked', label: 'Blocked' }
                ]}
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                fullWidth
                variant="primary"
                onClick={fetchUsers}
                style={{ height: '100%', minHeight: '42px' }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Users Table */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress size="large" />
          </Box>
        ) : error ? (
          <Alert severity="error" style={{ margin: '1rem 0' }}>
            {error}
          </Alert>
        ) : (
          <Card variant="flat" style={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell header>Name</TableCell>
                    <TableCell header>Email</TableCell>
                    <TableCell header>Role</TableCell>
                    <TableCell header>Joined Date</TableCell>
                    <TableCell header>Status</TableCell>
                    <TableCell header align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            variant={
                              user.role === 'admin' 
                                ? 'error' 
                                : user.role === 'vendor' 
                                  ? 'warning' 
                                  : 'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.isActive ? 'Active' : 'Blocked'}
                            variant={user.isActive ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="text"
                            onClick={() => handleOpenDialog(user)}
                            title="View Details"
                            style={{ marginRight: '0.5rem' }}
                          >
                            <VisibilityIcon style={{ fontSize: '1.25rem' }} />
                          </Button>
                          <Button
                            variant={user.isActive ? 'error' : 'success'}
                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            title={user.isActive ? 'Block User' : 'Unblock User'}
                            disabled={user.role === 'admin' && userInfo._id === user._id}
                            style={{ marginRight: '0.5rem' }}
                          >
                            {user.isActive ? (
                              <BlockIcon style={{ fontSize: '1.25rem' }} />
                            ) : (
                              <CheckCircleIcon style={{ fontSize: '1.25rem' }} />
                            )}
                          </Button>
                          <Button
                            variant="error"
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                            disabled={user.role === 'admin' && userInfo._id === user._id}
                          >
                            <DeleteIcon style={{ fontSize: '1.25rem' }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color={colors.text.secondary}>
                          No users found matching the criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Pagination Controls */}
              {paginatedUsers.length > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  style={{ borderTop: `1px solid ${colors.border}` }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color={colors.text.secondary}>
                      Rows per page:
                    </Typography>
                    <Select
                      options={[
                        { value: 5, label: '5' },
                        { value: 10, label: '10' },
                        { value: 25, label: '25' },
                        { value: 50, label: '50' }
                      ]}
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      style={{ minWidth: '80px' }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color={colors.text.secondary}>
                      {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length}`}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="text"
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => handleChangePage(page + 1)}
                        disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </TableContainer>
          </Card>
        )}

        {/* User Details Modal */}
        <Modal
          open={openDialog}
          onClose={handleCloseDialog}
          title={
            <>
              User Details
              {selectedUser && (
                <Chip 
                  label={selectedUser.isActive ? 'Active' : 'Blocked'}
                  variant={selectedUser.isActive ? 'success' : 'error'}
                  size="small"
                  style={{ marginLeft: '0.5rem' }}
                />
              )}
            </>
          }
          maxWidth="md"
        >
          {selectedUser && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color={colors.text.secondary}>
                    Name
                  </Typography>
                  <Typography>{selectedUser.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color={colors.text.secondary}>
                    Email
                  </Typography>
                  <Typography>{selectedUser.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color={colors.text.secondary}>
                    Role
                  </Typography>
                  <Typography>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color={colors.text.secondary}>
                    Joined Date
                  </Typography>
                  <Typography>
                    {formatDate(selectedUser.createdAt)}
                  </Typography>
                </Grid>

                {selectedUser.phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color={colors.text.secondary}>
                      Phone
                    </Typography>
                    <Typography>{selectedUser.phone}</Typography>
                  </Grid>
                )}

                {selectedUser.address && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color={colors.text.secondary}>
                      Address
                    </Typography>
                    <Typography>{selectedUser.address}</Typography>
                  </Grid>
                )}

                {/* Vendor-specific information */}
                {selectedUser.role === 'vendor' && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                        Vendor Information
                      </Typography>
                      <Divider />
                    </Grid>

                    {selectedUser.yearsOfExperience !== undefined && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color={colors.text.secondary}>
                          Years of Experience
                        </Typography>
                        <Typography>
                          {selectedUser.yearsOfExperience || '0'} years
                        </Typography>
                      </Grid>
                    )}

                    {selectedUser.pincode && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color={colors.text.secondary}>
                          Pincode
                        </Typography>
                        <Typography>{selectedUser.pincode}</Typography>
                      </Grid>
                    )}

                    {selectedUser.serviceExpertise && selectedUser.serviceExpertise.length > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color={colors.text.secondary}>
                          Service Expertise
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {selectedUser.serviceExpertise.map((service, index) => (
                            <Chip 
                              key={index} 
                              label={service} 
                              variant="primary"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}

                    {selectedUser.idProofDocument && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color={colors.text.secondary}>
                          ID Proof Document
                        </Typography>
                        <Box display="flex" gap={2} mt={1}>
                          <Button
                            variant="primary"
                            size="small"
                            component="a"
                            href={selectedUser.idProofDocument}
                            download={`ID_Proof_${selectedUser.name.replace(/\s+/g, '_')}.${selectedUser.idProofDocument.split('.').pop()}`}
                          >
                            <DownloadIcon style={{ marginRight: '0.5rem' }} />
                            Download Document
                          </Button>
                          <Button
                            variant="secondary"
                            size="small"
                            component="a"
                            href={selectedUser.idProofDocument}
                            target="_blank"
                          >
                            View Document
                          </Button>
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color={colors.text.secondary} mt={1}>
                        Vendor Status
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <Chip
                          label={selectedUser.isActive ? 'Active Vendor' : 'Inactive Vendor'}
                          variant={selectedUser.isActive ? 'success' : 'error'}
                          size="small"
                          style={{ marginRight: '0.5rem' }}
                        />
                        <Typography variant="body2" color={colors.text.secondary}>
                          {selectedUser.isActive
                            ? 'This vendor can currently provide services to customers.'
                            : 'This vendor is currently blocked from providing services.'}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color={colors.text.secondary}>
                    Last Updated
                  </Typography>
                  <Typography>
                    {formatDate(selectedUser.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button
                  variant={selectedUser.isActive ? 'error' : 'success'}
                  onClick={() => {
                    handleToggleUserStatus(selectedUser._id, selectedUser.isActive);
                    handleCloseDialog();
                  }}
                  disabled={selectedUser.role === 'admin' && userInfo._id === selectedUser._id}
                >
                  {selectedUser.isActive ? 'Block User' : 'Unblock User'}
                </Button>
                <Button variant="text" onClick={handleCloseDialog}>
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          title="Confirm Delete"
          maxWidth="sm"
        >
          {userToDelete && (
            <Box>
              <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                Are you sure you want to delete the user <strong>{userToDelete.name}</strong>?
              </Typography>
              <Typography variant="body2" color={colors.text.secondary} style={{ marginBottom: '1rem' }}>
                This action cannot be undone. All data associated with this user will be permanently removed from the system.
              </Typography>
              
              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button
                  variant="error"
                  onClick={confirmDeleteUser}
                >
                  Delete User
                </Button>
                <Button variant="text" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Modal>
      </Box>
    </Container>
  );
};

export default Users;