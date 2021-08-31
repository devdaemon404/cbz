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
import React, { useContext } from 'react';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import { DemandDataType } from '../../../types/project-manager/demand';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import RDemandContext from 'src/contexts/recruiter/demand/r-demand-context';

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
  buttonMargin: {
    marginTop: theme.spacing(3),
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
  paperField: {
    backgroundColor: '#E1EBF2',
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  // label: {
  //   fontWeight: 'bold',
  //   fontSize: 13,
  //   color: '#0d3c61',
  // },
}));

const SummaryTab = ({ changeValue }: { changeValue: () => void }) => {
  const classes = useStyles();
  const [workTime, setWorkTime] = React.useState('EUR');

  const { isLoading, demandData } = useContext(RDemandContext);
  console.log('Demand: ', demandData);
  const {
    name,
    profile_name,
    quantity,
    startDate,
    duration,
    hours_per_week,
    po_number,
    vendor_ids,
    user_first_name,
    user_last_name,
    expense,
    job_description,
    status,
    request_id,
    additional_info,
  } = demandData;

  const {
    primary_skills,
    secondary_skills,
    relevant_experience,
    additional_skills,
    total_experience,
  } = demandData.skills;

  // const { email_enabled, employment_type } = demandData.additional_info;

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
    // type: string;
    value: string | boolean | number;
  };

  // type WorkType = {
  //   value: string;
  //   label: string;
  // };

  // const workType: WorkType[] = [
  //   { value: 'full-time', label: 'Full Time' },
  //   { value: 'part-time', label: 'Part Time' },
  //   { value: 'on-call', label: 'On Call' },
  // ];

  const demandInformation: DemandInformationType[] = [
    { name: 'Full Name', value: name },
    // { name: 'Required Profile Name', value: profile_name ? profile_name : '' },
    { name: 'QTY', value: quantity ? quantity : 0 },
    { name: 'Desired Start Date', value: startDate ? startDate : '' },
    { name: 'Duration', value: duration ? duration : 0 },
    { name: 'Hrs/Wk', value: hours_per_week ? hours_per_week : 0 },
    // { name: 'PO Number', value: po_number ? po_number : 0 },
    // {
    //   name: 'Client Manager Name',
    //   value: `${user_first_name} ${user_last_name}`,
    // },
    // { name: 'Estimated Expense', value: expense ? expense : 0 },
  ];

  const skills: SkillInformationType[] = [
    { name: 'Primary Skills', value: primary_skills.join(', ') },
    { name: 'Secondary Skills', value: secondary_skills.join(', ') },
    { name: 'Relevant Experience', value: relevant_experience || 'N/A' },
    { name: 'Total Experience', value: total_experience || 'N/A' },
    // { name: 'Additional Skills', value: additional_skills.join(', ') },
  ];

  const additionalInfo: AdditionalInformationType[] = [
    { name: 'Request ID', value: request_id ? request_id : '' },
    // { name: 'Request Type', value: '' },
    // { name: 'Geography', value: '' },
    // { name: 'Procurement Type', value: '' },
    {
      name: 'Email Enabled',
      value: additional_info?.email_enabled ? 'Yes' : 'No',
    },
    // { name: 'Travel Expences WBS', value: '' },
    // {
    //   name: 'Full Time / Part Time / On call',
    //   value: employment_type ? employment_type : '',
    // },
    {
      name: 'Shift',
      value: additional_info?.shift ? additional_info.shift : '-',
    },
    { name: 'Status', value: status ? status : '-' },
    // { name: 'Sub-Status', value: '' },
    // { name: 'Labor Category', value: '' },
    // { name: 'Has Assignments', value: '' },
    // { name: 'Access to Confidential Info', value: '' },
    // { name: 'Additional Supplier Information', value: '' },
    // { name: 'Justification', value: '' },
    {
      name: 'Background Check',
      value: additional_info?.background_check_required ? 'Yes' : 'No',
    },
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
          <Grid item spacing={1} direction='row' xs={12}>
            {/* <Divider className={classes.dividerColor} /> */}
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
                <Grid container item direction='row' xs={4} spacing={2}>
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
            justify='flex-start'
            alignItems='center'>
            <Grid container direction='row' item xs={8} spacing={2}>
              {skills.map((skill) => {
                const { name, value } = skill;
                return (
                  <Grid container item xs={6} spacing={2}>
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
            {/* <Grid item xs={3}>
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
            {/* <Grid item xs={12}>
                <Typography variant='body1' color='initial'>
                  Attachments
                </Typography>
                <Button
                  variant='outlined'
                  color='default'
                  startIcon={<CloudUploadIcon />}
                  size='small'
                  // onClick={handleFileUploadDialogOpen}
                  className={classes.margin}>
                  File Upload
                </Button>
              </Grid> */}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider className={classes.dividerColor} />
          <Typography
            variant='h6'
            gutterBottom
            color='primary'
            className={classes.font}>
            Job Description
          </Typography>
          <TextField
            margin='dense'
            size='small'
            fullWidth
            variant='outlined'
            multiline
            rows='6'
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
        <Grid item xs={12}>
          <Divider className={classes.dividerColor} />
          <Typography
            variant='h6'
            gutterBottom
            className={classes.font}
            color='primary'>
            Additional Information
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
              {additionalInfo.map((info) => {
                const { name, value } = info;
                return (
                  <Grid container item spacing={2} xs={4}>
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
                        {value || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
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
