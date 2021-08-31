import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Paper,
  Theme,
  Typography,
  MenuItem,
  Divider,
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import moment from 'moment';

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
    height: 300,
  },
  jobDescPaperPadding: {
    padding: theme.spacing(0, 4, 4, 4),
    flexGrow: 1,
  },
  paperPadding2: {
    padding: theme.spacing(2, 4, 4, 4),
    flexGrow: 1,
    height: 400,
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
  },

  labeler: {
    fontWeight: 'bold',
    padding: 5,
    margin: '0px auto',
  },
}));

const DemandsSummaryTab = ({ demandData }) => {
  const classes = useStyles();
  const [workTime, setWorkTime] = React.useState('EUR');
  // @ts-ignore

  // @ts-ignore
  const {
    name,
    quantity,
    endDate,
    profile_name,
    startDate,
    duration,
    hours_per_week,
    // @ts-ignore
    user_first_name,
    // @ts-ignore
    user_last_name,
    job_description,
    // @ts-ignore
    status,
    // @ts-ignore
    // request_id,
    primary_skills,
    secondary_skills,
    relevant_experience,
    additional_skills,
    total_experience,
    email_enabled,
    team_member_info_access,

    location,
    employment_type,
    shift,
    background_check_required,
  } = demandData;

  type DemandInformationType = {
    name: string;
    value: string | number;
  };

  type SkillInformationType = {
    name: string;
    value: string | number | string[];
  };

  type AdditionalInformationType = {
    name: string;
    value: string | boolean | number;
  };

  const demandInformation: DemandInformationType[] = [
    { name: 'Full Name', value: name },
    // { name: 'Required Profile Name', value: profile_name },
    { name: 'QTY', value: quantity },
    {
      name: 'Desired Start Date',
      value: new Date(startDate).toLocaleDateString(),
    },
    {
      name: 'Duration',
      value: Math.round(
        moment(new Date(endDate)).diff(new Date(startDate), 'months', true),
      ),
    },
    { name: 'Hrs/Wk', value: hours_per_week },
    { name: 'Desired End Date', value: new Date(endDate).toLocaleDateString() },
    { name: 'Location', value: location },
  ];

  const skills: SkillInformationType[] = [
    { name: 'Primary Skills', value: primary_skills.join(', ') },
    { name: 'Secondary Skills', value: secondary_skills.join(', ') },
    { name: 'Relevant Experience', value: relevant_experience },
    { name: 'Total Experience', value: total_experience },
    // { name: 'Additional Skills', value: additional_skills.join(', ') },
  ];

  const additionalInfo: AdditionalInformationType[] = [
    // { name: 'Email Enabled', value: email_enabled === 'true' ? 'Yes' : 'No' },

    // { name: 'Request Id', value: request_id },
    { name: 'Status', value: status },
    { name: 'Shift', value: shift },
    {
      name: 'Employement Type',
      value: employment_type === 'PART_TIME' ? 'Part Time' : 'Full Time',
    },
    {
      name: 'Background Check Required',
      value:
        background_check_required === 'true' ? 'Mandatory' : 'Non-Mandatory',
    },
  ];

  const handleWorkTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkTime(event.target.value);
  };
  return (
    <div>
      <Grid container spacing={3} className={classes.paperPadding2}>
        <Grid item xs={6}>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              color='primary'
              className={classes.font}>
              Demand Information
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
                const { name, value } = demand;
                return (
                  <Grid container item direction='row' xs={6}>
                    <Grid item lg={6} xs={6}>
                      {/* <Paper
                        variant='outlined'
                        elevation={0}
                        className={classes.paperField}> */}
                      <Typography
                        variant='body2'
                        color='inherit'
                        className={classes.labeler}>
                        {name}
                      </Typography>
                      {/* </Paper> */}
                    </Grid>
                    <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                      <Typography
                        variant='body2'
                        color='inherit'
                        align='left'
                        style={{ marginLeft: 12 }}>
                        {value || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              color='primary'
              className={classes.font}>
              Skills
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
                {skills.map((skill) => {
                  const { name, value } = skill;
                  return (
                    <Grid container item xs={6} spacing={1}>
                      <Grid item xs={6}>
                        {/* <Paper
                          variant='outlined'
                          elevation={0}
                          className={classes.paperField}> */}
                        <Typography
                          variant='body2'
                          color='inherit'
                          className={classes.labeler}>
                          {name}
                        </Typography>
                        {/* </Paper> */}
                      </Grid>
                      <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                        <Typography
                          variant='body2'
                          color='inherit'
                          align='left'
                          style={{ marginLeft: 12 }}>
                          {value || 'N/A'}
                        </Typography>
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
            className={classes.jobDescPaperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              className={classes.font}
              color='primary'>
              Job Description
            </Typography>
            <Grid container spacing={2} direction='row'>
              <Grid
                direction='row'
                spacing={2}
                item
                xs={12}
                justify='flex-start'
                alignItems='center'>
                <Typography>{job_description}</Typography>
              </Grid>
            </Grid>
            <Typography
              variant='h6'
              gutterBottom
              className={classes.font}
              color='primary'>
              File
            </Typography>
            <Grid container spacing={2} direction='row'>
              <Grid
                direction='row'
                spacing={2}
                item
                xs={12}
                justify='flex-start'
                alignItems='center'>
                <Typography>
                  {demandData.file ? demandData.file.name : 'Not uploaded'}
                </Typography>
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
              Additional Information
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
                {additionalInfo.map((addInfo) => {
                  const { name, value } = addInfo;
                  return (
                    <Grid container item direction='row' xs={6}>
                      <Grid item lg={6} xs={6}>
                        {/* <Paper
                          variant='outlined'
                          elevation={0}
                          className={classes.paperField}> */}
                        <Typography
                          variant='body2'
                          color='inherit'
                          className={classes.labeler}>
                          {name}
                        </Typography>
                        {/* </Paper> */}
                      </Grid>
                      <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                        <Typography
                          variant='body2'
                          color='inherit'
                          align='left'
                          style={{ marginLeft: 12 }}>
                          {value || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DemandsSummaryTab;
