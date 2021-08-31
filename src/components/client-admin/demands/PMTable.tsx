import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// React Components Imports
import {
  FormControl,
  IconButton,
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
  Typography,
} from '@material-ui/core';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

// Icon Imports
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';

import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import { TableViewStates } from './ManageDemand';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
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
  }),
);

export default function EnhancedTable({
  openEditDemandModal,
  tableViewState,
  projectId,
}: {
  openEditDemandModal: () => void;
  tableViewState: TableViewStates;
  projectId: string;
}) {
  const classes = useStyles();
  const router = useRouter();
  const [selected, setSelected] = React.useState<string[]>([]);
  const {
    // demandsForProject: demands,
    demands,
    updateDemandStatus,
    setEditableDemand,
    deleteDemand,
    setDemandInfo,
    getDemandData,
    editMode,
    setEditMode,
  } = useContext(CADemandContext);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleStatusChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>,
    id: string | undefined,
  ) => {
    const { value } = e.target;
    const status = value;
    if (id) updateDemandStatus(id, status);
  };

  // Table Data

  interface Data {
    manager: string;
    quantity: number;
    duration: number;
    name: string;
    status: string;
    startDate: string;
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

  const headCells: HeadCell[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Demand Name',
      align: 'left',
    },
    {
      id: 'manager',
      numeric: false,
      disablePadding: false,
      label: 'Project Manager',
      align: 'left',
    },
    { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },
    {
      id: 'startDate',
      numeric: false,
      disablePadding: false,
      label: 'Desired Start Date',
    },
    { id: 'duration', numeric: true, disablePadding: false, label: 'Duration' },
    { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  ];

  let filterdDemands = demands.filter((d) => {
    return tableViewState === TableViewStates.CREATED_DEMANDS
      ? d.request_id
      : !d.request_id;
  });

  filterdDemands = filterdDemands.filter((fd) => !fd.deleted);

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

  return (
    <div className={classes.root}>
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
            {filterdDemands.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? filterdDemands.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : filterdDemands
                ).map((demand, index) => {
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
                          color='primary'
                          variant='body1'
                          onClick={async () => {
                            await router.push(
                              `/app/client-admin/project/${projectId}/demand/${demand.id}`,
                            );
                          }}>
                          <span
                            style={{
                              cursor: 'pointer',
                            }}
                            className={classes.hoverUnderline}>
                            {demand.name}
                          </span>
                        </Typography>
                      </TableCell>
                      <TableCell align='left'>
                        {demand.user_first_name}&nbsp;{demand.user_last_name}
                      </TableCell>
                      <TableCell align='center'>{demand.quantity}</TableCell>
                      <TableCell align='center'>
                        {reverseString(demand.startDate)}
                      </TableCell>
                      <TableCell align='center'>{demand.duration}</TableCell>
                      <TableCell align='center'>
                        <FormControl variant='outlined' size='small'>
                          <Select
                            name={demand.id}
                            value={demand.status}
                            onChange={(e) => handleStatusChange(e, demand.id)}>
                            <MenuItem value='OPEN'>Open</MenuItem>
                            <MenuItem value='CLOSED'>Close</MenuItem>
                            <MenuItem value='HOLD'>Hold</MenuItem>
                            <MenuItem value='FILLED'>Filled</MenuItem>
                            <MenuItem value='ACTIVE'>Activate</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell style={{ width: 20 }} align='right'>
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
                                  {demand.request_id ? (
                                    <></>
                                  ) : (
                                    <ListItem
                                      button
                                      onClick={async () => {
                                        await setEditMode(true);
                                        //@ts-ignore
                                        await setEditableDemand(demand);
                                        await openEditDemandModal();
                                      }}>
                                      <ListItemIcon>
                                        <EditIcon />
                                      </ListItemIcon>
                                      <ListItemText
                                        id='switch-list-label-edit'
                                        primary='Review'
                                      />
                                    </ListItem>
                                  )}

                                  <ListItem
                                    button
                                    onClick={() => {
                                      deleteDemand(demand.id ? demand.id : '');
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
              //   {tableViewState === TableViewStates.CREATED_DEMANDS
              //     ? 'No created demands'
              //     : 'No pending demands'}
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
                        {tableViewState === TableViewStates.CREATED_DEMANDS
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
