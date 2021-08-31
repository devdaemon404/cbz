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

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

// Icon Imports
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';

import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
import { TableViewStates } from './ManageDemand';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import { Alert } from '@material-ui/lab';
import PMDashboardSVG from 'src/components/common/svg/PMDashboardSVG';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import { OPToast, ToastVariant } from 'src/utils/op-toast';

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

export default function EnhancedTable({
  tableViewState,
}: {
  tableViewState: TableViewStates;
}) {
  const classes = useStyles();
  const router = useRouter();
  const [selected, setSelected] = React.useState<string[]>([]);
  const {
    // demandsForProject: demands,
    demands,
    isLoading,
    checkRecruitment,
  } = useContext(VADemandContext);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // const handleStatusChange = (
  //   e: React.ChangeEvent<{
  //     name?: string | undefined;
  //     value: string | unknown;
  //   }>,
  //   id: string,
  // ) => {
  //   const { value } = e.target;
  //   const status = value;
  //   updateDemandStatus(id, status);
  // };

  // Table Data

  interface Data {
    request_id: string;
    name: string;
    startDate: string;
    profile_name: string;
    expense: string;
    quantity: string;
    status: string;
  }

  // // Function to reverse string
  // function reverseString(str) {
  //   return str.split('-').reverse().join('-');
  // }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    align?: string;
  }

  const headCells: HeadCell[] = [
    {
      id: 'request_id',
      numeric: false,
      disablePadding: false,
      label: 'Demand Id',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Name',
      align: 'left',
    },
    {
      id: 'startDate',
      numeric: false,
      disablePadding: false,
      label: 'Desired Start Date',
    },
    // {
    //   id: 'profile_name',
    //   numeric: false,
    //   disablePadding: false,
    //   label: 'Profile Name',
    //   align: 'left',
    // },
    // {
    //   id: 'expense',
    //   numeric: true,
    //   disablePadding: false,
    //   label: 'Rate Card',
    // },
    {
      id: 'quantity',
      numeric: true,
      disablePadding: false,
      label: 'Required Resource',
    },
    { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  ];

  const filterdDemands = demands.filter((d) => {
    return tableViewState === TableViewStates.OPEN_DEMANDS
      ? d.demand.status !== 'CLOSED' && d.demand.deleted !== true
      : d.demand.status === 'CLOSED' && d.demand.deleted !== true;
  });

  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filterdDemands.length - page * rowsPerPage);

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

  const [filterTerm, setFilterTerm] = useState('name');
  const [records, setRecords] = useState<Data[]>([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        console.log('filter term: ', filterTerm);
        if (target.value == '') return items;
        // else return items;
        else
          return items.filter((x) => {
            console.log(x);
            // return true;
            const term = x.demand[filterTerm].toString();
            return term.toLowerCase().includes(target.value);
          });
      },
    });
  };

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterTerm(event.target.value as string);
    const searchElement = document.getElementById('search-field');
    if (searchElement) {
      searchElement.focus();
    }
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
          justify='flex-end'>
          <Grid item xs={2}>
            <TextField
              variant='outlined'
              id='search-field'
              label='Search'
              size='small'
              onChange={handleSearch}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl
              variant='outlined'
              size='small'
              className={classes.formControl}>
              <InputLabel id='demo-simple-select-outlined-label'>
                Filter
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                value={filterTerm}
                onChange={handleFilterChange}
                label='Filter'>
                {headCells.map((headCell) => (
                  <MenuItem value={headCell.id}>{headCell.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
                <TableCell className={classes.tableHeadFont} align='center'>
                  Recruitment
                </TableCell>
              </TableRow>
            </TableHead>
            {filterdDemands.length > 0 ? (
              <TableBody>
                {filterFn
                  .fn(
                    rowsPerPage > 0
                      ? filterdDemands.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : filterdDemands,
                  )
                  .map((d, index) => {
                    const demand = d.demand;
                    const isItemSelected = isSelected(demand.name);

                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={demand.id}
                        selected={isItemSelected}>
                        <TableCell align='left'>{index + 1}</TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          align='left'>
                          <Typography
                            color={d.recruitment_id ? 'primary' : 'inherit'}
                            // color='primary'
                            variant='body1'
                            onClick={async () => {
                              if (d.recruitment_id) {
                                await router.push({
                                  pathname: `/app/vendor-admin/demand/[demandId]/[recruitment_id]`,
                                  query: {
                                    demandId: demand.id,
                                    recruitment_id: d.recruitment_id,
                                  },
                                });
                              }
                              // else {
                              //   console.log('Dalsdjfklasdj********', d.id);
                              //   await checkRecruitment(demand.id);
                              // }
                            }}>
                            {d.recruitment_id ? (
                              <span
                                style={{
                                  cursor: 'pointer',
                                }}
                                className={classes.hoverUnderline}>
                                {demand.request_id === undefined
                                  ? 'Field missing'
                                  : demand.request_id}
                              </span>
                            ) : (
                              demand.request_id
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell align='left'>{demand.name}</TableCell>
                        <TableCell align='center'>
                          {/* {moment(demand.startDate).format('DD MMM YYYY')} */}
                          {demand.startDate}
                        </TableCell>
                        {/* <TableCell align='center'>
                          {demand.profile_name}
                        </TableCell> */}
                        {/* <TableCell align='center'>{demand.expense}</TableCell> */}
                        <TableCell align='center'>{demand.quantity}</TableCell>
                        <TableCell align='center'>
                          {demand.status === 'OPEN' && (
                            <Alert icon={false} severity='success'>
                              OPEN
                            </Alert>
                          )}
                          {demand.status === 'CLOSED' && (
                            <Alert icon={false} severity='error'>
                              CLOSED
                            </Alert>
                          )}
                          {demand.status === 'HOLD' && (
                            <Alert icon={false} severity='warning'>
                              HOLD
                            </Alert>
                          )}
                          {demand.status === 'FILLED' && (
                            <Alert icon={false} severity='info'>
                              FILLED
                            </Alert>
                          )}
                          {demand.status === 'ACTIVE' && (
                            <Alert icon={false} severity='info'>
                              ACTIVE
                            </Alert>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          {d.recruitment_id ? (
                            <Alert
                              icon={false}
                              severity='success'
                              style={{ justifyContent: 'center' }}>
                              Started
                            </Alert>
                          ) : (
                            <Button
                              variant='contained'
                              color='primary'
                              onClick={async () => {
                                await checkRecruitment(demand.id);
                              }}>
                              Begin Recruitment
                            </Button>
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
              // <Typography
              //   variant='h6'
              //   color='primary'
              //   align='center'
              //   style={{ padding: '1rem' }}>
              //   {tableViewState === TableViewStates.OPEN_DEMANDS
              //     ? 'No open demands'
              //     : 'No closed demands'}
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
                        {tableViewState === TableViewStates.OPEN_DEMANDS
                          ? 'No open demands'
                          : 'No closed demands'}
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
                  count={filterdDemands.length}
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
