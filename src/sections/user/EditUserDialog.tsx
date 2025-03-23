import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import axios from 'axios';

type UserProps = {
  id: string;
  email: string;
  role: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  giftpoints: number;
  nb_trashthorwed: number;
  avatarUrl: string;
  isbanned: boolean; 
};

type EditUserDialogProps = {
  open: boolean;
  onClose: () => void;
  user: UserProps;
  onSave: (updatedUser: UserProps) => void;
};

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        email: user.email,
        password: user.role,
        full_name: user.full_name,
      });
      setError('');
    }
  }, [open, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.email || !formData.password || !formData.full_name) {
      setError('All fields are required.');
      return;
    }

    try {
      await axios.put(`http://localhost:7001/api/users/${user.id}`, formData);
      onSave({ ...user, ...formData });
      onClose();
    } catch (e) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        {error && (
          <div style={{ color: 'red', marginTop: 8 }}>
            {error}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
