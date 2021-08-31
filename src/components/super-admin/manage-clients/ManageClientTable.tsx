import React, { useContext, useEffect, useState } from 'react';
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
import moment from 'moment';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

// Icon Imports
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';

import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
import OPTablePaginationActions from '../../common/OPTablePaginationActions';
import VAManageUserContext from 'src/contexts/vendor-admin/manage-user/va-mu-context';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import OPLoader from 'src/components/common/OPLoader';
import CAManageUsersContext from 'src/contexts/client-admin/manage-users/ca-manage-users-context';
import SAManageClientContext from 'src/contexts/super-admin/manage-clients/sa-mc-context';
import { Alert } from '@material-ui/lab';
import { ManageClientType } from 'src/types/super-admin/manage-clients';

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

export default function ManageClientTable({ userId }) {
  const classes = useStyles();
  const router = useRouter();
  const {
    manageClientData,
    handleModal,
    deleteClient,
    handleEdit,
    isLoading,
  } = useContext(SAManageClientContext);

  const [clientData, setClientData] = useState<ManageClientType[]>([]);

  useEffect(() => {
    setClientData(manageClientData.filter((data) => data.deleted !== true));
  }, [manageClientData]);

  interface Data {
    email: string;
    clientName: string;
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
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'Client User',
      align: 'left',
    },
    {
      id: 'clientName',
      numeric: false,
      disablePadding: false,
      label: 'Company',
      align: 'left',
    },

    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: 'Created Date',
    },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  ];

  const [selected, setSelected] = React.useState<string[]>([]);
  const isSelected = (username: string) => selected.indexOf(username) !== -1;
  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, clientData.length - page * rowsPerPage);

  // const emptyRows = 5;
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
      <OPLoader isLoading={isLoading} />
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
            {clientData.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? clientData.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : clientData
                ).map((data, index) => {
                  const isItemSelected = isSelected(data.email);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={data.id}
                      selected={isItemSelected}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='row'
                        align='left'>
                        <Typography
                          variant='body1'
                          // onClick={async () => {
                          //   await router.push(
                          //     `/app/project-manager/project/${projectId}/demand/${data.id}`,
                          //   );
                          // }}
                        >
                          {data.email}
                          {/* <br /> */}
                          {/* <i style={{ color: '#555' }}>{data.email}</i> */}
                        </Typography>
                      </TableCell>
                      <TableCell align='left'>{data.clientName}</TableCell>
                      {/* <TableCell align='center'>{data.roles[0].role}</TableCell> */}
                      <TableCell align='center'>
                        {moment(data.created).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell align='center'>
                        <Alert
                          icon={false}
                          severity={
                            data.enabled && !data.deleted ? 'success' : 'error'
                          }
                          style={{ justifyContent: 'center' }}>
                          {data.enabled && !data.deleted
                            ? 'ACTIVE'
                            : 'INACTIVE'}
                        </Alert>
                      </TableCell>
                      <TableCell style={{ width: 20 }} align='right'>
                        {userId !== data.id && (
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
                                      onClick={async () => {
                                        await handleEdit(data.id);
                                        await handleModal(true, 'Edit');
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
                                        deleteClient(data.id);
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
              <TableBody>
                <TableRow style={{ height: 81 * emptyRows, zIndex: 100 }}>
                  <TableCell colSpan={8}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Typography variant='h4' color='primary'>
                        No available data
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
                  count={clientData.length}
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
