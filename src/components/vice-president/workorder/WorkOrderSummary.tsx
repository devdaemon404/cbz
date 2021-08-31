import React, { useContext, useState } from 'react';
import {
  Grid,
  Typography,
  Divider,
  createStyles,
  makeStyles,
  Theme,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import ClientOrganization from './ClientOrganization';
import PositionResource from './PositionResource';
import VendorOrganization from './VendorOrganization';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';
import OPAreYouSure from 'src/components/common/OPAreYouSure';
import { PMWorkOrderApiService } from 'src/apis/project-manager/pm-workorder-api-service';
import { OPHttpClient } from 'src/utils/op-http-client';
import MGRWorkorderState from 'src/contexts/project-manager/workorder/MGRWorkorderState';
import MGRWorkorderContext from 'src/contexts/project-manager/workorder/mgr-workorder-context';
import OPLoader from 'src/components/common/OPLoader';
import OPKeyValue from 'src/components/common/OPKeyValue';
import VAWorkorderContext from 'src/contexts/vendor-admin/workorder/va-workorder-context';

import { printWorkorderPdf } from 'src/utils/workorderDownload';
import ContractualComponentsTable from './tables/ContractualComponentsTable';
import VPWorkorderContext from 'src/contexts/vice-president/workorder/vp-workorder-context';
import moment from 'moment';
import { CloudsBuzzInvoice } from 'src/utils/workorderDown';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dividerColor: {
      backgroundColor: theme.palette.primary.main,
    },
    margin: {
      margin: theme.spacing(3, 0),
    },
    font: {
      fontWeight: 'bold',
    },
  }),
);

const WorkOrderSummary = ({ workorder }: { workorder: WorkOrderDataType }) => {
  const [areYouSureOpenSuggest, setAreYouSureOpenSuggest] = useState<boolean>(
    false,
  );
  const [areYouSureOpenApprove, setAreYouSureOpenApprove] = useState<boolean>(
    false,
  );
  const [areYouSureOpenReject, setAreYouSureOpenReject] = useState<boolean>(
    false,
  );

  const [reasonValue, setReasonValue] = useState<string>('');
  const {
    isLoading,
    changeWorkorderStatus,
    suggestReason,
    setSuggestReason,
  } = useContext(VPWorkorderContext);

  const handleWorkOrderSubmit = () => {
    changeWorkorderStatus('APPROVED', workorder._id);
  };

  const handleWorkOrderSuggest = () => {
    changeWorkorderStatus('AMEND', workorder._id, suggestReason);
  };

  const handleWorkOrderReject = () => {
    changeWorkorderStatus('DROPPED', workorder._id);
  };
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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const alertStatus = (status: string) => {
    switch (status) {
      case 'AMEND':
      case 'REVIEW':
        return (
          <Alert severity='info'>
            Please review the information for the Work Order and approve. If
            there are any changes you would like to make to the Work Order,
            please contact the CAM or the Hiring Manager.
          </Alert>
        );
        break;
      case 'DROPPED':
        return (
          <Alert severity='error'>This Work Order was Rejected by you.</Alert>
        );
        break;
      case 'APPROVED':
        return (
          <Alert severity='success'>This Work Order was Approved by you.</Alert>
        );
    }
  };

  const classes = useStyles();
  return (
    <>
      <OPLoader isLoading={isLoading} />

      <Box m={2}>{alertStatus(workorder.status)}</Box>
      <Grid container direction='row' spacing={6}>
        <Grid item xs={6}>
          <ClientOrganization workorder={workorder} />
        </Grid>

        <Grid item xs={6}>
          <VendorOrganization workorder={workorder} />
        </Grid>
      </Grid>
      {/* <Grid item className={classes.margin}>
        <Divider className={classes.dividerColor} />
      </Grid> */}

      {/* <Grid item xs={12} container direction='column' spacing={2}>
        <Grid item>
          <Typography
            gutterBottom
            variant='h6'
            color='primary'
            className={classes.font}>
            Contractual Components
          </Typography>
        </Grid>
        <Grid item>
          <ContractualComponentsTable />
        </Grid>
      </Grid> */}
      <Grid item className={classes.margin}>
        <Divider className={classes.dividerColor} />
      </Grid>
      <PositionResource workorder={workorder} version={true} />
      <Grid item className={classes.margin}>
        <Divider className={classes.dividerColor} />
      </Grid>
      {/* <Grid item className={classes.margin}>
        <Divider className={classes.dividerColor} />
      </Grid>
      <Grid item className={classes.margin}>
        <Divider className={classes.dividerColor} />
      </Grid> */}
      {/* <Grid item>
        <Button variant='contained' color='primary' onClick={downloadWorkorder}>
          Download Workorder
        </Button>
      </Grid> */}
      <Grid item container direction='column' spacing={2}>
        <Grid item xs={4}>
          <Typography
            gutterBottom
            variant='h6'
            color='primary'
            className={classes.font}>
            Status of Approval
            {workorder.status ? (
              <OPKeyValue label='Current Status' value={workorder.status} />
            ) : (
              ''
            )}
          </Typography>
        </Grid>
        {(workorder.status === 'REVIEW' || workorder.status === 'AMEND') && (
          <>
            <Grid item>
              <Typography gutterBottom variant='body2' color='inherit'>
                Click the button below to Approve/Reject/Suggest Ammendment
              </Typography>
            </Grid>
            <Grid
              item
              container
              direction='row'
              spacing={2}
              alignItems='center'>
              <Grid item>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => setAreYouSureOpenApprove(true)}>
                  Approve
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => setAreYouSureOpenReject(true)}>
                  Reject
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='outlined'
                  color='primary'
                  // onClick={() => setAreYouSureOpenSuggest(true)}>
                  onClick={handleClickOpen}>
                  Suggest Amendment
                </Button>
              </Grid>
            </Grid>
          </>
        )}
        {workorder.status === 'APPROVED' && (
          <>
            <Grid item>
              <Divider className={classes.dividerColor} />
            </Grid>
            <Grid item container alignItems='center'>
              <Grid item>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={downloadWorkorder}>
                  Download Workorder
                </Button>
              </Grid>
            </Grid>
          </>
        )}

        {/* {workorder.status === 'DROPPED' && (
          <Box m={3}>
            <Alert severity='error'>This Work Order was Dropped By you!</Alert>
          </Box>
        )} */}

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth='lg'
          aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>Amend Reason</DialogTitle>
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
              onClick={() => {
                changeWorkorderStatus('AMEND', workorder._id, reasonValue);
              }}
              color='primary'>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <OPAreYouSure
          title='Are you sure you want to submit'
          isOpen={areYouSureOpenApprove}
          closeAreYouSure={() => setAreYouSureOpenApprove(false)}
          functionToCall={handleWorkOrderSubmit}>
          This will submit work order.
        </OPAreYouSure>
        <OPAreYouSure
          title='Are you sure you want to reject'
          isOpen={areYouSureOpenReject}
          closeAreYouSure={() => setAreYouSureOpenReject(false)}
          functionToCall={handleWorkOrderReject}>
          This will reject work order.
        </OPAreYouSure>
      </Grid>
    </>
  );
};

export default WorkOrderSummary;
