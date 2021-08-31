import React, { useContext, useEffect, useState } from 'react';
// React Components Imports
import {
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
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import OPTablePaginationActions from '../../common/OPTablePaginationActions';
import Alert from '@material-ui/lab/Alert/Alert';
import TimeSheetModal from './employee/TimeSheetModal';
import OPLoader from 'src/components/common/OPLoader';
import { EmployeeType } from 'src/types/project-manager/timesheet';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';
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
      fontWeight: theme.typography.fontWeightMedium,
    },
  }),
);

export default function EnhancedTable() {
  const {
    fetchAllTimesheet,
    setSelectedWeekData,
    fetchTasksAndTimehseets,
    fetchAllTasks,
    employeeList,
    isLoading,
    loading,
    setEmpId,
    setIsLoading,
    changeWeekData,
  } = useContext(MGRTimesheetContext);
  const classes = useStyles();

  // Table Data

  // interface Data {
  //   hours: number;
  //   timesheetNumber: string;
  //   totalCost: number;
  //   name: string;
  //   weekendingDate: string;
  //   approverName: string;
  //   lastModified: string;
  //   status: string;
  //   timePeriod: string;
  // }

  interface Data {
    name: string;
    experience: number;
    location: string;
    mobile: string;
    email: string;
    doj: string;
    employee_id: number;
  }

  // Function to reverse string
  function reverseString(str) {
    return str.split('-').reverse().join('-');
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    align?: string;
  }

  // const headCells: HeadCell[] = [
  //   {
  //     id: 'name',
  //     numeric: false,
  //     disablePadding: true,
  //     label: 'Name',
  //   },
  //   {
  //     id: 'timesheetNumber',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Timesheet Number',
  //   },
  //   {
  //     id: 'hours',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Total Timesheet Hours',
  //   },
  //   {
  //     id: 'totalCost',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Total TimeSheetCost',
  //   },
  //   {
  //     id: 'weekendingDate',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Weekending Date',
  //   },
  //   {
  //     id: 'approverName',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Timesheet Approver',
  //   },
  //   {
  //     id: 'lastModified',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Last Modified',
  //   },
  //   { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  //   {
  //     id: 'timePeriod',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Time Period',
  //   },
  // ];

  const headCells: HeadCell[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
      align: 'left',
    },
    {
      id: 'employee_id',
      numeric: false,
      disablePadding: false,
      label: 'Employee Id',
    },
    {
      id: 'email',
      numeric: true,
      disablePadding: false,
      label: 'Email',
      align: 'left',
    },
    {
      id: 'location',
      numeric: true,
      disablePadding: false,
      label: 'Location',
      align: 'left',
    },
    {
      id: 'mobile',
      numeric: false,
      disablePadding: false,
      label: 'Mobile',
    },
    {
      id: 'doj',
      numeric: false,
      disablePadding: false,
      label: 'Data of Joining',
    },
  ];

  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, employeeList.length - page * rowsPerPage);

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
  const [timeSheetModalOpened, setTimeSheetModalOpened] = useState<boolean>(
    false,
  );

  const [currentEmployee, setCurrentEmployee] = useState<EmployeeType>({
    user: {
      username: '',
    },
    employee_id: 0,
    id: '',
    project: {
      id: '',
    },
    profile: {
      firstname: '',
      lastname: '',
      doj: '',
      email: '',
      experience: 0,
      location: '',
      mobile: '',
    },
  });

  const fetchTasksAndTimesheets = async () => {
    // console.log('Employee Changed');
    setIsLoading(true);
    // @ts-ignore
    if (currentEmployee?.id.trim().length > 0) {
      // await fetchAllTasks();
      // @ts-ignore
      await fetchAllTimesheet(currentEmployee?.id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTasksAndTimesheets();
  }, [currentEmployee]);

  return (
    <div className={classes.root}>
      <OPLoader isLoading={loading} />
      <Paper className={classes.paper}>
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
                {/* <TableCell className={classes.tableHeadFont}>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            {employeeList.length > 0 && (
              <TableBody>
                {(rowsPerPage > 0
                  ? employeeList?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : employeeList
                )?.map((employee, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover key={index} tabIndex={-1}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='row'
                        align='left'
                        padding='default'>
                        <Typography
                          color='primary'
                          variant='body1'
                          onClick={async () => {
                            // @ts-ignore
                            setEmpId(employee?.id);
                            await setCurrentEmployee(employee);
                            await setSelectedWeekData(
                              getWeekData(new Date(), 7),
                            );
                            // await fetchTasksAndTimehseets();
                            setTimeSheetModalOpened(true);
                          }}>
                          <span
                            style={{
                              cursor: 'pointer',
                            }}
                            className={classes.hoverUnderline}>
                            {`${employee.profile?.firstname} ${employee?.profile?.lastname}`}
                          </span>
                        </Typography>
                      </TableCell>
                      <TableCell align='center'>
                        {employee.employee_id}
                      </TableCell>
                      <TableCell align='left'>
                        {employee?.profile?.email}
                      </TableCell>
                      <TableCell align='left'>
                        {employee?.profile?.location}
                      </TableCell>
                      <TableCell align='center'>
                        {employee?.profile?.mobile}
                      </TableCell>
                      <TableCell align='center'>
                        {moment(employee?.profile?.doj).format('DD MMM YYYY')}
                      </TableCell>{' '}
                      {/* <TableCell align='center'>28</TableCell>
                      <TableCell align='center'>6</TableCell>
                      <TableCell align='center'>2 Dec 2020</TableCell>
                      <TableCell align='center'>Ankit Sethi</TableCell>
                      <TableCell align='center'>2 Dec 2020</TableCell>
                      <TableCell align='center'>
                        <Alert icon={false} severity='success'>
                          APPROVED
                        </Alert>
                      </TableCell>

                      <TableCell align='center'>Weekly</TableCell> */}
                      {/* <TableCell align='center'></TableCell> */}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 81 * emptyRows }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            )}
            {employeeList.length === 0 && (
              <TableBody>
                <TableRow style={{ height: 81 * emptyRows }}>
                  <TableCell colSpan={7}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Typography variant='h4' color='primary'>
                        No data avaiable for the project
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
                  count={employeeList.length}
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
      <TimeSheetModal
        isOpen={timeSheetModalOpened}
        userData={currentEmployee}
        onClose={() => {
          setTimeSheetModalOpened(false);
        }}
      />
    </div>
  );
}
