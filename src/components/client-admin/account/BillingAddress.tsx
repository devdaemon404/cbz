import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';
import InputField from 'src/components/common/FormFields/InputField';
import SelectField from 'src/components/common/FormFields/SelectField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperPadding: {
      padding: theme.spacing(3, 4),
    },
    fontBold: {
      fontWeight: 'bold',
    },
  }),
);

const country = [{ value: 'INDIA', label: 'India' }];

const BillingAddress = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction='column'
      spacing={1}
      style={{ marginTop: '1rem' }}>
      <Grid item>
        <Typography variant='h6' color='primary' className={classes.fontBold}>
          Billing Address
        </Typography>
      </Grid>
      <Grid item>
        <Paper variant='outlined' className={classes.paperPadding}>
          <Grid container direction='row' spacing={2}>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Address Line 1<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField
                name='b_address_line_1'
                placeholder='Enter Address Line 1'
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Address Line 2
              </Typography>
              <InputField
                name='b_address_line_2'
                placeholder='Enter Address Line 2'
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Address Line 3
              </Typography>
              <InputField
                name='b_address_line_3'
                placeholder='Enter Address Line 3'
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Town/City<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField name='b_town_city' placeholder='Enter Town/City' />
            </Grid>

            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Country<span style={{ color: 'red' }}>*</span>
              </Typography>
              <SelectField name='b_country' data={country} />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Postal Code<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField name='b_pin_code' placeholder='Enter Postal Code' />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BillingAddress;
