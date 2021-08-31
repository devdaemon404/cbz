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
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';
import SummaryStep from 'src/components/project-manager/SummaryStep';
import ContractualComponentsTable from './tables/ContractualComponentsTable';

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

  const {
    isLoading,
    changeWorkorderStatus,
    suggestReason,
    setSuggestReason,
  } = useContext(CAWorkorderContext);

  console.log(workorder.status);

  const handleWorkOrderSubmit = () => {
    changeWorkorderStatus('APPROVED', workorder._id);
  };

  const handleWorkOrderSuggest = () => {
    changeWorkorderStatus('AMEND', workorder._id);
  };

  const handleWorkOrderReject = () => {
    changeWorkorderStatus('DROPPED', workorder._id);
  };

  const statusBasedData = (workorder: WorkOrderDataType) => {
    const { status, suggestions } = workorder;
    switch (status) {
      case 'REVIEW':
        return (
          <>
            <Box m={4}>
              <Box m={2}>
                <Alert severity='info'>
                  This Work Order is yet to be Reviewed by Vice President.
                </Alert>
              </Box>
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
              <PositionResource
                workorder={workorder}
                version={true}
                status={status}
              />
            </Box>
          </>
        );
        return;
      case 'AMEND':
        return (
          <>
            <Box m={3}>
              <Alert severity='info'>
                This Work Order neeeds to Updated, please follow the{' '}
                <b>Suggestion</b>:{' '}
                <b>{suggestions[suggestions.length - 1].suggestion}</b>
              </Alert>
            </Box>
          </>
        );
        break;
      case 'APPROVED':
        return (
          <Box m={4}>
            <Box m={2}>
              <Alert severity='success'>
                This Work Order was Approved by the Vice President.
              </Alert>
            </Box>
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
            <PositionResource
              workorder={workorder}
              version={true}
              status={status}
            />
          </Box>
        );
        break;
      case 'DROPPED':
        return (
          <>
            <Box m={4}>
              <Box m={2}>
                <Alert severity='error'>
                  This Work Order was Dropped by the Vice President.
                </Alert>
              </Box>
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
              </Grid>

              <Grid item xs={12} container direction='column' spacing={2}>
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
              <PositionResource
                workorder={workorder}
                version={true}
                status={status}
              />
            </Box>
          </>
        );
        break;
    }
  };

  const classes = useStyles();
  return (
    <>
      <OPLoader isLoading={isLoading} />
      {statusBasedData(workorder)}
    </>
  );
};

export default WorkOrderSummary;

{
  /* <PositionResource workorder={workorder} version={true} />
        <Grid item className={classes.margin}>
          <Divider className={classes.dividerColor} />
        </Grid>
        <ClientOrganization workorder={workorder} />
        <Grid item className={classes.margin}>
          <Divider className={classes.dividerColor} />
        </Grid>
        <VendorOrganization workorder={workorder} />

        <Grid item className={classes.margin}>
          <Divider className={classes.dividerColor} />
        </Grid>
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
          {workorder.status === 'PENDING' && (
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
                    onClick={() => setAreYouSureOpenSuggest(true)}>
                    Suggest Amendment
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          {workorder.status === 'REVIEW' && (
            <>
              <Grid item>
                <Typography gutterBottom variant='body2' color='inherit'>
                  Click the button below to Suggest Ammendment
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
                    onClick={() => setAreYouSureOpenSuggest(true)}>
                    Suggest Amendment
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          <OPAreYouSure
            title='Please provide a reason for amending'
            isOpen={areYouSureOpenSuggest}
            closeAreYouSure={() => setAreYouSureOpenSuggest(false)}
            functionToCall={handleWorkOrderSuggest}>
            <TextField
              multiline
              fullWidth
              rows={3}
              placeholder='Enter reason here...'
              value={suggestReason}
              onChange={(e) => setSuggestReason(e.target.value)}
              variant='outlined'
            />
          </OPAreYouSure>
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
        </Grid> */
}
