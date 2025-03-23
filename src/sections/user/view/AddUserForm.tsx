import React, { useState, forwardRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  InputAdornment,
  Slide,
  SlideProps,
} from '@mui/material';
import axios from 'axios';

// Transition Component for Slide Effect
const Transition = forwardRef<unknown, SlideProps>((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

type AddUserFormProps = {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
};

const AddUserForm: React.FC<AddUserFormProps> = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    giftpoints: 0,
    nb_trashthrown: 0,
    smart_bin_id: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    role: 'user', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:7001/api/users', formData);
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Add New User</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                helperText="Enter the user's email"
                InputProps={{
                  startAdornment: <InputAdornment position="start">@</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                helperText="Enter the user's password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                fullWidth
                required
                helperText="Enter the user's full name"
              />
            </Grid>
            {/* New Role Select Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                required
                helperText="Select the user's role"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" onClick={handleSubmit}>
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserForm;
