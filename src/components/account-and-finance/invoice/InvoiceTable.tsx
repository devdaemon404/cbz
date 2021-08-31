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
  Button,
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
import ANFInvoiceContext from 'src/contexts/acc-and-fin/invoice/anf-i-context';

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

export default function InvoiceTable() {
  const classes = useStyles();
  const router = useRouter();
  const { isLoading, invoices } = useContext(ANFInvoiceContext);

  // Table Data

  interface Data {
    billing: string;
    invoiceNo: string;
    netPayable: string;
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
      id: 'billing',
      numeric: false,
      disablePadding: false,
      label: 'Billing Date',
    },
    {
      id: 'invoiceNo',
      numeric: false,
      disablePadding: false,
      label: 'Invoice Number',
    },
    {
      id: 'netPayable',
      numeric: false,
      disablePadding: false,
      label: 'Created Date',
    },
  ];

  const [selected, setSelected] = React.useState<string[]>([]);
  const isSelected = (username: string) => selected.indexOf(username) !== -1;
  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, invoices.length - page * rowsPerPage);

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
                <TableCell className={classes.tableHeadFont} align='center'>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {invoices.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? invoices.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : invoices
                ).map((data, index) => {
                  // const isItemSelected = isSelected(data.email);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={data._id}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell align='center'>
                        {moment(data.date).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell align='center'>{data.invoiceNumber}</TableCell>
                      <TableCell align='center'>$ 200 </TableCell>
                      <TableCell align='center'>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() =>
                            window.open(
                              'https://pdfhost.io/v/BT6eWVMol_invoicesamplepdf.pdf',
                            )
                          }>
                          Download
                        </Button>
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
                  count={invoices.length}
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
