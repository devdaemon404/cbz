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

const OrganisationDetails = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction='column'
      spacing={1}
      style={{ marginTop: '1rem' }}>
      <Grid item>
        <Typography variant='h6' color='primary' className={classes.fontBold}>
          Organization Name
        </Typography>
      </Grid>
      <Grid item>
        <Paper variant='outlined' className={classes.paperPadding}>
          <Grid container direction='row' spacing={2}>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Organization Name<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField
                name='organization_name'
                placeholder='Enter Organization Name'
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrganisationDetails;
