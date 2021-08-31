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
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert/Alert';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import ManageVendorsModal from './ManageVendorsModal';
// Icon Imports
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import {
  API_DATA_TYPE,
  Datum,
} from 'src/types/response-types/client-admin/manage-vendors';
import CAManageVendorsContext, {
  contactInfoDataDefault,
  defaultAPIDATA,
} from 'src/contexts/client-admin/manage-vendors/ca-manage-vendors-context';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import moment from 'moment';
import { type } from 'os';
import OPAreYouSure from 'src/components/common/OPAreYouSure';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';

interface HeadCell {
  disablePadding: boolean;
  id: keyof Datum;
  label: string;
  numeric: boolean;
  align?: string;
}

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

export default function EnhancedTable() {
  const classes = useStyles();
  const router = useRouter();
  const [rowsData, setRowsData] = React.useState<API_DATA_TYPE>(defaultAPIDATA);
  const [anchorEl, setAnchorEl] = React.useState({});
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);

  const {
    modelOpen,
    setModelOpen,
    modalType,
    setModalType,
    selectedRowData,
    setSelectedRowData,
    toggleVendorState,
    API_DATA,
    // @ts-ignore
    role,
    id,
  } = useContext(CAManageVendorsContext);

  React.useEffect(() => {
    setRowsData(API_DATA);
    console.log('I refreshed');
  }, [API_DATA]);

  // Table Data

  const headCells2: HeadCell[] = [
    {
      id: 'admins_username',
      numeric: false,
      disablePadding: false,
      label: 'User Name',
      align: 'left',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Vendor Name',
      align: 'left',
    },
    {
      id: 'admins_email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
      align: 'left',
    },
    {
      id: 'admins_email',
      numeric: false,
      disablePadding: false,
      label: 'Role',
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

  const headCells1: HeadCell[] = [
    {
      id: 'admins_username',
      numeric: false,
      disablePadding: false,
      label: 'User Name',
      align: 'left',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Vendor Name',
      align: 'left',
    },
    {
      id: 'admins_email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
      align: 'left',
    },
    {
      id: 'admins_email',
      numeric: false,
      disablePadding: false,
      label: 'Role',
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: 'Created Date',
      align: 'left',
    },
  ];

  const rows: any = API_DATA?.map((data, iterator) => {
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
    name,
    created,
    updated,
    enabled,
    deleted,
    email,
    mobile,
    client_id,
    vendor_admin_user_id,
    admins_first_name,
    admins_last_name,
    admins_mobile,
    admins_email,
    admins_username,
    role = 'VENDOR_ADMIN',
  }: Datum) {
    return {
      id,
      email,
      admins_username,
      admins_first_name,
      admins_last_name,
      name,
      role,
      created,
      enabled,
      deleted,
      mobile,
      client_id,
      vendor_admin_user_id,
      admins_mobile,
      admins_email,
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

  const [action, setAction] = React.useState({
    id: '',
    action: '',
  });

  const [open, setOpen] = React.useState<boolean>(false);
  const CloseYouSure = () => {
    setOpen(false);
  };

  const changeState = () => {
    toggleVendorState(action.id, action.action);
  };

  return (
    <div className={classes.root}>
      <OPAreYouSure
        isOpen={open}
        functionToCall={changeState}
        closeAreYouSure={CloseYouSure}
        children={
          action.action === 'enabled'
            ? 'You are about to change the state of the vendor'
            : ' You are about to delete a vendor'
        }
      />
      <ManageVendorsModal
        type={modalType}
        open={modelOpen}
        setOpen={setModelOpen}
        selected={selectedRowData}
      />
      {role === 'CLIENT_ADMIN' && (
        <Button
          variant='contained'
          color='secondary'
          size='large'
          onClick={(e) => {
            handleClickOpen();
            setModalType('new');
            setSelectedRowData(contactInfoDataDefault);
          }}
          className={classes.button}
          startIcon={<AddIcon />}>
          New Vendor
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
                {role !== 'CLIENT_ADMIN'
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
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell component='th' scope='row'>
                        {row.admins_username}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.admins_email}</TableCell>
                      <TableCell>
                        <Alert
                          icon={false}
                          severity='info'
                          style={{ justifyContent: 'center' }}>
                          {row.role}
                        </Alert>
                      </TableCell>

                      <TableCell>
                        {moment(row.created).format('DD-MM-YYYY')}
                      </TableCell>

                      {role === 'CLIENT_ADMIN' && (
                        <>
                          <TableCell>
                            <FormControl
                              variant='outlined'
                              style={{ minWidth: 120 }}>
                              <Select
                                labelId='demo-simple-select-outlined-label'
                                id='demo-simple-select-outlined'
                                value={row.enabled ? 1 : 0}
                                onChange={(e) => {
                                  setOpen(true);

                                  setAction({ id: row.id, action: 'enabled' });
                                }}>
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={0}>Inactive</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <Button
                              aria-controls='simple-menu'
                              aria-haspopup='true'
                              onClick={(e) => {
                                handleMenuClick(e, index);
                              }}>
                              <MoreVertIcon />
                            </Button>
                            <Menu
                              id='simple-menu'
                              anchorEl={anchorEl[index]}
                              keepMounted
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
                                  setOpen(true);
                                  setAction({ id: row.id, action: 'deleted' });
                                  handleMenuClose();
                                }}>
                                Delete
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </>
                      )}
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
              // <Typography
              //   variant='h6'
              //   color='primary'
              //   align='center'
              //   style={{ padding: '1rem' }}>
              //   No Data Avaialable
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
              // </Typography>
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
