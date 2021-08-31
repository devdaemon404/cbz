import React from 'react';
import {
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import OPKeyValue from 'src/components/common/OPKeyValue';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';

const useStyles = makeStyles((theme: Theme) => ({
  font: {
    fontWeight: 'bolder',
  },
  inputRootDesc: {
    '&$disabled': {
      color: '#222',
    },
    backgroundColor: 'white',
  },
  disabled: {},
  textBackground: {
    backgroundColor: '#DBE2E7',
    padding: theme.spacing(1),
  },
  boldFont: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const ClientOrganization = ({
  workorder,
}: {
  workorder: WorkOrderDataType;
}) => {
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
  }

  return (
    <>
      <Grid container direction='column' spacing={4}>
        <Grid item container direction='row' alignItems='center' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Client Organization Detail
            </Typography>
          </Grid>
          <Grid item container direction='row' spacing={4}>
            <Grid item lg={12} xs={12}>
              <OPKeyValue
                label='Client Organization Name'
                value={workorder.data.client.client_name}
              />
            </Grid>
          </Grid>
          {workorder.data.client.client_metadata ? (
            <>
              <Grid
                container
                item
                direction='row'
                spacing={6}
                justify='flex-start'>
                {/* <Grid item xs={12} lg={12}>
                  <Paper elevation={0} className={classes.textBackground}>
                    <Typography
                      variant='body2'
                      color='initial'
                      align='center'
                      className={classes.boldFont}>
                      Corporate Contact Information
                    </Typography>
                  </Paper>
                  <TextField
                    margin='dense'
                    size='small'
                    fullWidth
                    variant='outlined'
                    multiline
                    rows='3'
                    value={corporateContactInformation}
                    InputProps={{
                      classes: {
                        root: classes.inputRootDesc,
                        disabled: classes.disabled,
                      },
                    }}
                    disabled
                  />
                </Grid> */}
                <Grid item xs={12} lg={12}>
                  <Paper elevation={0} className={classes.textBackground}>
                    <Typography
                      variant='body2'
                      color='initial'
                      align='center'
                      className={classes.boldFont}>
                      Corporate Invoicing Site
                    </Typography>
                  </Paper>
                  <TextField
                    margin='dense'
                    size='small'
                    fullWidth
                    variant='outlined'
                    multiline
                    rows='3'
                    value={corporateInvoicingSite}
                    InputProps={{
                      classes: {
                        root: classes.inputRootDesc,
                        disabled: classes.disabled,
                      },
                    }}
                    disabled
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            <Grid style={{ margin: 'auto' }} item>
              <Typography variant='body1' color='initial' align='center'>
                No other client information provided.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ClientOrganization;
