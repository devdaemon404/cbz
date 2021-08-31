import React from 'react';
import { useRouter } from 'next/router';

// React Components Imports
import {
  Paper,
  Grid,
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
import OPTablePaginationActions from '../../common/OPTablePaginationActions';
import Alert from '@material-ui/lab/Alert/Alert';

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
      fontWeight: 'bolder',
      backgroundColor: theme.palette.primary.light,
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
    font: {
      fontWeight: 'bold',
    },
  }),
);

export default function WorkOrderTab() {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const router = useRouter();

  // Table Data

  interface Data {
    workOrderId: string;
    jobTitle: string;
    resourceName: string;
    supplierOrganizationName: string;
    startDate: string;
    endDate: string;
    assignmentStatus: string;
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
  }

  const headCells: HeadCell[] = [
    {
      id: 'workOrderId',
      numeric: false,
      disablePadding: true,
      label: 'Workorder ID',
    },
    {
      id: 'jobTitle',
      numeric: false,
      disablePadding: false,
      label: 'Job Title',
    },
    {
      id: 'resourceName',
      numeric: false,
      disablePadding: false,
      label: 'Resource Name',
    },
    {
      id: 'supplierOrganizationName',
      numeric: false,
      disablePadding: false,
      label: 'Supplier Organization Name',
    },
    {
      id: 'startDate',
      numeric: false,
      disablePadding: false,
      label: 'Start Date',
    },
    { id: 'endDate', numeric: false, disablePadding: false, label: 'End Date' },
    {
      id: 'assignmentStatus',
      numeric: false,
      disablePadding: false,
      label: 'Assignment Status',
    },
  ];

  const tableData: Data[] = [
    {
      workOrderId: 'T-117897192-0',
      jobTitle: 'Developer, Web',
      resourceName: 'Mahesh Sharma',
      supplierOrganizationName: 'Future World Consultancy Pvt Ltd(GAP-IN)',
      startDate: '2 Dec 2020',
      endDate: '2 Dec 2020',
      assignmentStatus: 'APPROVED',
    },
    {
      workOrderId: 'T-117897192-0',
      jobTitle: 'Developer, Web',
      resourceName: 'Ankit Sethi',
      supplierOrganizationName: 'Future World Consultancy Pvt Ltd(GAP-IN)',
      startDate: '2 Dec 2020',
      endDate: '2 Dec 2020',
      assignmentStatus: 'APPROVED',
    },
    {
      workOrderId: 'T-117897192-0',
      jobTitle: 'Developer, Web',
      resourceName: 'Suraj Rao',
      supplierOrganizationName: 'Future World Consultancy Pvt Ltd(GAP-IN)',
      startDate: '2 Dec 2020',
      endDate: '2 Dec 2020',
      assignmentStatus: 'APPROVED',
    },
  ];

  // Pagination

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);

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
      <Grid container spacing={1} direction='column'>
        <Grid item>
          <Typography variant='h6' color='initial' className={classes.font}>
            WorkOrders - (Demand Name)
          </Typography>
        </Grid>
        <Grid item>
          <Paper variant='outlined' className={classes.paper}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby='tableTitle'
                aria-label='enhanced table'>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align='center'
                        className={classes.tableHeadFont}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {tableData.length > 0 ? (
                  <TableBody>
                    {(rowsPerPage > 0
                      ? tableData.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : tableData
                    ).map((data, index) => {
                      const isItemSelected = isSelected(data.workOrderId);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={data.workOrderId}
                          selected={isItemSelected}>
                          <TableCell
                            component='th'
                            id={labelId}
                            scope='row'
                            align='center'
                            padding='none'>
                            <Typography
                              color='primary'
                              variant='body1'
                              onClick={async () => {
                                await router.push(
                                  `/app/project-manager/workorder`,
                                );
                              }}>
                              <span
                                style={{
                                  cursor: 'pointer',
                                }}
                                className={classes.hoverUnderline}>
                                {data.workOrderId}
                              </span>
                            </Typography>
                          </TableCell>
                          <TableCell align='center'>{data.jobTitle}</TableCell>
                          <TableCell align='center'>
                            {data.resourceName}
                          </TableCell>
                          <TableCell align='center'>
                            {data.supplierOrganizationName}
                          </TableCell>
                          <TableCell align='center'>{data.startDate}</TableCell>
                          <TableCell align='center'>{data.endDate}</TableCell>
                          <TableCell align='center'>
                            <Alert icon={false} severity='success'>
                              Approved
                            </Alert>
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
                    style={{ padding: '1rem' }}>
                    No Data Available
                  </Typography>
                )}

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: 'All', value: -1 },
                      ]}
                      count={tableData.length}
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
        </Grid>
      </Grid>
    </div>
  );
}
