import React, { useContext } from 'react';
import PMDemandContext from '../../contexts/project-manager/demand/pm-demand-context';
import 'date-fns';
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
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridPadding: {
      padding: theme.spacing(4),
    },
    compulsory: {
      color: theme.palette.error.main,
    },
  }),
);

const DemandInformation = () => {
  const classes = useStyles();

  const {
    demandInfo,
    handleDemandInfoChange,
    validation,
    handleDateChange,
  } = useContext(PMDemandContext);
  const {
    demand_name: demand_name_validation,
    // profile_name: profile_name_validation,
    quantity: quantity_validation,
    expense: expense_validation,
    duration: duration_validation,
    hours_per_week: hours_per_week_validation,
    location: location_validation,
  } = validation;

  interface DemandInfoDataType {
    label: string;
    fieldName: string;
    key: string | number;
    type?: string;
    helperText?: string;
    error?: boolean;
  }

  const {
    name,
    // profile_name,
    quantity,
    startDate,
    endDate,
    duration,
    expense,
    hours_per_week,
    location,
  } = demandInfo;

  const demandInfoData: DemandInfoDataType[] = [
    {
      label: 'Demand Name',
      fieldName: 'name',
      key: name,
      helperText: demand_name_validation.helperText,
      error: demand_name_validation.error,
    },
    // {
    //   label: 'Profile Name',
    //   fieldName: 'profile_name',
    //   key: profile_name,
    //   helperText: profile_name_validation.helperText,
    //   error: profile_name_validation.error,
    // },
    {
      label: 'Qty',
      type: 'number',
      fieldName: 'quantity',
      key: quantity,
      helperText: quantity_validation.helperText,
      error: quantity_validation.error,
    },
    {
      label: 'Start Date',
      type: 'date',
      fieldName: 'startDate',
      key: startDate,
    },
    {
      label: 'End Date',
      type: 'date',
      fieldName: 'endDate',
      key: endDate,
    },
    // {
    //   label: 'Estimated Expense',
    //   fieldName: 'expense',
    //   type: 'number',
    //   key: expense,
    //   helperText: expense_validation.helperText,
    //   error: expense_validation.error,
    // },
    {
      label: 'Duration(Months)',
      type: 'number',
      fieldName: 'duration',
      key: duration,
      helperText: duration_validation.helperText,
      error: duration_validation.error,
    },
    {
      label: 'Hrs/Wk',
      type: 'number',
      fieldName: 'hours_per_week',
      key: hours_per_week,
      helperText: hours_per_week_validation.helperText,
      error: hours_per_week_validation.error,
    },
    {
      label: 'Location',
      fieldName: 'location',
      key: location,
      helperText: location_validation.helperText,
      error: location_validation.error,
    },
    // {
    //   label: 'PO Number',
    //   fieldName: 'po_number',
    //   key: po_number,
    //   helperText: po_number_validation.helperText,
    //   error: po_number_validation.error,
    // },
    // {
    //   label: 'Client Manager',
    //   fieldName: 'client_id',
    //   key: client_id,
    // },
  ];

  const isError = (fieldName): boolean => {
    const validationArray = Object.keys(validation);
    let _error = false;
    validationArray.map((name) => {
      if (fieldName === name && validation[name].error) {
        _error = true;
      }
    });
    return _error;
  };

  const getHelperText = (fieldName): string => {
    const validationArray = Object.keys(validation);
    let _helperText = '';
    validationArray.map((name) => {
      if (fieldName === name && validation[name].error) {
        _helperText = validation[name].helperText;
      }
    });
    return _helperText;
  };

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid
          container
          direction='row'
          spacing={2}
          className={classes.gridPadding}>
          {demandInfoData.map((data) =>
            data.type === 'date' ? (
              <Grid item xs={6}>
                <Typography>
                  {data.label}
                  <span className={classes.compulsory}>*</span>
                </Typography>
                <KeyboardDatePicker
                  clearable
                  fullWidth
                  value={data.key}
                  variant='inline'
                  inputVariant='outlined'
                  onChange={(date) => handleDateChange(date, data.fieldName)}
                  size='small'
                  // minDate={new Date()}
                  format='dd-MM-yyyy'
                />
              </Grid>
            ) : (
              <Grid item xs={6}>
                <Typography>
                  {data.label}
                  <span className={classes.compulsory}>*</span>
                </Typography>
                <TextField
                  error={isError(data.fieldName)}
                  required
                  margin='dense'
                  fullWidth
                  size='small'
                  name={data.fieldName}
                  variant='outlined'
                  value={data.key}
                  placeholder={data.label}
                  type={data.type ?? undefined}
                  inputProps={
                    data.fieldName === 'hours_per_week'
                      ? {
                          max: '168',
                        }
                      : {}
                  }
                  onChange={(e) => {
                    handleDemandInfoChange(e);
                  }}
                  helperText={getHelperText(data.fieldName)}
                />
              </Grid>
            ),
          )}
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DemandInformation;
