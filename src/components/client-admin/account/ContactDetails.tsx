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

const ContactDetails = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction='column'
      spacing={1}
      style={{ marginTop: '1rem' }}>
      <Grid item>
        <Typography variant='h6' color='primary' className={classes.fontBold}>
          Contact Details
        </Typography>
      </Grid>
      <Grid item>
        <Paper variant='outlined' className={classes.paperPadding}>
          <Grid container direction='row' spacing={2}>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Official Email<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField
                name='official_email'
                placeholder='Enter Official Email'
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Critical Email<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField
                name='critical_email'
                placeholder='Enter Critical Email'
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Primary Contact Number<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField
                name='primary_phone_number'
                placeholder='Enter Primary Phone Number'
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Alternate Contact Number 1
              </Typography>
              <InputField
                name='alternate_phone_number_1'
                placeholder='Enter Alternate Phone Number 1'
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Alternate Contact Number 2
              </Typography>
              <InputField
                name='alternate_phone_number_2'
                placeholder='Enter Alternate Phone Number 2'
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContactDetails;
