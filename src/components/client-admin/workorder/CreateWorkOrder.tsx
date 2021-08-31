import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Paper,
  Theme,
  Typography,
  Select,
  MenuItem,
  Divider,
  InputAdornment,
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import { AccountCircle } from '@material-ui/icons';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  font: {
    fontWeight: 'bolder',
    paddingTop: 10,
    margin: theme.spacing(2, 0, 2, 0),
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  paperPadding: {
    padding: theme.spacing(0, 4, 4, 4),
    flexGrow: 1,
  },
  jobDescPaperPadding: {
    padding: theme.spacing(0, 4, 4, 4),
    flexGrow: 1,
  },
  paperPadding2: {
    padding: theme.spacing(2, 4, 4, 4),
    flexGrow: 1,
    height: 450,
  },
  inputRootDesc: {
    '&$disabled': {
      color: '#222',
    },
    backgroundColor: 'white',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  headingMargin: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  disabled: {},
  buttonMargin: {
    marginTop: theme.spacing(3),
  },
  paperField: {
    padding: '5px 10px',
    background: 'rgba(13,60,97,0.15)',
    margin: '0px 10px 0px 0px',
  },

  labeler: {
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'right',
    margin: '0px auto',
  },
  typo: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}));

interface optionType {
  value: string | number;
  label: string;
}

interface listDataType {
  name: string;
  type: string;
  selectOptions: optionType[];
  value: string;
}

const CreateWorkOrder = ({ openCreatePage, setOpenCreatePage }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    work_id: '',
    official_email: '',
    demand_id: '',
    job_type: '',
    reporting_manager: '',
    designation: '',
    rate_card: '',
    currency: '',
    start_date: new Date(),
    end_date: new Date(),
    duration: '',
  });
  const demandInformation: listDataType[] = [
    {
      name: 'Resource Name',
      type: 'text',
      selectOptions: [{ value: '', label: '' }],
      value: 'name',
    },

    {
      name: 'Work ID',
      type: 'text',
      selectOptions: [{ value: '', label: '' }],
      value: 'work_id',
    },

    {
      name: ' Official Email',
      type: 'text',
      selectOptions: [{ value: '', label: '' }],
      value: 'official_email',
    },
  ];

  const skills: listDataType[] = [
    {
      name: 'Demand ID#',
      type: 'text',
      selectOptions: [{ value: '', label: '' }],
      value: 'demand_id',
    },
    {
      name: 'Job Type',
      type: 'text',
      selectOptions: [{ value: '', label: '' }],
      value: 'job_type',
    },
    {
      name: 'Reporting Manager',
      type: 'text',
      selectOptions: [{ value: '', label: '' }],
      value: 'reporting_manager',
    },
    {
      name: 'Designation',
      type: 'text',
      selectOptions: [{ value: '', label: '' }],
      value: 'designation',
    },
    {
      name: 'Rate card',
      type: 'text',
      selectOptions: [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '30', label: '30' },
      ],
      value: 'rate_card',
    },
    {
      name: 'Currency',
      type: 'select',
      selectOptions: [
        { value: 'INR', label: 'Indian Rupees' },
        { value: 'USD', label: 'US Dollars' },
        { value: 'EUR', label: 'Euros' },
        // { value: '30', label: '30' },
      ],
      value: 'currency',
    },
  ];

  const additionalInfo: listDataType[] = [
    // { name: 'Email Enabled',type:'text',selectOptions:[{value:'', label:''}], value: email_enabled === 'true' ? 'Yes' : 'No' },

    {
      name: 'Start Date',
      type: 'date',
      selectOptions: [{ value: '', label: '' }],
      value: 'start_date',
    },
    {
      name: 'End Date',
      type: 'date',
      selectOptions: [{ value: '', label: '' }],
      value: 'end_date',
    },
    // {
    //   name: 'Estimated Total Spend',
    //   type: 'text',
    //   selectOptions: [{ value: '', label: '' }],
    //   value: 'estimated_total_spend',
    // },
    {
      name: 'Duration',
      type: 'duration',
      selectOptions: [{ value: '', label: '' }],
      value: 'duration',
    },
  ];

  return (
    <div>
      <Grid container spacing={3} className={classes.paperPadding2}>
        <Grid item xs={12}>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              color='primary'
              className={classes.font}>
              Resource
            </Typography>

            <Grid
              container
              item
              spacing={2}
              direction='row'
              justify='flex-start'
              alignItems='center'
              xs={12}>
              {demandInformation.map((demand) => {
                const { name, value, type, selectOptions } = demand;
                return (
                  <Grid container item direction='row' xs={4}>
                    <Grid item lg={6}>
                      <Paper
                        variant='outlined'
                        elevation={0}
                        className={classes.paperField}>
                        <Typography
                          variant='body2'
                          color='inherit'
                          className={classes.labeler}>
                          {name}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                      {type === 'text' && (
                        <TextField
                          variant='outlined'
                          size='small'
                          value={formData?.[value] || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              [value]: e.target.value,
                            });
                          }}
                          name={value}></TextField>
                      )}

                      {type === 'select' && (
                        <TextField
                          select
                          fullWidth
                          variant='outlined'
                          size='small'
                          value={formData?.[value] || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              [value]: e.target.value,
                            });
                          }}
                          SelectProps={{
                            native: true,
                          }}>
                          {selectOptions.map((option) => (
                            <option key={option?.value} value={option?.value}>
                              {option?.label}
                            </option>
                          ))}
                        </TextField>
                      )}
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              color='primary'
              className={classes.font}>
              Work Assignment
            </Typography>
            <Grid
              item
              container
              direction='row'
              xs={12}
              spacing={2}
              justify='flex-start'
              alignItems='center'>
              <Grid container direction='row' item xs={12} spacing={2}>
                {skills.map((demand) => {
                  const { name, value, type, selectOptions } = demand;
                  return (
                    <Grid container item direction='row' xs={4}>
                      <Grid item lg={6}>
                        <Paper
                          variant='outlined'
                          elevation={0}
                          className={classes.paperField}>
                          <Typography
                            variant='body2'
                            color='inherit'
                            className={classes.labeler}>
                            {name}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                        {type === 'text' && (
                          <TextField
                            variant='outlined'
                            size='small'
                            value={formData?.[value] || ''}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [value]: e.target.value,
                              });
                            }}
                            name={value}></TextField>
                        )}
                        {type === 'select' && (
                          <TextField
                            select
                            fullWidth
                            variant='outlined'
                            value={formData?.[value] || ''}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [value]: e.target.value,
                              });
                            }}
                            size='small'
                            SelectProps={{
                              native: true,
                            }}>
                            {selectOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </TextField>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={3}
            variant='outlined'
            className={classes.paperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              className={classes.font}
              color='primary'>
              Estimated Work Order Amount
            </Typography>
            <Grid
              item
              container
              direction='row'
              xs={12}
              spacing={2}
              justify='flex-start'
              alignItems='center'>
              <Grid container direction='row' item xs={12} spacing={2}>
                {additionalInfo.map((demand) => {
                  const { name, value, type, selectOptions } = demand;
                  return (
                    <Grid container item direction='row' xs={4}>
                      <Grid item lg={6}>
                        <Paper
                          variant='outlined'
                          elevation={0}
                          className={classes.paperField}>
                          <Typography
                            variant='body2'
                            color='inherit'
                            className={classes.labeler}>
                            {name}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                        {type === 'text' && (
                          <TextField
                            variant='outlined'
                            size='small'
                            value={formData?.[value] || ''}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [value]: e.target.value,
                              });
                            }}
                            name={value}></TextField>
                        )}
                        {type === 'select' && (
                          <TextField
                            select
                            fullWidth
                            variant='outlined'
                            size='small'
                            value={formData?.[value] || ''}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [value]: e.target.value,
                              });
                            }}
                            SelectProps={{
                              native: true,
                            }}>
                            {selectOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </TextField>
                        )}{' '}
                        {type === 'duration' && (
                          <TextField
                            variant='outlined'
                            size='small'
                            value={formData?.[value] || ''}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position='end'
                                  variant='outlined'>
                                  <AccessTimeIcon />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [value]: e.target.value,
                              });
                            }}
                            name={value}></TextField>
                        )}
                        {type === 'date' && (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              inputVariant='outlined'
                              // {...(modalType === 'new'
                              //   ? {
                              //       value: modalData.startDate,
                              //     }
                              //   : { value: modalData.startDate })}

                              value={formData?.[value] || ''}
                              onChange={(e) => {
                                console.log(e);
                                if (e) {
                                  setFormData({
                                    ...formData,
                                    [value]: e.toISOString(),
                                  });
                                }
                              }}
                              format='dd/MM/yy'
                              size='small'
                              fullWidth
                            />
                          </MuiPickersUtilsProvider>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Button
          onClick={(e) => {
            setOpenCreatePage(false);
          }}>
          Back
        </Button>
      </Grid>
    </div>
  );
};

export default CreateWorkOrder;
