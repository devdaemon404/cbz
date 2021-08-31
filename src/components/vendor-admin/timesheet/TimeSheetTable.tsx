import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  createStyles,
  lighten,
  makeStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DownloadIcon from '@material-ui/icons/ArrowDownward';
import OPWeekPicker from 'src/components/common/OPWeekPicker';
import OPLoader from 'src/components/common/OPLoader';
import TimeSheetModal from 'src/components/vendor-admin/timesheet/TimeSheetModal';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';
import { Alert as StyledAlert } from '@material-ui/lab';
import { Box, Button } from '@material-ui/core';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';

const Alert = withStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 'auto',
    },
  }),
)(StyledAlert);

interface Data {
  name: string;
  email: string;
  mobile: string;
  timesheetId: string;
  employeeId: string;
  id: string;
  projectId: string;
  status: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
    align: 'left',
  },
  {
    id: 'timesheetId',
    numeric: false,
    disablePadding: true,
    label: 'Timesheet ID',
  },

  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email',
    align: 'left',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
  },
  {
    id: 'mobile',
    numeric: false,
    disablePadding: true,
    label: 'Mobile Number',
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>,
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        <TableCell width={10}>S.No.</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align ? 'left' : 'center'}
            // align='center'
            // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              style={{ paddingLeft: `${headCell.align ? '0rem' : '2rem'}` }}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      // flex: '1 1 0',
      display: 'flex',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedRows: string[];
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedRows } = props;

  const { downloadTimesheet } = useContext(VATimesheetContext);

  const downloadSelectedTimesheets = () => {
    if (numSelected === 0) {
      OPToast.show('Please select an Employee to Download Timesheet', {
        variant: ToastVariant.INFO,
      });
    } else {
      downloadTimesheet(selectedRows);
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}>
      {numSelected > 0 ? (
        <>
          <Typography
            className={classes.title}
            color='inherit'
            variant='subtitle1'
            component='div'>
            {numSelected} row{`${numSelected === 1 ? '' : 's'}`} selected
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={downloadSelectedTimesheets}
            // className={classes.button}
            startIcon={<DownloadIcon />}>
            Timesheet
          </Button>
        </>
      ) : (
        <>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '1.2rem',
                paddingLeft: '.5rem',
              }}
              className={classes.title}>
              <Typography
                // className={classes.title}
                variant='h6'
                id='tableTitle'
                component='div'>
                Pick a Week
              </Typography>
              <OPWeekPicker />
            </div>
          </MuiPickersUtilsProvider>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={downloadSelectedTimesheets}
            // className={classes.button}
            startIcon={<DownloadIcon />}>
            Timesheet
          </Button>
        </>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },

    hoverUnderline: {
      '&:hover': {
        textDecoration: 'underline',
      },
      fontWeight: theme.typography.fontWeightMedium,
    },
  }),
);

const TimeSheetTable = () => {
  const classes = useStyles();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  // const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Data[]>([]);

  useEffect(() => {
    console.log('Selected Data: ', selected);
  }, [selected]);

  const {
    fetchAllTimesheet,
    fetchAllTasks,
    employeeList,
    vaTimesheetList,
    isLoading,
    loading,
    setEmpId,
    setIsLoading,
  } = useContext(VATimesheetContext);

  const makeRows = () => {
    let tempRows = vaTimesheetList.map((vaData) => {
      let name, email, mobile, timesheetId, id, employeeId, projectId, status;
      name = `${vaData.profileId.firstname} ${vaData.profileId.lastname}`;
      email = vaData.profileId.email;
      mobile = vaData.profileId.mobile;
      timesheetId = vaData.data[vaData.data.length - 1].id;
      status = vaData.data[vaData.data.length - 1].status;
      id = vaData._id;
      employeeId = vaData.employeeId;
      projectId = vaData.projectId;

      return {
        name,
        email,
        mobile,
        timesheetId,
        id,
        employeeId,
        projectId,
        status,
      };
    });
    // tempRows.push({
    //   name: 'Ankit',
    //   email: 'ankit.negi@gmail.com',
    //   mobile: '283948293428',
    //   timesheetId: '1394871029384791273049oihoh',
    //   id: '1234123412341234',
    //   employeeId: '23452345234523452',
    // });
    // tempRows.push({
    //   name: 'Sarthak',
    //   email: 'sarthak.s@gmail.com',
    //   mobile: '283948293428',
    //   timesheetId: '1394871029384791273049oihoh',
    //   id: '192837419273971029384',
    //   employeeId: '23452345234523452',
    // });
    // tempRows.push({
    //   name: 'Ashwin',
    //   email: 'ashwin.p@gmail.com',
    //   mobile: '283948293428',
    //   timesheetId: '1394871029384791273049oihoh',
    //   id: '1897348917239847998',
    //   employeeId: '23452345234523452',
    // });
    setRows([...tempRows]);
  };

  useEffect(() => {
    console.log('***************', vaTimesheetList);
    makeRows();
  }, [vaTimesheetList]);

  // console.log('VA Timesheet List: ', vaTimesheetList);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const [timeSheetModalOpened, setTimeSheetModalOpened] = useState<boolean>(
    false,
  );
  const [currentEmployee, setCurrentEmployee] = useState<string>('');

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <OPLoader isLoading={isLoading} />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedRows={selected}
        />
        <TableContainer style={{ borderTop: '1px solid lightgrey' }}>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            // size={dense ? 'small' : 'medium'}
            size='medium'
            aria-label='enhanced table'>
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            {vaTimesheetList.length > 0 && (
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}>
                        <TableCell padding='checkbox'>
                          <Checkbox
                            onClick={(event) => handleClick(event, row.id)}
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>

                        <TableCell align='left'>{index + 1}</TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          align='left'
                          scope='row'>
                          <Typography color='primary' variant='body1'>
                            <Tooltip title='Click to view timesheet.'>
                              <span
                                onClick={async () => {
                                  setIsLoading(true);
                                  await fetchAllTasks(row.projectId);
                                  setEmpId(row.employeeId);
                                  setCurrentEmployee(row.name);
                                  // await fetchAllTimesheet(
                                  //   row.projectId,
                                  //   row.employeeId,
                                  // );
                                  // setSelectedWeekData(
                                  //   getWeekData(new Date(), 7),
                                  // );
                                  setTimeSheetModalOpened(true);
                                  setIsLoading(false);
                                }}
                                style={{
                                  cursor: 'pointer',
                                }}
                                className={classes.hoverUnderline}>
                                {row.name}
                              </span>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>{row.timesheetId}</TableCell>

                        <TableCell align='left'>{row.email}</TableCell>
                        <TableCell align='center'>
                          <Alert icon={false} severity='info'>
                            {row.status}
                          </Alert>
                        </TableCell>
                        <TableCell align='center'>{row.mobile}</TableCell>
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
            {vaTimesheetList.length === 0 && (
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
                        No timesheet available for this week.
                        <br />
                        <b> Select different week.</b>
                      </Typography>
                      <NoDataSVG />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      /> */}
      <TimeSheetModal
        isOpen={timeSheetModalOpened}
        userData={currentEmployee}
        onClose={() => {
          setTimeSheetModalOpened(false);
        }}
      />
    </div>
  );
};

export default TimeSheetTable;
