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
import moment from 'moment';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

// Icon Imports
import {
  DoneAll as DoneAllIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  GetApp as DownloadIcon,
} from '@material-ui/icons';

import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
import OPTablePaginationActions from '../../common/OPTablePaginationActions';
import VAManageUserContext from 'src/contexts/vendor-admin/manage-user/va-mu-context';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import OPLoader from 'src/components/common/OPLoader';
import CAComplianceContext from 'src/contexts/client-admin/compliance/ca-cc-context';
import { Alert } from '@material-ui/lab';

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

export default function VendorsModalTable() {
  const classes = useStyles();
  const router = useRouter();
  const {
    allVendorDocuments,
    handleDocumentRequest,
    handleDocumentApprove,
    downloadFile,
  } = useContext(CAComplianceContext);

  interface Data {
    document_name: string;
    received_on: string;
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
      id: 'document_name',
      numeric: false,
      disablePadding: false,
      label: 'Document Name',
      align: 'left',
    },
    {
      id: 'received_on',
      numeric: false,
      disablePadding: false,
      label: 'Received On',
      align: 'left',
    },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  ];

  const [selected, setSelected] = React.useState<string[]>([]);
  const isSelected = (username: string) => selected.indexOf(username) !== -1;
  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, allVendorDocuments.length - page * rowsPerPage);

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
                <TableCell width={5} className={classes.tableHeadFont} />
              </TableRow>
            </TableHead>
            {allVendorDocuments.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? allVendorDocuments.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : allVendorDocuments
                ).map((data, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      // key={data.id}
                    >
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell component='th' scope='row' align='left'>
                        <Typography
                          variant='body1'
                          // onClick={async () => {
                          //   await router.push(
                          //     `/app/project-manager/project/${projectId}/demand/${data.id}`,
                          //   );
                          // }}
                        >
                          {data.document_name}
                        </Typography>
                      </TableCell>
                      <TableCell align='left'>
                        {data.updated &&
                        data.document_status &&
                        data.document_status === 'APPROVED'
                          ? moment(data.updated).format('DD MMM YYYY')
                          : '--'}
                      </TableCell>
                      <TableCell align='center'>
                        <Alert
                          icon={false}
                          severity={
                            data.document_status === 'NOT_PRESENT'
                              ? 'error'
                              : data.document_status === 'APPROVED'
                              ? 'success'
                              : 'info'
                          }
                          style={{ justifyContent: 'center' }}>
                          {data.document_status === 'NOT_PRESENT'
                            ? 'PENDING'
                            : data.document_status}
                        </Alert>
                      </TableCell>
                      <TableCell style={{ width: 20 }} align='right'>
                        <PopupState variant='popover' popupId='table-popover'>
                          {(popupState) => (
                            <div>
                              {data.document_status !== 'APPROVED' && (
                                <IconButton
                                  color='primary'
                                  {...bindTrigger(popupState)}>
                                  <MoreVertIcon />
                                </IconButton>
                              )}

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
                                      handleDocumentRequest(
                                        data.document_type,
                                        data.vendor_id,
                                      );
                                    }}>
                                    <ListItemIcon>
                                      <EditIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      id='switch-list-label-edit'
                                      primary='Request'
                                    />
                                  </ListItem>
                                  {data.document_status === 'SUBMITTED' && (
                                    <ListItem
                                      button
                                      onClick={() => {
                                        handleDocumentApprove(
                                          data.id,
                                          data.vendor_id,
                                        );
                                      }}>
                                      <ListItemIcon>
                                        <DoneAllIcon />
                                      </ListItemIcon>
                                      <ListItemText
                                        id='switch-list-label-delete'
                                        primary='Approve'
                                      />
                                    </ListItem>
                                  )}
                                </List>
                              </Popover>
                            </div>
                          )}
                        </PopupState>
                      </TableCell>

                      <TableCell style={{ width: 20 }} align='right'>
                        {(data.document_status === 'APPROVED' ||
                          data.document_status === 'SUBMITTED') && (
                          <IconButton
                            aria-label=''
                            color='primary'
                            onClick={() =>
                              downloadFile(
                                data.document_type,
                                data.vendor_id,
                                data.file_name,
                              )
                            }>
                            <DownloadIcon />
                          </IconButton>
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
                  <TableCell colSpan={6}>
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
                  count={allVendorDocuments.length}
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
