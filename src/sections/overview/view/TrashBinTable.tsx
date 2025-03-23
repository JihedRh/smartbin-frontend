import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { colors } from '@mui/material';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { TrashBinTableRow } from './trash-bin-table-row';
import { TrashBinTableHead } from './trash-bin-table-head';
import AddTrashBinForm from './AddTrashBinForm';
import { TrashBinTableToolbar } from './trash-bin-table-toolbar';
import { emptyRows, applyFilter, getComparator } from './utils';
import Papa from 'papaparse';  

type TrashBinProps = {
  id: string;
  fill_level: string;
  co2_level: string;
  temperature: string;
  humidity: string;
  statut: string;
  reference: string;
  functionality: string;
};

const TrashBinView = () => {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [trashBins, setTrashBins] = useState<TrashBinProps[]>([]);
  const [openAddForm, setOpenAddForm] = useState(false);

  const handleOpenAddForm = () => {
    setOpenAddForm(true);
  };

  const handleCloseAddForm = () => {
    setOpenAddForm(false);
  };

  const handleAddTrashBin = () => {
    fetchTrashBins(); 
  };

  const fetchTrashBins = useCallback(async () => {
    try {
      const response = await axios.get('https://smartbin-backend.onrender.com/api/smart-trash-bins');
      setTrashBins(response.data);
    } catch (error) {
      console.error('Error fetching trash bins:', error);
    }
  }, []);

  useEffect(() => {
    fetchTrashBins();
  }, [fetchTrashBins]);

  const dataFiltered = applyFilter({
    inputData: trashBins as TrashBinProps[], 
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleDelete = (trashBinId: string) => {
    console.log(`Delete trash bin with ID: ${trashBinId}`);
    setTrashBins(trashBins.filter((bin) => bin.id !== trashBinId));
  };

  const handleDeleteMultiple = async () => {
    try {
      const selectedTrashBinIds = table.selected;
      const response = await axios.delete('https://smartbin-backend.onrender.com/api/trashbins', {
        data: { ids: selectedTrashBinIds },
      });

      const remainingTrashBins = trashBins.filter(
        (bin) => !selectedTrashBinIds.includes(bin.id)
      );
      setTrashBins(remainingTrashBins);
      table.onResetPage();
    } catch (error) {
      console.error('Error deleting trash bins:', error);
    }
  };

  const handleFilter = () => {
    console.log('Filtering trash bins...');
  };

  // Function to export table data to CSV
  const handleExportCSV = () => {
    const csvData = Papa.unparse(trashBins);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'trash_bins_data.csv';
    link.click();
  };

  return (
    <DashboardContent sx={{ backgroundColor: colors.lime }}>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1} sx={{ mb: { xs: 3, md: 5 }, color: 'white' }}>
          Trash Bins
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddForm}
        >
          New Trash Bin
        </Button>
        {/* Add export button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:download-fill" />}
          onClick={handleExportCSV}
          sx={{ marginLeft: 2 }}
        >
          Export to CSV
        </Button>
      </Box>

      <Card>
        <TrashBinTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onDelete={handleDeleteMultiple}
          onFilter={handleFilter}
        />

        {table.selected.length > 0 && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteMultiple}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              Delete Selected
            </Button>
          </Box>
        )}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TrashBinTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={trashBins.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, trashBins.map((bin) => bin.id))
                }
                headLabel={[
                  { id: 'reference', label: 'Reference' },
                  { id: 'statut', label: 'Status' },
                  { id: 'functionality', label: 'Functionality' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <TrashBinTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}
                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, trashBins.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={trashBins.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <AddTrashBinForm
        open={openAddForm}
        onClose={handleCloseAddForm}
        onAdd={handleAddTrashBin}
      />
    </DashboardContent>
  );
};

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('full_name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

export default TrashBinView;
