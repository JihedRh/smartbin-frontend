import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnalyticsWidgetSummary } from 'src/sections/overview/analytics-widget-summary';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import type { UserProps } from '../user-table-row';
import AddUserForm from './AddUserForm';
import Papa from 'papaparse';  


const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * 24) + 1;  
  return `../assets/images/avatar/avatar-${randomIndex}.webp`;
};

export function UserView() {
  const table = useTable();
  const [userCount, setUserCount] = useState(null); 
  const [binCount, setBinCount] = useState<number | null>(null);  
  const [filterName, setFilterName] = useState('');
  const [okBins, setOkBins] = useState<number | null>(null);
  const [noOkBins, setNoOkBins] = useState<number | null>(null);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [openAddForm, setOpenAddForm] = useState(false);

  const handleOpenAddForm = () => {
    setOpenAddForm(true);
  };
  useEffect(() => {
    const fetchBinCount = () => {
      axios.get('http://localhost:7001/api/bin-count')  
        .then(response => {
          setBinCount(response.data.count);  
        })
        .catch(error => {
          console.error('Error fetching bin count:', error);
        });
    };

    fetchBinCount();

    const interval = setInterval(fetchBinCount, 1000);  

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchUserCount = () => {
      axios.get('http://localhost:7001/api/user-count')
        .then(response => {
          setUserCount(response.data.count);
        })
        .catch(error => {
          console.error('Error fetching user count:', error);
        });
    };
  
    fetchUserCount();
  
    const interval = setInterval(fetchUserCount, 1000);
  
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchOkBins = () => {
      axios.get('http://localhost:7001/api/smart-bins/ok')
        .then(response => {
          setOkBins(response.data.count);  
        })
        .catch(error => {
          console.error('Error fetching bins with functionality ok:', error);
        });
    };


  
    const interval = setInterval(fetchOkBins, 1000);  
  
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchNoOkBins = () => {
      axios.get('http://localhost:7001/api/smart-bins/no-ok')
        .then(response => {
          setNoOkBins(response.data.count);  
        })
        .catch(error => {
          console.error('Error fetching bins with functionality no ok:', error);
        });
    };
  
    fetchNoOkBins();
  
    const interval = setInterval(fetchNoOkBins, 1000); 
  
    return () => clearInterval(interval);
  }, []);
  const handleCloseAddForm = () => {
    setOpenAddForm(false);
  };
  const handleExportCSV = () => {
    const csvData = Papa.unparse(users);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users_data.csv';
    link.click();
  };
  const handleAddTrashBin = () => {
    fetchUsers(); 
  };
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:7001/api/users');
      const updatedUsers = response.data.map((user: UserProps) => ({
        ...user,
        avatarUrl: `${getRandomAvatar()}`,
      }));
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleDelete = (userId: string) => {
    console.log(`Delete user with ID: ${userId}`);
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleDeleteMultiple = async () => {
    try {
      const selectedUserIds = table.selected; 
      const response = await axios.delete('http://localhost:7001/api/users', {
        data: { ids: selectedUserIds }
      });
  
      const remainingUsers = users.filter(user => !selectedUserIds.includes(user.id));
      setUsers(remainingUsers);
      table.onResetPage();
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };
  
  const handleFilter = () => {
    console.log('hedthy taw nzidoua ');
  };
  return (
    <DashboardContent maxWidth="xl" sx={{
      backgroundImage: 'url(/assets/bg_dashboard.jpg)',
      backgroundSize: 'cover', 
      backgroundPosition: 'center',  
      backgroundRepeat: 'no-repeat',
    
    }}>
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
    <Typography variant="h4" sx={{ color: 'white' }}>
      Users
    </Typography>
    <Button
      variant="contained"
      color="inherit"
      startIcon={<Iconify icon="mingcute:add-line" />}
      onClick={handleOpenAddForm}
    >
      New User
    </Button>
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

  <Grid container spacing={3} mb={5}>
    <Grid item xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="Total Smart Bins"
        percent={-0.1}
        total={binCount !== null ? binCount : 0}
        icon={<img alt="icon" src="/assets/icons/glass/garbage-bin-trash-bin-svgrepo-com.svg" />}
        chart={{
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          series: [22, 8, 35, 50, 82, 84, 77, 12],
        }}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="All Users"
        percent={-0.1}
        total={userCount !== null ? userCount : 0}
        color="secondary"
        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
        chart={{
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          series: [56, 47, 40, 62, 73, 30, 23, 54],
        }}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="Good Bins"
        percent={2.8}
        total={okBins !== null ? okBins : 0}
        color="warning"
        icon={<img alt="icon" src="/assets/icons/glass/garbage-bin-trash-bin-svgrepo-com.svg" />}
        chart={{
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          series: [40, 70, 50, 28, 70, 75, 7, 64],
        }}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="Stopped Bins"
        percent={3.6}
        total={noOkBins !== null ? noOkBins : 0}
        color="error"
        icon={<img alt="icon" src="/assets/icons/glass/stop-svgrepo-com.svg" />}
        chart={{
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          series: [56, 30, 23, 54, 47, 40, 62, 73],
        }}
      />
    </Grid>
  </Grid>

  <Card>
    <UserTableToolbar
      numSelected={table.selected.length}
      filterName={filterName}
      onFilterName={(event) => {
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
          <UserTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={users.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(checked, users.map((user) => user.id))
            }
            headLabel={[
              { id: 'full_name', label: 'Full Name' },
              { id: 'email', label: 'Email' },
              { id: 'role', label: 'Role' },
              { id: 'created_at', label: 'Created At' },
              { id: 'updated_at', label: 'Updated At' },
              { id: 'giftpoints', label: 'Gift Points' },

            ]}
          />
          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <UserTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onDelete={() => handleDelete(row.id)}
                />
              ))}
            <TableEmptyRows
              height={68}
              emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
            />
            {notFound && <TableNoData searchQuery={filterName} />}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>

    <TablePagination
      component="div"
      page={table.page}
      count={users.length}
      rowsPerPage={table.rowsPerPage}
      onPageChange={table.onChangePage}
      rowsPerPageOptions={[5, 10, 25]}
      onRowsPerPageChange={table.onChangeRowsPerPage}
    />
  </Card>

  <AddUserForm
    open={openAddForm}
    onClose={handleCloseAddForm}
    onAdd={handleAddTrashBin}
  />
</DashboardContent>

  );
}

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
