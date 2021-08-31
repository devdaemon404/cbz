import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// React Components Imports
import {
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

// Icon Imports
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';

import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
// import { TableViewStates } from './ManageDemand';
// import OPTablePaginationActions from '../common/OPTablePaginationActions';
import moment from 'moment';
import OPTablePaginationActions from './common/OPTablePaginationActions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
    },
    table: {
      minWidth: 750,
    },
    tableHeadFont: {
      fontWeight: 800,
      backgroundColor: theme.palette.secondary.light,
    },
    tableRow: {
      '&:focus': {},
      cursor: 'pointer',
    },
    hoverUnderline: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }),
);

export default function EnhancedTable({ clientId, id, userName }) {
  const classes = useStyles();
  const router = useRouter();

  // Table Data
  interface Role {
    id?: string;
    internal?: boolean;
    created?: string;
    updated?: string;
    role?: string;
  }

  interface Datum {
    id?: string;
    email?: string;
    created?: string;
    updated?: string;
    deleted?: boolean;
    enabled?: boolean;
    resetThePasswordRequired?: boolean;
    username?: string;
    name?: string;
    role?: string;
    firstname?: string;
    lastname?: string;
    roles: Role[];
    mobile?: string;
    department_name?: string;
  }

  interface API_DATA_TYPE {
    data: Datum[];
    code: number;
    time: string;
    success: boolean;
    records: number;
    ['correlation-id']: string;
  }

  // Function to reverse string
  function reverseString(str) {
    return str.split('-').reverse().join('-');
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Datum;
    label: string;
    numeric: boolean;
    align?: string;
  }

  const API_DATA: API_DATA_TYPE = {
    data: [
      {
        id: '607a9582a1c966159c65ccfd',
        email: 'peter@mailinator.com',
        created: '2021-04-17T13:30:02.675+05:30',
        updated: '2021-04-17T13:30:39.812+05:30',
        deleted: false,
        enabled: true,
        resetThePasswordRequired: false,
        username: 'peter@mailinator.com',
        firstname: 'Peter',
        lastname: 'Parker',
        roles: [
          {
            id: '5f884a9b861ccb715d47fd4b',
            internal: true,
            created: '2020-10-15T18:41:55.064+05:30',
            updated: '2020-10-15T18:41:55.064+05:30',
            role: 'CLIENT_ADMIN',
          },
        ],
      },
      {
        id: '607aea40a1c966159c65cd14',
        email: 'mj@mailinator.com',
        mobile: '8765432356',
        created: '2021-04-17T19:31:36.61+05:30',
        updated: '2021-04-17T19:53:08.714+05:30',
        deleted: false,
        enabled: true,
        resetThePasswordRequired: false,
        username: 'mj',
        firstname: 'Mary ',
        lastname: 'Jane',
        roles: [
          {
            id: '5f884aa9861ccb715d47fd4d',
            internal: true,
            created: '2020-10-15T18:42:09.649+05:30',
            updated: '2020-10-15T18:42:09.649+05:30',
            role: 'PROJECT_MANAGER',
          },
        ],
      },
      {
        id: '607aeb50a1c966159c65cd16',
        email: 'serpent@mailinator.com',
        mobile: '7654326787',
        created: '2021-04-17T19:36:08.741+05:30',
        updated: '2021-04-17T19:36:08.741+05:30',
        deleted: false,
        enabled: true,
        resetThePasswordRequired: true,
        username: 'tonyarc',
        firstname: 'Charles ',
        lastname: 'goyal',
        department_name: 'Peace',
        roles: [
          {
            id: '5fec7dc9252ea80619306126',
            internal: true,
            created: '2020-12-30T18:46:57.365+05:30',
            updated: '2020-12-30T18:46:57.365+05:30',
            role: 'VICE_PRESIDENT',
          },
        ],
      },
    ],
    code: 200,
    time: '2021-05-02T00:25:05.251+05:30',
    success: true,
    records: 3,
    'correlation-id': 'c80143a5-fcbf-4ba3-8e88-d44170ae8200',
  };

  const headCells: HeadCell[] = [
    {
      id: 'username',
      numeric: false,
      disablePadding: false,
      label: 'User Name',
      align: 'left',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Name',
      align: 'left',
    },
    {
      id: 'role',
      numeric: false,
      disablePadding: false,
      label: 'Role',
      align: 'left',
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: 'Created Date',
      align: 'left',
    },
    {
      id: 'enabled',
      numeric: false,
      disablePadding: false,
      label: 'Status',
      align: 'left',
    },
    {
      id: 'enabled',
      numeric: true,
      disablePadding: false,
      label: '',
      align: 'left',
    },
  ];

  const rows: any = API_DATA.data.map((data, iterator) => {
    return createData(data);
  });
  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Data format Coversion
  //ROWS
  function createData({
    id,
    email,
    created,
    updated,
    deleted,
    enabled,
    resetThePasswordRequired,
    username,
    firstname,
    lastname,
    roles,
    mobile,
    department_name,
  }: Datum) {
    return {
      id,
      username,
      name: `${firstname} ${lastname}`,
      role: roles[0].role,
      created,
      enabled,
      deleted,
      mobile,
      department_name,
    };
  }

  type Order = 'asc' | 'desc';
  const [order, setOrder] = React.useState<Order>('asc');

  const [orderBy, setOrderBy] = React.useState<keyof Datum>('firstname');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Datum,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE2(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

  return (
    <div className={classes.root}>
      <Paper variant='outlined' className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            aria-label='enhanced table'>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadFont} width={10}>
                  S.No.
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.align ? 'left' : 'center'}
                    className={classes.tableHeadFont}>
                    {headCell.label}
                  </TableCell>
                ))}
                <TableCell width={5} className={classes.tableHeadFont} />
              </TableRow>
            </TableHead>
            {rows.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : rows
                ).map((row, index) => {
                  console.log(row);
                  return (
                    <TableRow key={row.id}>
                      <TableCell component='th' scope='row'>
                        {row.username}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>
                        {moment(row.created).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell>
                        <FormControl
                          variant='outlined'
                          style={{ minWidth: 120 }}>
                          <Select
                            labelId='demo-simple-select-outlined-label'
                            id='demo-simple-select-outlined'
                            value={row.enabled ? 1 : 0}
                            // onChange={handleChange}
                          >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={0}>Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        {id !== row.id ? (
                          <>
                            {' '}
                            <Button
                              aria-controls='simple-menu'
                              aria-haspopup='true'
                              onClick={handleMenuClick}>
                              <MoreVertIcon />
                            </Button>
                            <Menu
                              id='simple-menu'
                              anchorEl={anchorEl}
                              keepMounted
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}>
                              <MenuItem onClick={handleMenuClose}>
                                Edit
                              </MenuItem>
                              <MenuItem onClick={handleMenuClose}>
                                Delete
                              </MenuItem>
                            </Menu>
                          </>
                        ) : (
                          <>
                            {' '}
                            <Button
                              aria-controls='simple-menu'
                              aria-haspopup='true'
                              onClick={handleMenuClick2}>
                              <MoreVertIcon />
                            </Button>
                            <Menu
                              id='simple-menu2'
                              anchorEl={anchorE2}
                              keepMounted
                              open={Boolean(anchorE2)}
                              onClose={handleMenuClose}>
                              <MenuItem onClick={handleMenuClose}>
                                Edit
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 81 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <Typography
                variant='h6'
                color='primary'
                align='center'
                style={{ padding: '1rem' }}>
                No Data Avaialable
              </Typography>
            )}

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={OPTablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
