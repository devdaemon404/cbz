import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// React Components Imports
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  TextField,
  Typography,
} from '@material-ui/core';
import months from '../../../utils/statics/months.json';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

// Icon Imports
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  People,
} from '@material-ui/icons';

import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
// import { TableViewStates } from './ManageDemand';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import { Alert } from '@material-ui/lab';
import PMDashboardSVG from 'src/components/common/svg/PMDashboardSVG';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import CAComplianceContext from 'src/contexts/client-admin/compliance/ca-cc-context';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { DropzoneArea as DropzoneAreaBase } from 'material-ui-dropzone';
import VendorsModal from './VendorsModal';

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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

export default function EnhancedTable() {
  const classes = useStyles();
  const {
    currentVendors,
    handleTableStatusChange,
    currentTableStatus,
    setModalOpen,
    currentMonth,
    handleMonthChange,
    currentYear,
    handleYearChange,
    getAllVendorDocuments,
    selectedDate,
    handleDateChange,
  } = useContext(CAComplianceContext);

  const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023'];
  interface Data {
    admins_username: string;
    name: string;
    email: string;
    created: string;
    status: string;
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    align?: string;
  }

  const headCells: HeadCell[] = [
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
      label: 'Name',
      align: 'left',
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
      align: 'left',
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: 'Created Date',
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
    },
  ];

  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, currentVendors.length - page * rowsPerPage);

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

  return (
    <div className={classes.root}>
      <Paper variant='outlined' className={classes.paper}>
        <Grid
          item
          container
          direction='row'
          alignItems='center'
          // style={{ marginTop: '-1rem' }}
          spacing={2}
          style={{ padding: '0.5rem' }}
          justify='flex-end'>
          <Grid item xs={1}>
            <FormControl
              variant='outlined'
              fullWidth
              size='small'
              // className={classes.formControl}>
            >
              <Select
                labelId='status'
                id='status'
                value={currentTableStatus}
                onChange={(e) => handleTableStatusChange(e.target.value)}>
                <MenuItem value='PENDING'>Pending</MenuItem>
                <MenuItem value='SUBMITTED'>Submitted</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <TextField
              id=''
              size='small'
              fullWidth
              select
              variant='outlined'
              value={currentMonth}
              onChange={(e) => handleMonthChange(e.target.value)}>
              {months.map((month) => (
                <MenuItem value={month.number}>{month.string}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2}>
            <TextField
              id=''
              size='small'
              select
              fullWidth
              variant='outlined'
              value={currentYear}
              onChange={(e) => handleYearChange(e.target.value)}>
              {years.map((year) => (
                <MenuItem value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
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
              </TableRow>
            </TableHead>
            {currentVendors.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? currentVendors.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : currentVendors
                ).map((d, index) => {
                  // const demand = d.demand;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={d.id}
                      // selected={isItemSelected}>
                    >
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='row'
                        align='left'>
                        <Typography
                          color='primary'
                          variant='body1'
                          onClick={async () => {
                            await getAllVendorDocuments(d.id);
                            await setModalOpen(true);
                          }}>
                          <span
                            style={{
                              cursor: 'pointer',
                            }}
                            className={classes.hoverUnderline}>
                            {d.admins_username}
                          </span>
                        </Typography>
                      </TableCell>
                      <TableCell align='left'>{d.name}</TableCell>
                      <TableCell align='left'>{d.email}</TableCell>
                      <TableCell align='center'>
                        {moment(d.created).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell align='center'>
                        {/* {d.status === 'OPEN' && ( */}
                        <Alert
                          icon={false}
                          severity={d.compliant ? 'info' : 'error'}
                          style={{ justifyContent: 'center' }}>
                          {d.compliant ? 'SUBMITTED' : 'PENDING'}
                        </Alert>
                        {/* )} */}
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
                        No Data available
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
                  rowsPerPageOptions={[7, 10, 25, { label: 'All', value: -1 }]}
                  count={currentVendors.length}
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
      <VendorsModal />
    </div>
  );
}
