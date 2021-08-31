import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
// React Components Imports
import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableRow,
  Typography,
  createStyles,
  makeStyles,
  Theme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  TableBody,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert/Alert';
import useTable from '../../common/useTable';
import { OPHttpClient } from 'src/utils/op-http-client';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';
import moment from 'moment';
import OPLoader from 'src/components/common/OPLoader';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';
import { VPWorkOrderApiService } from 'src/apis/vice-president/vp-workorder-api-service';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '100%',
    },
    hoverUnderline: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    font: {
      fontWeight: 'bold',
    },
    margin: {
      margin: theme.spacing(2, 0),
    },
    tableRowHover: {
      '&:hover': {
        // backgroundImage:
        //   'linear-gradient(to right top, #ffffff, #f9f9fc, #f2f4f9, #eaf0f6, #e1ebf2);',
        backgroundColor: '#f5f5f5',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    paperPadding: {
      padding: theme.spacing(2),
    },
  });
});

const WorkOrderTable = ({
  clientId,
  userId,
}: {
  clientId: string;
  userId: string;
}) => {
  const classes = useStyles();

  const [workOrders, setWorkOrders] = useState<WorkOrderDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllWorkOrders = async () => {
    setIsLoading(true);
    const httpClient = OPHttpClient.init(process.env.V2_API_URL, {
      action: 'Vice President Work Order Management',
    });
    const apiService = new VPWorkOrderApiService(httpClient);

    apiService.setClientId(clientId);
    const workorders = await apiService.fetchAllWorkOrders(clientId);
    if (workorders) {
      setWorkOrders([...workorders]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllWorkOrders();
  }, []);

  useEffect(() => {
    setRecords(createTableData());
  }, [workOrders]);

  const [selected, setSelected] = React.useState<string[]>([]);
  const router = useRouter();

  // Table Data

  interface Data {
    _id: string;
    workOrderId: string;
    jobTitle: string;
    resourceName: string;
    clientOrganizationName: string;
    startDate: string;
    endDate: string;
    currentRole: string;
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
    align?: string;
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
      align: 'left',
    },
    {
      id: 'resourceName',
      numeric: false,
      disablePadding: false,
      label: 'Resource Name',
      align: 'left',
    },
    {
      id: 'clientOrganizationName',
      numeric: false,
      disablePadding: false,
      label: 'Client Organization Name',
      align: 'left',
    },
    {
      id: 'startDate',
      numeric: false,
      disablePadding: false,
      label: 'Start Date',
    },
    { id: 'endDate', numeric: false, disablePadding: false, label: 'End Date' },
    {
      id: 'currentRole',
      numeric: false,
      disablePadding: false,
      label: 'Current Role',
    },
    {
      id: 'assignmentStatus',
      numeric: false,
      disablePadding: false,
      label: 'Assignment Status',
    },
  ];

  const createTableData = () => {
    const showableWorkOrders = workOrders.filter((workorder) => {
      if (
        workorder.currentRole === 'VICE_PRESIDENT' ||
        workorder.currentRole === 'VENDOR_ADMIN'
      )
        return true;
      if (
        workorder.currentRole === 'PROJECT_MANAGER' &&
        workorder.status === 'REVIEW'
      )
        return true;
      return false;
    });

    return showableWorkOrders
      .map((workorder) => {
        return {
          _id: workorder._id,
          workOrderId: workorder.data.id,
          jobTitle: workorder.data.posTitle,
          resourceName: workorder.data.requestedResource,
          clientOrganizationName: workorder.data.client.client_name,
          startDate: workorder.data.startDate,
          endDate: workorder.data.endDate,
          currentRole: workorder.currentRole,
          assignmentStatus: workorder.status,
        };
      })
      .reverse();
  };

  const [filterTerm, setFilterTerm] = useState('resourceName');
  const [records, setRecords] = useState<Data[]>([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    emptyRows,
  } = useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == '') return items;
        else
          return items.filter((x) =>
            x[filterTerm].toLowerCase().includes(target.value),
          );
      },
    });
  };

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterTerm(event.target.value as string);
    const searchElement = document.getElementById('search-field');
    if (searchElement) {
      searchElement.focus();
    }
  };

  const alertValue = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Alert icon={false} severity='success'>
            {status}
          </Alert>
        );
      case 'DROPPED':
        return (
          <Alert icon={false} severity='error'>
            {status}
          </Alert>
        );
      case 'AMEND':
        return (
          <Alert icon={false} severity='warning'>
            {status}
          </Alert>
        );
      case 'REVIEW':
        return (
          <Alert icon={false} severity='info'>
            {status}
          </Alert>
        );
    }
  };

  return (
    <div className={classes.root}>
      <Paper variant='outlined' className={classes.paperPadding}>
        <OPLoader isLoading={isLoading} />
        <Grid container direction='column' spacing={1}>
          <Grid
            item
            container
            direction='row'
            alignItems='center'
            // style={{ marginTop: '-1rem' }}
            justify='center'>
            <Grid item xs={4}>
              <Typography variant='h5' color='initial' className={classes.font}>
                Work Orders
              </Typography>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <TextField
                variant='outlined'
                id='search-field'
                label='Search'
                size='small'
                onChange={handleSearch}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl
                variant='outlined'
                size='small'
                className={classes.formControl}>
                <InputLabel id='demo-simple-select-outlined-label'>
                  Filter
                </InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={filterTerm}
                  onChange={handleFilterChange}
                  label='Filter'>
                  {headCells.map((headCell) => (
                    <MenuItem value={headCell.id}>{headCell.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TblHead />
                {records.length > 0 ? (
                  <TblContainer>
                    {recordsAfterPagingAndSorting().map((item, index) => (
                      <TableRow
                        className={classes.tableRowHover}
                        key={item.workOrderId}>
                        <TableCell align='center'>{index + 1}</TableCell>
                        <TableCell align='center'>
                          <Typography
                            color='primary'
                            variant='body1'
                            onClick={async () => {
                              await router.push(
                                `/app/vice-president/work-order/${item._id}`,
                              );
                            }}>
                            <span
                              style={{
                                cursor: 'pointer',
                              }}
                              className={classes.hoverUnderline}>
                              {item.workOrderId}
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell align='left'>{item.jobTitle}</TableCell>
                        <TableCell align='left'>{item.resourceName}</TableCell>
                        <TableCell align='left'>
                          {item.clientOrganizationName}
                        </TableCell>
                        <TableCell align='center'>
                          {moment(item.startDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell align='center'>
                          {moment(item.endDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell align='center'>
                          <Alert icon={false} severity='warning'>
                            {/* {item.currentRole === 'PROJECT_MANAGER'
                              ? 'Project-Manager'
                              : null}
                            {item.currentRole === 'VENDOR_ADMIN'
                              ? 'Vendor-Admin'
                              : null}
                            {item.currentRole === 'VICE_PRESIDENT'
                              ? 'Vice_President'
                              : null} */}
                            {item.currentRole}
                          </Alert>
                        </TableCell>
                        <TableCell align='center'>
                          {alertValue(item.assignmentStatus)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TblContainer>
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
                {/* <TableBody>
                  <TableRow style={{ height: 81 * emptyRows }}>
                    <TableCell colSpan={9}>
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
                </TableBody> */}
                <TblPagination />
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default WorkOrderTable;
