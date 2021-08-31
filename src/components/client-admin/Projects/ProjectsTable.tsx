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
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import ProjectsModal from './ProjectsModal';
// Icon Imports
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import moment from 'moment';
import CAProjectsContext from 'src/contexts/client-admin/projects/ca-projects-context';
import { Datum } from 'src/types/response-types/client-admin/projects';
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
      // '&:focus': {
      //   backgroundColor: theme.palette.secondary.light,
      // },
      // '&:hover': {
      //   backgroundColor: theme.palette.secondary.,
      // },
    },
    hoverUnderline: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
    button: {
      margin: theme.spacing(1),
      borderRadius: 9999,
    },
  }),
);

export default function ProjectsTable({ clientId, id, userName }) {
  const classes = useStyles();

  const router = useRouter();
  const {
    setModelOpen,
    setModalType,

    setSelectedRowData,
    API_DATA,
  } = useContext(CAProjectsContext);

  const [anchorEl, setAnchorEl] = React.useState({});
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Datum;
    label: string;
    numeric: boolean;
    align?: string;
  }

  const headCells: HeadCell[] = [
    {
      id: 'projectName',
      numeric: false,
      disablePadding: false,
      label: 'Project Name',
      align: 'left',
    },
    // {
    //   id: 'project_manager_user',
    //   numeric: false,
    //   disablePadding: false,
    //   label: 'Project Manager Name',
    //   align: 'left',
    // },
    {
      id: 'startDate',
      numeric: false,
      disablePadding: false,
      label: 'Start Date ',
    },
    {
      id: 'endDate',
      numeric: false,
      disablePadding: false,
      label: 'End Date',
    },
    {
      id: 'enabled',
      numeric: false,
      disablePadding: false,
      label: 'Duration',
    },
  ];

  const rows: any = API_DATA.map((data, iterator) => {
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
    projectName,
    created,
    updated,
    startDate,
    endDate,
    deleted,
    enabled,
    numeric_id,

    project_manager_user,
    vp_user,
    client,
  }: Datum) {
    const {
      email,
      mobile,
      username,
      firstname,
      lastname,
      department_name,
    } = vp_user;

    const vp_name = `${firstname} ${lastname}`;
    const pm_name = `${project_manager_user?.firstname} ${project_manager_user?.lastname}`;

    return {
      id,
      projectName,
      created,
      updated,
      startDate,
      endDate,
      deleted,
      pm_name,
      enabled,
      numeric_id,
      vp_name,
      department_name,
      project_manager_user,
      vp_user,
      client,
    };
  }

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index,
  ) => {
    setAnchorEl({ ...anchorEl, [index]: event.currentTarget });
  };

  const handleMenuClose = () => {
    setAnchorEl({});
    setAnchorE2(null);
  };

  const handleClickOpen = () => {
    setModelOpen(true);
  };

  return (
    <div className={classes.root}>
      <ProjectsModal />
      <Button
        variant='contained'
        color='secondary'
        size='large'
        onClick={(e) => {
          handleClickOpen();
          setModalType('new');
          setSelectedRowData({});
        }}
        className={classes.button}
        startIcon={<AddIcon />}>
        New Project
      </Button>
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
                {headCells.map((headCell, i) => (
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
            {rows.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : rows
                ).map((row, index) => {
                  const startDateDiff = moment(
                    moment(row.startDate).format('DD-MM-YYYY'),
                    'DD-MM-YYYY',
                  );
                  const endDateDiff = moment(
                    moment(row.endDate).format('DD-MM-YYYY'),
                    'DD-MM-YYYY',
                  );

                  const rowSelect = () => {
                    setSelectedRowData(row);
                  };

                  const monthlyDiff = endDateDiff.diff(startDateDiff, 'months');
                  return (
                    <TableRow hover className={classes.tableRow} key={index}>
                      <TableCell component='th' scope='row'>
                        {index + 1}
                      </TableCell>
                      <TableCell component='th' scope='row'>
                        <Typography
                          variant='body1'
                          color='primary'
                          className={classes.hoverUnderline}
                          onClick={async (e) => {
                            await router.push(
                              `/app/client-admin/project/${row.id}/manage-demand`,
                            );
                          }}>
                          {row.projectName}
                        </Typography>
                      </TableCell>
                      {/* <TableCell>{`${row.project_manager_user?.firstname} ${row.project_manager_user?.lastname}`}</TableCell> */}
                      <TableCell align='center'>
                        {moment(row.startDate).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align='center'>
                        {moment(row.endDate).format('DD-MM-YYYY')}
                      </TableCell>

                      <TableCell align='center'>{monthlyDiff}</TableCell>
                      <TableCell>
                        <>
                          <IconButton
                            aria-controls='simple-menu'
                            aria-haspopup='true'
                            onClick={(e) => {
                              handleMenuClick(e, index);
                              e.stopPropagation();
                            }}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            id='simple-menu'
                            anchorEl={anchorEl[index]}
                            keepMounted
                            open={Boolean(anchorEl[index])}
                            onClose={handleMenuClose}>
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickOpen();
                                setModalType('edit');
                                setSelectedRowData(row);
                              }}>
                              Edit
                            </MenuItem>
                            {/* <MenuItem onClick={handleMenuClose}>
                              Delete
                            </MenuItem> */}
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
