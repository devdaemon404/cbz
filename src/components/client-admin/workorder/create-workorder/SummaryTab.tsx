import React, { useContext, useState } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Typography,
  Paper,
  TextField,
} from '@material-ui/core';
import OPLoader from 'src/components/common/OPLoader';
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';
import InputField from 'src/components/common/FormFields/InputField';
import SelectField from 'src/components/common/FormFields/SelectField';
import { useFormikContext } from 'formik';
import DatePickerField from 'src/components/common/FormFields/DatePickerField';
import Alert from '@material-ui/lab/Alert';

import moment from 'moment';
import OPKeyValue from 'src/components/common/OPKeyValue';

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
    alertPadding: {
      margin: theme.spacing(3, 1, 3, 1),
    },
    inputRootDesc: {
      '&$disabled': {
        color: '#222',
      },
      backgroundColor: 'white',
    },
    textBackground: {
      backgroundColor: '#DBE2E7',
      padding: theme.spacing(1),
    },
    boldFont: {
      fontWeight: theme.typography.fontWeightMedium,
    },
  }),
);

const SummaryTab = () => {
  const { values }: { values: any } = useFormikContext();
  const classes = useStyles();
  return (
    <>
      {/* <Alert severity='info' className={classes.alertPadding}></Alert> */}
      <Grid container spacing={3} direction='column'>
        <Grid item>
          <Grid
            container
            direction='row'
            wrap='nowrap'
            justify='center'
            spacing={3}>
            <Grid item xs={6}>
              <Paper variant='outlined' className={classes.paperStyle}>
                <Grid container direction='column' spacing={4}>
                  <Grid
                    item
                    container
                    direction='row'
                    alignItems='center'
                    spacing={2}>
                    <Grid item>
                      <Typography
                        gutterBottom
                        variant='h6'
                        color='primary'
                        className={classes.font}>
                        Client Organization Detail
                      </Typography>
                    </Grid>
                    <Grid item container direction='row' spacing={2}>
                      <Grid item xs={12}>
                        <OPKeyValue
                          label='Client Organization Name'
                          value='No Information Provided'
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      item
                      direction='row'
                      spacing={6}
                      justify='flex-start'>
                      <Grid item xs={12} lg={12}>
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
                          value='No Info Provided'
                          InputProps={{
                            classes: {
                              root: classes.inputRootDesc,
                              disabled: classes.disabled,
                            },
                          }}
                          disabled
                        />
                      </Grid>
                      {/* <Grid item xs={12} lg={12}>
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
                          value='No Information Provided'
                          InputProps={{
                            classes: {
                              root: classes.inputRootDesc,
                              disabled: classes.disabled,
                            },
                          }}
                          disabled
                        />
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper variant='outlined' className={classes.paperStyle}>
                <Grid container direction='column' spacing={4}>
                  <Grid
                    item
                    container
                    direction='row'
                    alignItems='center'
                    spacing={2}>
                    <Grid item>
                      <Typography
                        gutterBottom
                        variant='h6'
                        color='primary'
                        className={classes.font}>
                        Vendor Organization Detail
                      </Typography>
                    </Grid>
                    <Grid item container direction='row' spacing={2}>
                      <Grid item xs={12}>
                        <OPKeyValue
                          label='Client Organization Name'
                          value='No Information Provided'
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      item
                      direction='row'
                      spacing={6}
                      justify='flex-start'>
                      <Grid item xs={12} lg={12}>
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
                          value='No Info Provided'
                          InputProps={{
                            classes: {
                              root: classes.inputRootDesc,
                              disabled: classes.disabled,
                            },
                          }}
                          disabled
                        />
                      </Grid>
                      {/* <Grid item xs={12} lg={12}>
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
                          value='No Information Provided'
                          InputProps={{
                            classes: {
                              root: classes.inputRootDesc,
                              disabled: classes.disabled,
                            },
                          }}
                          disabled
                        />
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
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
                  {values.requestedResource}
                </Grid>
              </Grid>

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
                  {values.officialEmail}
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
                  {values.posId}
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
                  {values.jobType}
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
                  {values.posReportsTo}
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
                  {values.posTitle}
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
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  {values.rateType}
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
                  {values.currency}
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
              Estimated Workorder Amount
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
                  {moment(values.startDate).format('DD MMM YYYY')}
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
                  {/* <DatePickerField name={endDate.name} size='small' fullWidth /> */}
                  {moment(values.endDate).format('DD MMM YYYY')}
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
                      Duration
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                  {Math.round(
                    moment(new Date(values.endDate)).diff(
                      new Date(values.startDate),
                      'months',
                      true,
                    ),
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default SummaryTab;
