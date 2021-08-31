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
} from '@material-ui/core';
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
import { printWorkorderPdf } from 'src/utils/workorderDownload';
import ContractualComponentsTable from './tables/ContractualComponentsTable';
import { CloudsBuzzInvoice } from 'src/utils/workorderDown';
import moment from 'moment';
// import ClientOrganization from 'src/components/client-admin/workorder/ClientOrganization';

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
  const { isLoading, changeWorkorderStatus, suggestReason } = useContext(
    MGRWorkorderContext,
  );
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

  const classes = useStyles();
  return (
    <>
      <OPLoader isLoading={isLoading} />
      <Grid container direction='row' spacing={6}>
        <Grid item xs={6}>
          <ClientOrganization workorder={workorder} />
        </Grid>

        <Grid item xs={6}>
          <VendorOrganization workorder={workorder} />
        </Grid>
      </Grid>

      <Grid item className={classes.margin}>
        <Divider className={classes.dividerColor} />
      </Grid>
      <PositionResource workorder={workorder} version={true} />
      <Grid item className={classes.margin}>
        <Divider className={classes.dividerColor} />
      </Grid>
      <Grid item>
        <Button variant='contained' color='primary' onClick={downloadWorkorder}>
          Download Workorder
        </Button>
      </Grid>
    </>
  );
};

export default WorkOrderSummary;
