import React, { useContext } from 'react';
import {
  Grid,
  makeStyles,
  TextField,
  Paper,
  Theme,
  Typography,
  Divider,
  IconButton,
  Button,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import OPKeyValue from 'src/components/common/OPKeyValue';
import { GetApp as GetAppIcon, PlayForWorkTwoTone } from '@material-ui/icons';
import moment from 'moment';
import CompensationTable from './tables/CompensationTable';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';
import MGRWorkorderContext from 'src/contexts/project-manager/workorder/mgr-workorder-context';
import { render } from 'react-dom';
import VAWorkorderContext from 'src/contexts/vendor-admin/workorder/va-workorder-context';
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';
import { printWorkorderPdf } from 'src/utils/workorderDownload';
import { CloudsBuzzInvoice } from 'src/utils/workorderDown';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  font: {
    fontWeight: 'bolder',
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  paperPadding: {
    padding: theme.spacing(0, 4, 4, 4),
  },
  inputRootDesc: {
    '&$disabled': {
      color: '#222',
    },
    backgroundColor: 'white',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  headingMargin: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  disabled: {},
  buttonMargin: {
    marginTop: theme.spacing(3),
  },
  paperField: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  textBackground: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
  },
  boldFont: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const PositionResource = ({
  workorder,
  version,
  status,
}: {
  workorder: WorkOrderDataType;
  version?: boolean;
  status: string;
}) => {
  const { downloadFile, handleVersionChange, selectedVersion } = useContext(
    CAWorkorderContext,
  );

  const classes = useStyles();

  let C_Address: any;
  let B_Address: any;
  let corporateContactInformation: any;
  let corporateInvoicingSite: any;
  if (workorder.data.client.client_metadata) {
    C_Address = workorder.data.client.client_metadata.officeAddress;
    B_Address = workorder.data.client.client_metadata.billingAddress;
    corporateContactInformation = `${C_Address.addressLine1}, ${C_Address.addressLine2}, ${C_Address.addressLine3}, ${C_Address.townCity}, ${C_Address.country} - ${C_Address.pinCode}`;
    corporateInvoicingSite = `${B_Address.addressLine1}, ${B_Address.addressLine2}, ${B_Address.addressLine3}, ${B_Address.townCity}, ${B_Address.country} - ${B_Address.pinCode}`;
  } else {
    corporateInvoicingSite = 'Not provided';
  }

  let V_C_Address: any;
  let V_B_Address: any;
  let v_corporateContactInformation: any;
  let v_corporateInvoicingSite: any;
  if (workorder.data.vendor.vendor_metadata) {
    V_C_Address = workorder.data.vendor.vendor_metadata.officeAddress;
    V_B_Address = workorder.data.vendor.vendor_metadata.billingAddress;
    v_corporateContactInformation = `${C_Address.addressLine1}, ${C_Address.addressLine2}, ${C_Address.addressLine3}, ${C_Address.townCity}, ${C_Address.country} - ${C_Address.pinCode}`;
    v_corporateInvoicingSite = `${B_Address.addressLine1}, ${B_Address.addressLine2}, ${B_Address.addressLine3}, ${B_Address.townCity}, ${B_Address.country} - ${B_Address.pinCode}`;
  } else {
    v_corporateInvoicingSite = 'Not provided';
  }

  const downloadWorkorder = () => {
    console.log('dowloaded');
    // printWorkorderPdf(workorder);
    const tableData: any = [];

    const sampleData = {
      client: {
        name: workorder.data.client.client_name,
        address: corporateInvoicingSite,
      },
      vendor: {
        name: workorder.data.vendor.vendor_name,
        address: v_corporateInvoicingSite,
      },
      rate: workorder.data.rateType,
      id: workorder.data.posId,
      requestedResource: workorder.data.requestedResource,
      positionTitle: workorder.data.posTitle,
      currency: workorder.data.currency,
      demandId: workorder.data.posId,
      jobType: workorder.data.jobType,
      officialEmail: workorder.data.officialEmail,
      reportsTo: workorder.data.posReportsTo,
      startDate: moment(workorder.data.startDate).format('DD MMM YYYY'),
      endDate: moment(workorder.data.endDate).format('DD MMM YYYY'),
      duration: workorder.data.duration,
      billingPeriod: '30-May-2021 to 07-Jun-2021',
      contractRate: 1.3,
      clientFeeRate: 1.3,
      date: '07-Jun-2021',
      tableData,
    };

    const pdfx = new CloudsBuzzInvoice(sampleData);
    pdfx.generatePDF('workorder.pdf');
  };

  type ResourceDataType = {
    name: string;
    value: string | number;
  };

  type WorkAssignmentDataType = {
    name: string;
    type?: string;
    value: string | number;
  };

  type EstimatedWorkOrderAmountDataType = {
    name: string;
    value: string;
  };

  const workAssignment: WorkAssignmentDataType[] = [
    { name: 'Demand ID#', value: workorder.data.posId },
    { name: 'Position Title', value: workorder.data.posTitle },
    { name: 'Position reports to', value: workorder.data.posReportsTo },
    { name: 'Job Type', value: workorder.data.jobType },
    { name: 'Rate Card', value: workorder.data.rateType },
    // { name: 'Rate Type', value: workorder.data.rateType },
    // { name: 'Contracted Fee', value: '-' },
    { name: 'Currency', value: workorder.data.currency },
  ];

  const estimatedWorkOrderAmount: EstimatedWorkOrderAmountDataType[] = [
    {
      name: 'Start Date',
      value: moment(workorder.data.startDate).format('DD MMM YYYY'),
    },
    {
      name: 'End Date',
      value: moment(workorder.data.endDate).format('DD MMM YYYY'),
    },
    // {
    //   name: 'Estimated Total Spend',
    //   value: workorder.data.estimatedTotalSpend,
    // },
    { name: 'Duration (Months)', value: workorder.data.duration },
    // {
    //   name: 'Est. Remaining Budget',
    //   value: workorder.data.estimatedRemainingBudget,
    // },
    // {
    //   name: 'Allow Expense Entry',
    //   value: workorder.data.allowExpenses ? 'Yes' : 'No',
    // },
    // { name: 'Estimated Expenses', value: '' },
    // { name: 'Estimated Labour', value: '' },
    // { name: 'Travel & Expences Expected', value: '' },
    // { name: 'Travel time Reimburasable', value: '' },
    // { name: 'Travel required to', value: '' },
    // { name: 'Misc. Terms & conditions', value: '' },
  ];

  const renderMenuItem = () => {
    const menuItems: any[] = [];
    // @ts-ignore
    for (var i = 0; i < workorder?.data?.changes?.length + 1; i++) {
      menuItems.push(<MenuItem value={i}>{i}</MenuItem>);
    }
    return <>{menuItems}</>;
  };

  const desc = workorder.data.assignmentDesc;

  const resource: ResourceDataType[] = [
    { name: 'Requested resource', value: workorder.data.requestedResource },
    { name: 'ID Number#', value: workorder.data.id },
    { name: 'Official Email', value: workorder.data.officialEmail },
  ];

  return (
    <>
      <Grid container direction='column' spacing={4}>
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Resource
            </Typography>
          </Grid>
          <Grid item container direction='row'>
            {/* {resource.map((data) => {
              return (
                <Grid item lg={4} xs={12}>
                  <OPKeyValue label={data.name} value={data.value} />
                </Grid>
              );
            })} */}
            <Grid item lg={4} xs={12}>
              <OPKeyValue label='ID Number#' value={workorder.data.id} />
            </Grid>
            <Grid item lg={4} xs={12}>
              <OPKeyValue
                label='Requested resource'
                value={workorder.data.requestedResource}
              />
            </Grid>
            {/* {version ? (
              <Grid item lg={4} xs={12}>
                <OPKeyValue
                  label='Version'
                  value={
                    <FormControl size='small'>
                      <Select
                        variant='outlined'
                        value={selectedVersion}
                        onChange={(e) => handleVersionChange(e.target.value)}>
                        <MenuItem value={0}>0</MenuItem>
                        {workorder?.data?.changes?.map((_, index) => (
                          <MenuItem value={index + 1}>{index + 1}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  }
                />
              </Grid>
            ) : null} */}
            <Grid item lg={4} xs={12}>
              <OPKeyValue
                label='Official Email'
                value={workorder.data.officialEmail}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid>
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Work Assignment
            </Typography>
          </Grid>
          <Grid item container direction='row'>
            <Grid item container direction='row' spacing={2}>
              {workAssignment.map((data) => {
                return (
                  <Grid item lg={4} md={6} xs={12}>
                    <OPKeyValue label={data.name} value={data.value} />
                  </Grid>
                );
              })}
            </Grid>
            {/* <Grid item lg={4}>
              <Grid item xs={12} lg={12}>
                <Paper
                  variant='elevation'
                  elevation={0}
                  className={classes.paperField}>
                  <Typography variant='body2' color='inherit' align='center'>
                    Assignment Description
                  </Typography>
                </Paper>
                <TextField
                  margin='dense'
                  size='small'
                  fullWidth
                  variant='outlined'
                  multiline
                  rows='4'
                  value={desc}
                  InputProps={{
                    classes: {
                      root: classes.inputRootDesc,
                      disabled: classes.disabled,
                    },
                  }}
                  disabled
                />
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid>
        {/* <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Compensation Rates
            </Typography>
          </Grid>
          <Grid item container direction='row' spacing={2}>
            <Grid item lg={12} xs={12}>
              <CompensationTable data={workorder.data} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid> */}
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Estimated Work Order Amount
            </Typography>
          </Grid>
          <Grid item container direction='row' spacing={2} xs={12}>
            {estimatedWorkOrderAmount.map((data) => {
              return (
                <Grid item lg={4} md={6} xs={12}>
                  <OPKeyValue
                    label={data.name}
                    value={data.value === '' ? '---' : data.value}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid>
        <Grid item container direction='column' spacing={2}>
          {/* <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Document Work
            </Typography>
          </Grid> */}
          {status === 'APPROVED' ? (
            <Grid item container direction='row' spacing={2}>
              <Grid item xs={3}>
                <Button
                  variant='contained'
                  color='primary'
                  // startIcon={<GetAppIcon />}
                  onClick={downloadWorkorder}>
                  Download Work Order
                </Button>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default PositionResource;
