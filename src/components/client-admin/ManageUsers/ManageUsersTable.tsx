import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
// React Components Imports
import {
  Button,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Paper,
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
import AddIcon from '@material-ui/icons/Add';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import ManageUsersModal from './ManageUsersModal';
// Icon Imports
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import moment from 'moment';
import {
  Datum,
  SelectedDataType,
} from 'src/types/response-types/client-admin/manage-users';
import CAManageUsersContext, {
  caManageUsersContextDefault,
  defaultSelectedRowData,
} from 'src/contexts/client-admin/manage-users/ca-manage-users-context';
import { getInitialRowState } from '@material-ui/data-grid';
import OPAreYouSure from 'src/components/common/OPAreYouSure';
import intervalToDuration from 'date-fns/intervalToDuration/index';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
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
    button: {
      margin: theme.spacing(1),
      borderRadius: 9999,
    },
  }),
);

interface HeadCell {
  disablePadding: boolean;
  id: keyof Datum;
  label: string;
  numeric: boolean;
  align?: string;
}

export default function EnhancedTable({ clientId, id, userName }) {
  const classes = useStyles();

  const {
    setModelOpen,
    role,
    setModalType,
    setSelectedRowData,
    API_DATA,
    toggleVendorState,
    deleteUser,
    deleteUserConfirmation,
    deleteUserConfirmed,
    selectedRowData,
    setDeleteUserConfirmation,
    openAreYouSure,
    setopenAreYouSure,
  } = useContext(CAManageUsersContext);

  const [anchorEl, setAnchorEl] = React.useState({});
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);
  const [rows, setRows] = React.useState(caManageUsersContextDefault.API_DATA);
  const [dialogType, setDialogType] = React.useState('new');

  // Page Refresh and Table Data Call
  const getData = async () => {
    let row = await API_DATA?.map((data, iterator) => {
      if (!data.deleted) {
        return createData({ ...data, count: iterator });
      } else {
        return;
      }
    });

    let filteredRows = row.filter(function (x) {
      return x !== undefined;
    });
    // @ts-ignore
    setRows(filteredRows);
    console.log(filteredRows);
  };

  useEffect(() => {
    getData();
    console.log('I refreshed');
  }, [API_DATA]);

  const headCells2: HeadCell[] = [
    {
      id: 'username',
      numeric: false,
      disablePadding: false,
      label: 'User Name',
      align: 'left',
    },
    {
      id: 'firstname',
      numeric: false,
      disablePadding: false,
      label: 'Name',
      align: 'left',
    },
    {
      id: 'created',
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
  ];

  const headCells1: HeadCell[] = [
    {
      id: 'username',
      numeric: false,
      disablePadding: false,
      label: 'User Name',
      align: 'left',
    },
    {
      id: 'firstname',
      numeric: false,
      disablePadding: false,
      label: 'Name',
      align: 'left',
    },
    {
      id: 'created',
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
      id: 'lastname',
      numeric: false,
      disablePadding: false,
      label: 'Status',
      // align: 'left',
    },
  ];

  // Toggle the user active state
  const toggleActiveInactive = () => {
    toggleVendorState(selectedRowData.id);
  };

  // delete user ``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
  const [userID, setUserID] = React.useState<string>('');
  const deleteUserEntry = () => {
    deleteUser(userID);
  };

  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows?.length - page * rowsPerPage);

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
    count,
  }: Datum) {
    return {
      id,
      count,
      email,
      username,
      firstname,
      lastname,
      name: `${firstname} ${lastname}`,
      role: roles[0].role,
      created,
      enabled,
      deleted,
      mobile,
      department_name,
    };
  }

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index,
  ) => {
    setAnchorEl({ ...anchorEl, [index]: event.currentTarget });
  };
  const handleMenuClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE2(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl({});
    setAnchorE2(null);
  };

  const handleClickOpen = () => {
    setModelOpen(true);
  };

  const closeAreYouSure = () => {
    setopenAreYouSure(false);
  };

  return (
    <div className={classes.root}>
      <OPAreYouSure
        children='You are about to delete a user'
        isOpen={deleteUserConfirmation}
        closeAreYouSure={deleteUserConfirmed}
        functionToCall={deleteUserEntry}
      />
      <OPAreYouSure
        children='You are about to change the activity state of a User'
        isOpen={openAreYouSure}
        closeAreYouSure={closeAreYouSure}
        functionToCall={toggleActiveInactive}
      />
      <ManageUsersModal />
      {role === 'CLIENT_ADMIN' && (
        <Button
          variant='contained'
          color='secondary'
          size='large'
          onClick={(e) => {
            handleClickOpen();
            setModalType('new');
            setSelectedRowData(defaultSelectedRowData);
          }}
          className={classes.button}
          startIcon={<AddIcon />}>
          New User
        </Button>
      )}
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
                {role === 'CLIENT_ADMIN'
                  ? headCells1.map((headCell, i) => (
                      <TableCell
                        key={i}
                        align={headCell.align ? 'left' : 'center'}
                        className={classes.tableHeadFont}>
                        {headCell.label}
                      </TableCell>
                    ))
                  : headCells2.map((headCell, i) => (
                      <TableCell
                        key={i}
                        align={headCell.align ? 'left' : 'center'}
                        className={classes.tableHeadFont}>
                        {headCell.label}
                      </TableCell>
                    ))}
                <TableCell width={5} className={classes.tableHeadFont} />
              </TableRow>
            </TableHead>
            {rows?.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? rows?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : rows
                ).map((row, index) => {
                  if (true) {
                    return (
                      <TableRow key={index}>
                        <TableCell component='th' scope='row'>
                          {/*  @ts-ignore */}
                          {row.count + 1}
                        </TableCell>
                        <TableCell component='th' scope='row'>
                          <b>{row.username}</b> <br />
                          <i>{row.email}</i>
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>
                          {moment(row.created).format('DD-MM-YYYY')}
                        </TableCell>
                        {role === 'CLIENT_ADMIN' && (
                          <>
                            <TableCell align='center'>
                              <FormControl
                                variant='outlined'
                                style={{ minWidth: 120 }}>
                                <Select
                                  labelId='demo-simple-select-outlined-label'
                                  id='demo-simple-select-outlined'
                                  value={row.enabled ? 1 : 0}
                                  disabled={id === row.id ? true : false}
                                  onChange={(e) => {
                                    setopenAreYouSure(true);
                                    setSelectedRowData(row);
                                  }}>
                                  <MenuItem value={1}>Active</MenuItem>
                                  <MenuItem value={0}>Inactive</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              {id !== row.id ? (
                                <>
                                  <IconButton
                                    aria-controls='simple-menu'
                                    aria-haspopup='true'
                                    onClick={(e) => handleMenuClick(e, index)}>
                                    <MoreVertIcon />
                                  </IconButton>
                                  <Menu
                                    id='simple-menu'
                                    anchorEl={anchorEl[index]}
                                    open={Boolean(anchorEl[index])}
                                    onClose={handleMenuClose}>
                                    <MenuItem
                                      onClick={(e) => {
                                        handleClickOpen();
                                        setModalType('edit');
                                        setSelectedRowData(row);
                                      }}>
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={(e) => {
                                        handleMenuClose();
                                        setUserID(row.id);
                                        setDeleteUserConfirmation(true);
                                      }}>
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <IconButton
                                    aria-controls='simple-menu'
                                    aria-haspopup='true'
                                    onClick={handleMenuClick2}>
                                    <MoreVertIcon />
                                  </IconButton>
                                  <Menu
                                    id='simple-menu2'
                                    anchorEl={anchorE2}
                                    keepMounted
                                    open={Boolean(anchorE2)}
                                    onClose={handleMenuClose}>
                                    <MenuItem
                                      onClick={(e) => {
                                        handleClickOpen();
                                        setModalType('edit');
                                        setSelectedRowData(row);
                                      }}>
                                      Edit
                                    </MenuItem>
                                  </Menu>
                                </>
                              )}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  }
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 81 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            ) : (
              // <Typography
              //   variant='h6'
              //   color='primary'
              //   align='center'
              //   style={{ padding: '1rem' }}>
              //   No Data Avaialable
              // </Typography>
              <TableBody>
                <TableRow style={{ height: 81 * emptyRows }}>
                  <TableCell colSpan={8}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Typography variant='h4' color='primary'>
                        No Data Avaialable
                      </Typography>
                      <NoDataSVG />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  count={rows?.length}
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
