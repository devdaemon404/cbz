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
import { accountFormModel } from './FormModel/accountFormModel';

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

const salutations = [
  {
    value: 'MR',
    label: 'Mr',
  },
  {
    value: 'MRS',
    label: 'Mrs',
  },
  {
    value: 'MS',
    label: 'Ms',
  },
];

const {
  formField: { salutation, firstname, lastname, designation },
} = accountFormModel;

const BasicInformation = () => {
  const classes = useStyles();
  return (
    <Grid container direction='column' spacing={1}>
      <Grid item>
        <Typography variant='h6' color='primary' className={classes.fontBold}>
          Basic Information
        </Typography>
      </Grid>
      <Grid item>
        <Paper variant='outlined' className={classes.paperPadding}>
          <Grid container direction='row' spacing={2}>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                First Name<span style={{ color: 'red' }}>*</span>
              </Typography>
              <Grid container direction='row' wrap='nowrap' spacing={1}>
                <Grid item xs={2}>
                  <SelectField name={salutation.name} data={salutations} />
                </Grid>
                <Grid item xs={10}>
                  <InputField
                    name={firstname.name}
                    placeholder='Enter First Name'
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Last Name<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField name={lastname.name} placeholder='Enter Last Name' />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1' color='initial'>
                Designation<span style={{ color: 'red' }}>*</span>
              </Typography>
              <InputField
                name={designation.name}
                placeholder='Enter Designation'
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BasicInformation;
