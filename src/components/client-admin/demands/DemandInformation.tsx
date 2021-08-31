import React, { useContext } from 'react';
import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import 'date-fns';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  Grid,
  Typography,
  TextField,
  makeStyles,
  createStyles,
  Theme,
  MenuItem,
} from '@material-ui/core';
import InputField from 'src/components/common/FormFields/InputField';
import DatePickerField from 'src/components/common/FormFields/DatePickerField';
import { useFormikContext } from 'formik';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridPadding: {
      padding: theme.spacing(4),
      flexGrow: 1,
    },
    compulsory: {
      color: theme.palette.error.main,
    },
  }),
);

const DemandInformation = (props: any) => {
  const classes = useStyles();
  const { values }: { values: any } = useFormikContext();

  const {
    formField: {
      name,
      // profile_name,
      quantity,
      startDate,
      duration,
      endDate,
      // expense,
      location,
      hours_per_week,
    },
  } = props;

  return (
    <div style={{ padding: '2rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {name.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={name.name} fullWidth size='small' />
        </Grid>

        {/* <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {profile_name.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={profile_name.name} fullWidth size='small' />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {quantity.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField
            type='number'
            name={quantity.name}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {startDate.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <DatePickerField
            name={startDate.name}
            format='dd/MM/yy'
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {endDate.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <DatePickerField
            name={endDate.name}
            format='dd/MM/yy'
            size='small'
            fullWidth
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {expense.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField
            type='number'
            name={expense.name}
            fullWidth
            size='small'
          />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            Duration (Months) <span style={{ color: 'red' }}>*</span>
          </Typography>
          {/* <InputField
            type='number'
            name={duration.name}
            fullWidth
            size='small'
          /> */}
          <TextField
            fullWidth
            value={Math.round(
              moment(new Date(values.endDate)).diff(
                new Date(values.startDate),
                'months',
                true,
              ),
            )}
            size='small'
            variant='outlined'
            // disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {hours_per_week.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField
            type='number'
            name={hours_per_week.name}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {location.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={location.name} fullWidth size='small' />
        </Grid>
      </Grid>
    </div>
  );
};

export default DemandInformation;
