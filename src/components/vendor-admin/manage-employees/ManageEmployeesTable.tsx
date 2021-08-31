import React, { useContext, useEffect } from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { useRouter } from 'next/router';

// React Components Imports
import {
  Button,
  Menu,
  MenuItem,
  Paper,
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

// Icon Imports
import {
  CompassCalibrationOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';

import moment from 'moment';
import { Alert } from '@material-ui/lab';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import VAManageEmployeeContext from 'src/contexts/vendor-admin/manage-employee/va-me-context';
import EnterUserNameDialog from './EnterUserNameDialog';

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

export default function EnhancedTable() {
  const classes = useStyles();
  const { employeeData, initiateOnboarding, getLoginCred } = useContext(
    VAManageEmployeeContext,
  );
  const [username, setUsername] = React.useState<string>('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<RowDataType[] | any>([]);

  interface Data {
    name: string;
    email: string;
    mobile: string;
    serial: number;
    id: string;
    created: Date | string;
    profile_status: string;
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    align?: string;
  }
  interface RowDataType {
    name: string;
    email: string;
    mobile: string;
    serial: number;
    id: string;
    created: Date | string;
    profile_status: string;
  }

  const headCells: HeadCell[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
      align: 'left',
    },

    {
      id: 'email',
      numeric: false,
      disablePadding: true,
      label: 'Email',
      align: 'left',
    },

    {
      id: 'mobile',
      numeric: false,
      disablePadding: true,
      label: 'Mobile Number',
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: true,
      label: 'Date of Joining',
    },
    {
      id: 'profile_status',
      numeric: false,
      disablePadding: true,
      align: 'left',

      label: 'Status',
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: true,
      label: '',
    },
  ];

  // dummy Data and row creation
  const makeRows = async () => {
    const dummy = employeeData;

    interface UserMetadata {
      deleted?: boolean;
      email?: string;
      enabled?: boolean;
      resetThePasswordRequired?: boolean;
      user_id?: string;
      username?: string;
      vendor_id?: string;
    }

    let tempRows = dummy.map((vaData, iterator) => {
      let name: string,
        email: string,
        mobile: string,
        created: string,
        serial: number,
        id: string,
        username: string,
        profile_status: boolean,
        user_metadata: undefined | UserMetadata;

      // console.log(vaData.user_metadata);
      name = `${vaData.firstname} ${vaData.lastname}`;
      username = `${vaData.firstname}_${vaData.lastname}`;
      email = vaData.email;
      mobile = vaData.mobile;
      serial = iterator + 1;
      user_metadata = vaData?.user_metadata;
      profile_status = vaData?.user_metadata?.enabled || false;
      id = vaData.id;
      created = vaData?.created;
      return {
        name,
        email,
        mobile,
        serial,
        user_metadata,
        id,
        created,
        username,
        profile_status,
      };
    });

    setRows([...tempRows]);
  };

  useEffect(() => {
    makeRows();
  }, [employeeData]);

  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = React.useState({});

  const [profileId, setProfileId] = React.useState<string>('');

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

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index,
  ) => {
    setAnchorEl({ ...anchorEl, [index]: event.currentTarget });
  };

  const handleMenuClose = () => {
    setAnchorEl({});
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitClose = () => {
    handleClose();
    getLoginCred(profileId, username);
  };

  return (
    <div className={classes.root}>
      <EnterUserNameDialog
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        handleSubmitClose={handleSubmitClose}
        open={open}
        username={username}
        setUsername={setUsername}
      />
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
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.created}>
                      <TableCell align='left'>{index + 1}</TableCell>

                      <TableCell align='left'>{row.name || '-'}</TableCell>

                      <TableCell align='left'>{row.email || '-'}</TableCell>
                      <TableCell align='center'>{row.mobile || '-'}</TableCell>
                      <TableCell align='center'>
                        {moment(row.created).format('DD-MM-YYYY') || '-'}
                      </TableCell>

                      <TableCell>
                        {row.profile_status ? (
                          <Alert icon={false} color='success'>
                            Active
                          </Alert>
                        ) : (
                          <Alert icon={false} color='error'>
                            Not Active
                          </Alert>
                        )}
                      </TableCell>

                      <TableCell>
                        <>
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
                            {console.log('ROW METADATA', row.user_metadata)}
                            {row.user_metadata !== undefined ? (
                              <MenuItem
                                onClick={(e) => {
                                  handleMenuClose();
                                  window.open(
                                    `/app/vendor-admin/employee/onboarding/${row.id}`,
                                  );
                                }}>
                                <VisibilityIcon /> &nbsp; View Profile
                              </MenuItem>
                            ) : (
                              <>
                                <MenuItem
                                  onClick={(e) => {
                                    handleMenuClose();
                                    initiateOnboarding(row.id);
                                  }}>
                                  <AccessTimeIcon /> &nbsp; Initiate Onboarding
                                </MenuItem>

                                <MenuItem
                                  onClick={(e) => {
                                    handleMenuClose();
                                    setProfileId(row.id);
                                    setOpen(true);
                                  }}>
                                  <VpnKeyIcon /> &nbsp; Get Login Credentials
                                </MenuItem>
                              </>
                            )}
                          </Menu>
                        </>
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
                No Employee Found
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
