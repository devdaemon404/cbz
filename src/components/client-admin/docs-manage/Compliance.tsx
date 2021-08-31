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
  Button,
} from '@material-ui/core';
import months from '../../../utils/statics/months.json';

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
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import { Alert } from '@material-ui/lab';
import PMDashboardSVG from 'src/components/common/svg/PMDashboardSVG';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import CAComplianceContext from 'src/contexts/client-admin/compliance/ca-cc-context';
import { ComplianceType } from 'src/types/client-admin/compliance';

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
  const router = useRouter();
  const {
    isLoading,
    // selectedDate,
    // handleDateChange,
    handleEdit,
    currentMonth,
    handleMonthChange,
    currentYear,
    handleYearChange,
    allCompliance,
    handleDelete,
    getPrevMonthDocs,
  } = useContext(CAComplianceContext);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023'];

  const handleDateChange = (d) => {
    console.log(d);
    setSelectedDate(d);
  };

  interface Data {
    doc_type: string;
    document_name: string;
    created_date: string;
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
      id: 'document_name',
      numeric: false,
      disablePadding: false,
      label: 'Document Name',
      align: 'left',
    },
    {
      id: 'doc_type',
      numeric: false,
      disablePadding: false,
      label: 'Document Type',
      align: 'left',
    },

    {
      id: 'created_date',
      numeric: false,
      disablePadding: false,
      label: 'Created Date',
    },
  ];

  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, allCompliance.length - page * rowsPerPage);

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
          spacing={2}
          style={{ padding: '.5rem' }}
          justify='flex-end'>
          {currentMonth === (new Date().getMonth() + 1).toString() &&
            currentYear === new Date().getFullYear().toString() && (
              <Grid item xs={7}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => getPrevMonthDocs()}
                  style={{ fontVariant: 'traditional' }}>
                  Get Previous Month Documents
                </Button>
              </Grid>
            )}

          <Grid item xs={3}>
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
                <TableCell width={5} className={classes.tableHeadFont} />
              </TableRow>
            </TableHead>
            {allCompliance.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? allCompliance.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : allCompliance
                ).map((d: ComplianceType, index) => {
                  return (
                    <TableRow hover tabIndex={-1}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell align='left'>{d.document_name}</TableCell>
                      <TableCell align='left'>{d.document_type}</TableCell>
                      <TableCell align='center'>
                        {moment(d.created).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell style={{ width: 20 }} align='right'>
                        {/* {userId !== data.id && ( */}
                        <PopupState variant='popover' popupId='table-popover'>
                          {(popupState) => (
                            <div>
                              <IconButton
                                color='primary'
                                {...bindTrigger(popupState)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'center',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'center',
                                }}>
                                <List>
                                  <ListItem
                                    button
                                    onClick={() => {
                                      handleEdit(d);
                                    }}>
                                    <ListItemIcon>
                                      <EditIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      id='switch-list-label-edit'
                                      primary='Edit'
                                    />
                                  </ListItem>
                                  <ListItem
                                    button
                                    onClick={() => {
                                      handleDelete(d.id);
                                    }}>
                                    <ListItemIcon>
                                      <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      id='switch-list-label-delete'
                                      primary='Delete'
                                    />
                                  </ListItem>
                                </List>
                              </Popover>
                            </div>
                          )}
                        </PopupState>
                        {/* )} */}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 81 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow style={{ height: 81 * emptyRows }}>
                  <TableCell colSpan={4}>
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
                  rowsPerPageOptions={[7, 10, 15, { label: 'All', value: -1 }]}
                  count={allCompliance.length}
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
