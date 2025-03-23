import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onFilter: () => void;
};

export function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onDelete,
  onFilter,
}: UserTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      {/* Filter input */}
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder="Filter by name"
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="ic:round-search" />
          </InputAdornment>
        }
        endAdornment={
          filterName && (
            <InputAdornment position="end">
              <IconButton onClick={() => onFilterName({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
                <Iconify icon="ic:round-close" />
              </IconButton>
            </InputAdornment>
          )
        }
        sx={{ width: 300 }}
      />

      {/* Delete button */}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      )}

      {/* Filter button */}
      <Tooltip title="Filter list">
        <IconButton onClick={onFilter}>
          <Iconify icon="ic:round-filter-list" />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
