import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// React Components Imports
import {
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import moment from 'moment';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import OPLoader from 'src/components/common/OPLoader';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      marginBottom: '1rem',
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

export default function ModalTable() {
  const classes = useStyles();
  const router = useRouter();
  const {
    isLoading,
    setCreatePageShow,
    setOpenModal,
    profiles,
    fetchProfileDetails,
    setAmendSuggestion,
    setEditMode,
    rejectWorkorder,
  } = useContext(CAWorkorderContext);

  const [reasonValue, setReasonValue] = useState<string>('');

  interface Data {
    demand_id: string;
    name: string;
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
      id: 'demand_id',
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
  ];
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setReasonValue('');
    setOpen(false);
  };

  const [selected, setSelected] = React.useState<string[]>([]);
  const isSelected = (username: string) => selected.indexOf(username) !== -1;
  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, profiles.length - page * rowsPerPage);

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
                <TableCell className={classes.tableHeadFont} />
              </TableRow>
            </TableHead>
            {profiles.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? profiles.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : profiles
                ).map((data, index) => {
                  const isItemSelected = isSelected(data.firstname);
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
                        align='center'>
                        {data.request_id}
                      </TableCell>

                      <TableCell align='left'>
                        {data.firstname} {data.lastname}
                      </TableCell>
                      <TableCell align='center'>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={async () => {
                            await setAmendSuggestion('');
                            await fetchProfileDetails(data.demand_id, data.id);
                            await setOpenModal(false);
                            await setEditMode(false);
                            await setCreatePageShow(true);
                          }}
                          style={{ marginRight: '0.5rem' }}>
                          Create
                        </Button>
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={handleClickOpen}>
                          Reject
                        </Button>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          maxWidth='lg'
                          aria-labelledby='form-dialog-title'>
                          <DialogTitle id='form-dialog-title'>
                            Reject Reason
                          </DialogTitle>
                          <DialogContent style={{ width: '500px' }}>
                            <TextField
                              multiline
                              fullWidth
                              rows={3}
                              placeholder='Enter reason here...'
                              value={reasonValue}
                              // onChange={(e) => setSuggestReason(e.target.value)}
                              onChange={(e) => setReasonValue(e.target.value)}
                              variant='outlined'
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} color='primary'>
                              Cancel
                            </Button>
                            <Button
                              onClick={async () => {
                                await fetchProfileDetails(
                                  data.demand_id,
                                  data.id,
                                );
                                await rejectWorkorder(reasonValue);
                                await setOpen(false);
                              }}
                              color='primary'>
                              Submit
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 81 * emptyRows }}>
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow style={{ height: 81 * emptyRows, zIndex: 100 }}>
                  <TableCell colSpan={3}>
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
                  rowsPerPageOptions={[7, 10, 25, { label: 'All', value: -1 }]}
                  count={profiles.length}
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
