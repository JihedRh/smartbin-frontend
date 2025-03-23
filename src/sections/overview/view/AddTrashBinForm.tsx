import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';

type AddTrashBinFormProps = {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
};

const AddTrashBinForm: React.FC<AddTrashBinFormProps> = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    reference: '',
    statut: '',
    functionality: '',
    type: '', // Add type to formData state
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post('https://smartbin-backend.onrender.com/api/smart-trash-bins', formData);
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding trash bin:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Add New Trash Bin</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">#</InputAdornment>,
                }}
                helperText="Enter the unique reference ID"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                fullWidth
                required
                helperText="Select the current status"
              >
                <MenuItem value="empty">Empty</MenuItem>
                <MenuItem value="almost full">Almost Full</MenuItem>
                <MenuItem value="full">Full</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Functionality"
                name="functionality"
                value={formData.functionality}
                onChange={handleChange}
                fullWidth
                required
                helperText="Select the operational state"
              >
                <MenuItem value="ok">Operational</MenuItem>
                <MenuItem value="no ok">Non-operational</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
                helperText="Select the type of trash bin"
              >
                <MenuItem value={1}>Operation Room Trash Bin</MenuItem>
                <MenuItem value={2}>Hall Room Trash Bin</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          Add Bin
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTrashBinForm;
