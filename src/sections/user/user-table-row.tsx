import { useSnackbar } from 'notistack';
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import axios from 'axios';
import EditUserDialog from './EditUserDialog';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  email: string;
  role: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  giftpoints: number;
  nb_trashthorwed: number;
  avatarUrl: string;
  isbanned: boolean; // true = banned, false = active
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, isbanned: boolean) => void;
};

export function UserTableRow({ row, selected, onSelectRow, onDelete, onStatusChange }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Local state for the banned status
  const [banned, setBanned] = useState(row.isbanned);

  // Poll the backend every second to get the latest banned status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`http://localhost:7001/api/users/${row.id}`);
        // Update the local state if there's a difference
        setBanned(prev => (data.isbanned !== prev ? data.isbanned : prev));
      } catch (error) {
        console.error('Error polling user status: ', error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [row.id]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    handleClosePopover();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:7001/api/users/${row.id}`);
      onDelete(row.id);
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting user', { variant: 'error' });
    }
    handleClosePopover();
  };

  // Toggle the banned status using the local state variable
  const handleToggleStatus = async () => {
    try {
      const updatedStatus = !banned;
      await axios.put(`http://localhost:7001/api/users/${row.id}/status`, { isbanned: updatedStatus });
      setBanned(updatedStatus);
      if (onStatusChange) {
        onStatusChange(row.id, updatedStatus);
      }
      enqueueSnackbar('User status updated', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleSaveUser = (updatedUser: UserProps) => {
    enqueueSnackbar('User updated successfully', { variant: 'success' });
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.full_name} src={row.avatarUrl} />
            {row.full_name}
          </Box>
        </TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.role}</TableCell>
        <TableCell>{row.created_at}</TableCell>
        <TableCell>{row.updated_at}</TableCell>
        <TableCell>{row.giftpoints}</TableCell>
        <TableCell>{row.nb_trashthorwed}</TableCell>

        {/* Status Button Cell */}
        <TableCell>
          <Button
            variant="contained"
            color={banned ? 'error' : 'success'}
            onClick={handleToggleStatus}
          >
            {banned ? 'Banned' : 'Active'}
          </Button>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleOpenEditDialog}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      {openEditDialog && (
        <EditUserDialog
          open={openEditDialog}
          user={row}
          onSave={handleSaveUser}
          onClose={() => setOpenEditDialog(false)}
        />
      )}
    </>
  );
}
