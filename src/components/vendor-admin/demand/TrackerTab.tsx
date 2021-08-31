import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  createStyles,
  lighten,
  makeStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import moment from 'moment';
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
import AddIcon from '@material-ui/icons/Add';
import ShareIcon from '@material-ui/icons/Share';
import OPWeekPicker from 'src/components/common/OPWeekPicker';
import OPLoader from 'src/components/common/OPLoader';
import TimeSheetModal from 'src/components/vendor-admin/timesheet/TimeSheetModal';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';
import { Alert as StyledAlert } from '@material-ui/lab';
import { Box, Button } from '@material-ui/core';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import ProfileModal from './profile-modal/ProfileModal';
import { VAProfileDataType } from '../../../types/project-manager/demand';

const Alert = withStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 'auto',
    },
  }),
)(StyledAlert);

interface Data {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  experience: string;
  submittedDate: string;
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

function stableSort(array, comparator: (a, b) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
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
    label: 'Candidate Name',
    align: 'left',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email Id',
    align: 'left',
  },
  {
    id: 'contactNumber',
    numeric: false,
    disablePadding: true,
    label: 'Contact Number',
  },
  {
    id: 'experience',
    numeric: false,
    disablePadding: true,
    label: 'Experience',
  },
  {
    id: 'submittedDate',
    numeric: false,
    disablePadding: true,
    label: 'Submitted Date',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
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
      <TableRow style={{ backgroundColor: '#E1EBF2' }}>
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
            {/* <TableSortLabel
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
            </TableSortLabel> */}
            {headCell.label}
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
      justifyContent: 'center',
      alignItems: 'center',
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

  const { handleModal, shareProfiles } = useContext(VADemandContext);

  const handleShare = () => {
    shareProfiles(selectedRows);
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
          <Button variant='contained' color='primary' onClick={handleShare}>
            <ShareIcon />
            Share
          </Button>
          <Button
            variant='contained'
            color='primary'
            // size='small'
            onClick={() => handleModal(true, 'Create Profile')}
            // onClick={() => setOpenModal(true)}
            // className={classes.button}
            startIcon={<AddIcon />}>
            Add Profile
          </Button>
        </>
      ) : (
        <>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div
              // style={{
              //   display: 'flex',
              //   flexDirection: 'column',
              //   paddingBottom: '1.2rem',
              //   paddingLeft: '.5rem',
              // }}
              className={classes.title}>
              <Typography
                // className={classes.title}
                variant='h6'
                id='tableTitle'
                component='div'>
                Profile List
              </Typography>
              {/* <OPWeekPicker /> */}
            </div>
          </MuiPickersUtilsProvider>
          <Button
            variant='contained'
            color='primary'
            // size='small'
            onClick={() => handleModal(true, 'Create Profile')}
            // className={classes.button}
            startIcon={<AddIcon />}>
            Add Profile
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

const TrackerTab = () => {
  const classes = useStyles();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  // const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    console.log('Selected Data: ', selected);
  }, [selected]);

  const {
    isLoading,
    profiles,
    handleModal,
    handleEdit,
    shareProfiles,
  } = useContext(VADemandContext);

  const [profilesToShow, setProfilesToShow] = useState<VAProfileDataType[]>([]);

  useEffect(() => {
    // setProfilesToShow(profiles.filter((p) => !p.shared));
    setProfilesToShow(profiles);
  }, [profiles]);

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
      const newSelecteds = profilesToShow.map((n) => n.id);
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

  // const [timeSheetModalOpened, setTimeSheetModalOpened] = useState<boolean>(
  //   false,
  // );
  // const [currentEmployee, setCurrentEmployee] = useState<string>('');

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, profilesToShow.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <OPLoader isLoading={isLoading} />
      <Paper className={classes.paper} variant='outlined'>
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
              rowCount={profilesToShow.length}
            />
            {profilesToShow.length > 0 && (
              <TableBody>
                {stableSort(profilesToShow, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: VAProfileDataType, index) => {
                    const isItemSelected = isSelected(row?.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
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
                            <Tooltip title='Click to view profile'>
                              <span
                                onClick={() => {
                                  handleEdit(row.id);
                                }}
                                style={{
                                  cursor: 'pointer',
                                }}
                                className={classes.hoverUnderline}>
                                {`${row.firstname} ${row.lastname}`}
                              </span>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                        <TableCell align='left'>{row.email}</TableCell>
                        <TableCell align='center'>{row.mobile}</TableCell>
                        <TableCell align='center'>{row.experience}</TableCell>
                        <TableCell align='center'>
                          {moment(row.created).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell align='center'>
                          <Alert
                            icon={false}
                            severity={
                              row.profile_status === 'INTERVIEW_SUCCESS'
                                ? 'success'
                                : row.profile_status === 'DROPPED'
                                ? 'error'
                                : 'info'
                            }>
                            {row.profile_status}
                          </Alert>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 81 * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            )}
            {profilesToShow.length === 0 && (
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
                        No profile found
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
          count={profilesToShow.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <ProfileModal />
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      /> */}
      {/* <TimeSheetModal
        isOpen={timeSheetModalOpened}
        userData={currentEmployee}
        onClose={() => {
          setTimeSheetModalOpened(false);
        }}
      /> */}
    </div>
  );
};

export default TrackerTab;
