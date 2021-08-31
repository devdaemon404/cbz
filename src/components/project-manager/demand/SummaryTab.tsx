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

import { DemandDataType } from '../../../types/project-manager/demand';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  font: {
    fontWeight: 'bolder',
    margin: theme.spacing(2, 0, 2, 0),
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  paperPadding: {
    padding: theme.spacing(0, 4, 4, 4),
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
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  // label: {
  //   fontWeight: 'bold',
  //   fontSize: 13,
  //   color: '#0d3c61',
  // },
}));

const SummaryTab = ({
  changeValue,
  demandData,
}: {
  changeValue: () => void;
  demandData: DemandDataType;
}) => {
  const classes = useStyles();
  const [workTime, setWorkTime] = React.useState('EUR');
  const {
    id,
    name,
    quantity,
    expense,
    created,
    updated,
    enabled,
    deleted,
    profile_name,
    jd_file_name,
    client_id,
    user_id,
    startDate,
    endDate,
    location,
    project_generated_id,
    project_id,
    project_name,
    duration,
    hours_per_week,
    po_number,
    vendor_ids,
    user_first_name,
    user_last_name,
    job_description,
    status,
    request_id,
  } = demandData;

  const {
    primary_skills,
    secondary_skills,
    relevant_experience,
    additional_skills,
    total_experience,
  } = demandData.skills;

  // const {
  //   travel_expense_allowance,
  //   additional_supplier_info,
  //   justification,
  //   shift,
  //   background_check_required,
  // } = demandData.additional_info;

  // const {
  //   assignments,
  //   request_type,
  //   sub_status,
  //   labor_category,
  //   procurement_type,
  // } = demandData.summary;

  type DemandInformationType = {
    name: string;
    value: string | number | undefined;
  };

  type SkillInformationType = {
    name: string;
    value: string | number | string[];
  };

  type AdditionalInformationType = {
    name: string;
    value: string | boolean | number | undefined;
  };

  const demandInformation: DemandInformationType[] = [
    { name: 'Full Name', value: name },
    // { name: 'Required Profile Name', value: profile_name },
    { name: 'QTY', value: quantity },
    { name: 'Desired Start Date', value: startDate },
    { name: 'Desired End Date', value: endDate },
    { name: 'Duration', value: duration },
    { name: 'Hrs/Wk', value: hours_per_week },
    { name: 'Location', value: location },
    // {
    //   name: 'Client Manager Name',
    //   value: `${user_first_name} ${user_last_name}`,
    // },
    // { name: 'Estimated Expense', value: expense },
  ];

  const skills: SkillInformationType[] = [
    { name: 'Primary Skills', value: primary_skills.join(', ') },
    { name: 'Secondary Skills', value: secondary_skills.join(', ') },
    { name: 'Relevant Experience', value: relevant_experience },
    { name: 'Total Experience', value: total_experience },
    // { name: 'Additional Skills', value: additional_skills.join(', ') },
  ];

  const additionalInfo: AdditionalInformationType[] = [
    // { name: 'Request ID', value: request_id },
    // {
    //   name: 'Request Type',
    //   value:
    //     demandData.summary && demandData.summary.request_type
    //       ? demandData.summary.request_type
    //       : '-',
    // },
    // {
    //   name: 'Procurement Type',
    //   value:
    //     demandData.summary && demandData.summary.procurement_type
    //       ? demandData.summary.procurement_type
    //       : '-',
    // },
    // {
    //   name: 'Travel Expences WBS',
    //   value:
    //     demandData.summary &&
    //     demandData?.additional_info?.travel_expense_allowance
    //       ? demandData?.additional_info?.travel_expense_allowance
    //       : '-',
    // },
    // {
    //   name: 'Shift',
    //   value:
    //     demandData.summary && demandData?.additional_info?.shift
    //       ? demandData?.additional_info?.shift
    //       : '-',
    // },
    // { name: 'Status', value: status },
    // {
    //   name: 'Sub-Status',
    //   value:
    //     demandData.summary && demandData.summary.sub_status
    //       ? demandData.summary.sub_status
    //       : '-',
    // },
    // {
    //   name: 'Labor Category',
    //   value:
    //     demandData.summary && demandData.summary.labor_category
    //       ? demandData.summary.labor_category
    //       : '-',
    // },
    // {
    //   name: 'Has Assignments',
    //   value:
    //     demandData.summary && demandData.summary.assignments
    //       ? demandData.summary.assignments
    //       : '-',
    // },
    // {
    //   name: 'Additional Supplier Information',
    //   value:
    //     demandData.summary &&
    //     demandData?.additional_info?.additional_supplier_info
    //       ? demandData?.additional_info?.additional_supplier_info
    //       : '-',
    // },
    // {
    //   name: 'Justification',
    //   value:
    //     demandData.summary && demandData?.additional_info?.justification
    //       ? demandData?.additional_info?.justification
    //       : '-',
    // },
    // {
    //   name: 'Email Enabled',
    //   value:
    //     demandData.summary && demandData?.additional_info?.emailEnabled
    //       ? demandData?.additional_info?.emailEnabled
    //       : '-',
    // },
    // {
    //   name: 'Background Check',
    //   value:
    //     demandData.summary &&
    //     demandData?.additional_info?.backgroundCheckRequired
    //       ? demandData?.additional_info?.backgroundCheckRequired
    //       : '-',
    // },
  ];

  const handleWorkTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkTime(event.target.value);
  };
  return (
    <div>
      <Grid
        container
        spacing={3}
        direction='column'
        className={classes.paperPadding}>
        <Grid item container xs={12}>
          <Grid item spacing={2} direction='row' xs={12}>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Demand Information
            </Typography>
          </Grid>
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
                <Grid
                  container
                  item
                  direction='row'
                  lg={4}
                  md={6}
                  xs={12}
                  spacing={2}>
                  <Grid item lg={6} xs={6}>
                    <Paper
                      variant='elevation'
                      elevation={0}
                      className={classes.paperField}>
                      <Typography variant='body2' color='inherit'>
                        {name}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    lg={6}
                    xs={6}
                    classes={{ item: classes.alignCenter }}>
                    <Typography variant='body2' color='inherit'>
                      {value}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.dividerColor} />
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
            spacing={1}
            justify='flex-start'
            alignItems='center'>
            <Grid container direction='row' item lg={12} xs={12} spacing={2}>
              {skills.map((skill) => {
                const { name, value } = skill;
                return (
                  <Grid container item lg={6} xs={12} spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        variant='elevation'
                        elevation={0}
                        className={classes.paperField}>
                        <Typography variant='body2' color='inherit'>
                          {name}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                      <Typography variant='body2' color='inherit' align='left'>
                        {value}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
            {/* <Grid item xs={12} lg={3}>
              <Paper
                variant='elevation'
                elevation={0}
                className={classes.paperField}>
                <Typography variant='body2' color='inherit' align='center'>
                  Job Description
                </Typography>
              </Paper>
              <TextField
                margin='dense'
                size='small'
                fullWidth
                variant='outlined'
                multiline
                rows='4'
                value={job_description}
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

        <Grid item xs={12}>
          <Divider className={classes.dividerColor} />

          <Typography
            variant='h6'
            gutterBottom
            className={classes.font}
            color='primary'>
            Job Description
          </Typography>
          <Grid container spacing={2} direction='row'>
            <Grid
              container
              direction='row'
              spacing={2}
              item
              xs={12}
              justify='flex-start'
              alignItems='center'>
              {/* <Paper
                variant='elevation'
                elevation={0}
                className={classes.paperField}>
                <Typography variant='body2' color='inherit' align='center'>
                  Job Description
                </Typography>
              </Paper> */}
              <TextField
                margin='dense'
                size='small'
                fullWidth
                variant='outlined'
                multiline
                rows='3'
                value={job_description}
                InputProps={{
                  classes: {
                    root: classes.inputRootDesc,
                    disabled: classes.disabled,
                  },
                }}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Button
        className={classes.buttonMargin}
        variant='contained'
        onClick={changeValue}
        color='primary'>
        View Profile
      </Button>
    </div>
  );
};

export default SummaryTab;
