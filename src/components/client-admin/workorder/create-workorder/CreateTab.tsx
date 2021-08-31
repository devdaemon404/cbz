import React, { useState, useContext, useEffect } from 'react';
import { Grid, Typography, Paper, Theme, TextField } from '@material-ui/core';
import InputField from 'src/components/common/FormFields/InputField';
import SelectField from 'src/components/common/FormFields/SelectField';
import DatePickerField from 'src/components/common/FormFields/DatePickerField';
import { workorderFormModel } from './FormModel/workorderFormModel';
import { createStyles, makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';
import { useFormikContext } from 'formik';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dividerColor: {
      backgroundColor: theme.palette.primary.main,
    },
    font: {
      fontWeight: 'bold',
      marginBottom: theme.spacing(2),
    },
    paperStyle: {
      width: '100%',
      padding: theme.spacing(4),
    },
    alignCenter: {
      alignSelf: 'center',
    },
    disabled: {},
    paperField: {
      padding: '5px 10px',
      background: 'rgba(13,60,97,0.15)',
      margin: '0px 10px 0px 0px',
    },
    labeler: {
      fontWeight: 'bold',
      padding: 5,
      textAlign: 'right',
      // margin: '0px auto',
    },
    typo: {
      fontWeight: 'bold',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
  }),
);

export default function CreateTab(props) {
  const classes = useStyles();

  const { amendSuggestion, editMode } = useContext(CAWorkorderContext);
  const { values }: { values: any } = useFormikContext();

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  const {
    formField: {
      requestedResource,
      officialEmail,
      // workId,
      posId,
      posReportsTo,
      posTitle,
      rateType,
      currency,
      startDate,
      endDate,
      // duration,
      jobType,
      rate,
    },
  } = workorderFormModel;

  const currencies = [
    {
      value: 'INR',
      label: 'Rupees',
    },
    {
      value: 'USD',
      label: 'Dollars',
    },
    {
      value: 'EUR',
      label: 'Euros',
    },
  ];

  const _rate = [
    {
      value: 'per_hour',
      label: 'Per Hour',
    },

    {
      value: 'per_month',
      label: 'Per Month',
    },
  ];

  return (
    <React.Fragment>
      <Grid container spacing={3} direction='column'>
        {amendSuggestion && (
          <Grid item>
            <Alert severity='info'>
              <b>Amend Suggestion: </b>
              {amendSuggestion}
            </Alert>
          </Grid>
        )}

        <Grid item>
          <Paper variant='outlined' className={classes.paperStyle}>
            <Typography
              variant='body1'
              color='primary'
              className={classes.font}>
              Resource
            </Typography>
            <Grid container direction='row' wrap='nowrap' spacing={5}>
              <Grid item container direction='row' xs={6} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Resource Name
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <InputField
                    variant='outlined'
                    size='small'
                    name={requestedResource.name}
                  />
                </Grid>
              </Grid>
              {/*<Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Work ID
                    </Typography>
                  </Paper>
                </Grid> 
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <InputField
                    variant='outlined'
                    size='small'
                    name={workId.name}
                  />
                </Grid>
              </Grid>*/}
              <Grid item container direction='row' xs={6} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Official Email
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <InputField
                    variant='outlined'
                    size='small'
                    name={officialEmail.name}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper variant='outlined' className={classes.paperStyle}>
            <Typography
              variant='body1'
              color='primary'
              className={classes.font}>
              Work Assignment
            </Typography>
            <Grid container direction='row' spacing={5}>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Demand ID#
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <InputField
                    variant='outlined'
                    size='small'
                    name={posId.name}
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Job Type
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <InputField
                    variant='outlined'
                    size='small'
                    name={jobType.name}
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Reporting Manager
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <InputField
                    variant='outlined'
                    size='small'
                    name={posReportsTo.name}
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Designation
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <InputField
                    variant='outlined'
                    size='small'
                    name={posTitle.name}
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Rate Card
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  spacing={1}
                  direction='row'
                  wrap='nowrap'
                  classes={{ item: classes.alignCenter }}>
                  <Grid item>
                    <SelectField name={rate.name} data={_rate} />
                  </Grid>
                  <Grid item>
                    <InputField
                      variant='outlined'
                      size='small'
                      name={rateType.name}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Currency
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <SelectField name={currency.name} data={currencies} />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper variant='outlined' className={classes.paperStyle}>
            <Typography
              variant='body1'
              color='primary'
              className={classes.font}>
              Estimated Work Order Amount
            </Typography>
            <Grid container direction='row' wrap='nowrap' spacing={5}>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Start Date
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <DatePickerField
                    name={startDate.name}
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      End Date
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  <DatePickerField name={endDate.name} size='small' fullWidth />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={4} wrap='nowrap'>
                <Grid item xs={6}>
                  <Paper variant='outlined' className={classes.paperField}>
                    <Typography
                      noWrap
                      variant='body2'
                      color='inherit'
                      className={classes.labeler}>
                      Duration (Months)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
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
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
