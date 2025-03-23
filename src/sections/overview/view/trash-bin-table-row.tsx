import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';
import axios from 'axios';

// ----------------------------------------------------------------------

export type TrashBinProps = {
  id: string;
  fill_level: string;
  co2_level: string;
  temperature: string;
  humidity: string;
  statut: string;
  reference: string;
  functionality: string;
};

type TrashBinTableRowProps = {
  row: TrashBinProps;
  selected: boolean;
  onSelectRow: () => void;
  onDelete: (id: string) => void;
};

export function TrashBinTableRow({ row, selected, onSelectRow, onDelete }: TrashBinTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleRestore = async () => {
    try {
      await axios.post(`https://smartbin-backend.onrender.com/api/trashbin/restore/${row.id}`);
      enqueueSnackbar('Item restored successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error restoring item', { variant: 'error' });
    }
    handleClosePopover();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://smartbin-backend.onrender.com/api/trashbin/${row.id}`);
      onDelete(row.id);
      enqueueSnackbar('Item permanently deleted', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting item', { variant: 'error' });
    }
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.reference} src="/assets/icons/glass/garbage-bin-trash-bin-svgrepo-com.svg" />
            {row.reference}
          </Box>
        </TableCell>

        <TableCell>{row.statut}</TableCell>

        <TableCell>
          {/* Conditionally rendering the button based on row.functionality */}
          <button
            type="button"
            style={{
              backgroundColor: row.functionality === 'ok' ? 'green' : 'red',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            {row.functionality === 'ok' ? 'Good' : 'Bad'}
          </button>
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
          <MenuItem onClick={handleRestore}>
            <Iconify icon="solar:refresh-bold" />
            Restore
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
