import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Grid,
  Typography,
  DialogContent as MuiDialogContent,
  Theme,
  makeStyles,
  TextField,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { withStyles } from '@material-ui/styles';
import { ProfileDataType } from 'src/types/project-manager/demand';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import { ProfileDetailsDataType } from 'src/types/vendor-admin/demand';
import VAInterviewContext from 'src/contexts/vendor-admin/interview/va-interview-context';
import OPKeyValue from 'src/components/common/OPKeyValue';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    // marginTop: theme.spacing(2),
  },
  roundButton: {
    borderRadius: '40px',
    marginTop: theme.spacing(1),
  },
  buttonMargin: {
    margin: theme.spacing(2, 0),
  },
  compulsory: {
    color: theme.palette.error.main,
  },
  bottomMargin: {
    marginBottom: theme.spacing(1),
  },
}));

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const ViewProfileContent = ({
  // profileIndex,
  closeViewProfileModal,
}: {
  // profileIndex: number;
  closeViewProfileModal: () => void;
}) => {
  const classes = useStyles();

  const { currentProfile } = useContext(VAInterviewContext);

  const profile = currentProfile;

  const profileView = [
    {
      label: 'Candidate Name',
      value: `${profile!.firstname} ${profile?.lastname}`,
      type: 'text',
    },
    {
      label: 'Notice Period (Days)',
      value: profile!.notice_period,
      type: 'number',
    },
    { label: 'Email Id', value: profile!.email, type: 'text' },
    { label: 'Location', value: profile!.location, type: 'text' },
    {
      label: 'Interview Date',
      value: profile!.created,
      type: 'date',
    },
    {
      label: 'Rate Card/Hr',
      value: profile!.rateCard,
      type: 'number',
    },
    {
      label: 'Contact Number',
      value: profile!.mobile,
      type: 'number',
    },
    {
      label: 'Profile Status',
      value: profile!.profileStatus,
      type: 'select',
    },
    // {
    //   label: 'Current CTC',
    //   value: profile!.currentCTC,
    //   type: 'number',
    // },
    {
      label: 'Experience (Years)',
      value: profile!.experience,
      type: 'number',
    },
    {
      label: 'Exected CTC',
      value: profile!.expectedCTC,
      type: 'numebr',
    },
    {
      label: 'Attachments',
      value: profile!.profile_file_name,
      type: 'file',
    },
    {
      label: 'Holding offer (Package)',
      value: profile!.holding_offer_package,
      type: 'number',
    },
    {
      label: 'Approximate Date of Joining',
      value: new Date(),
      type: 'date',
    },
  ];

  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2021-08-18T21:11:54'),
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DialogContent dividers>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Grid container spacing={2} direction='row'>
              {profileView.map((data) => {
                if (data.type === 'text' || data.type === 'number')
                  return (
                    <Grid item xs={6}>
                      {/* <Typography>
                        {data.label}
                        <span className={classes.compulsory}>*</span>
                      </Typography>
                      <TextField
                        error={false}
                        required
                        margin='dense'
                        fullWidth
                        disabled
                        size='small'
                        name='name'
                        variant='outlined'
                        type={data.type}
                        // value=''
                        value={data.value}
                        // onChange={(e) => {
                        //   handleDemandInfoChange(e);
                        // }}
                      /> */}
                      <OPKeyValue
                        label={data.label}
                        value={data.value ? data.value : '-'}
                      />
                    </Grid>
                  );
                else if (data.type === 'date')
                  return (
                    <Grid item xs={6}>
                      {/* <Typography className={classes.bottomMargin}>
                        {data.label}
                        <span className={classes.compulsory}>*</span>
                      </Typography>
                      <KeyboardDatePicker
                        clearable
                        fullWidth
                        disabled
                        value={data.value}
                        variant='inline'
                        inputVariant='outlined'
                        onChange={(date) => handleDateChange(date)}
                        size='small'
                        // minDate={new Date()}
                        format='dd/MM/yyyy'
                      /> */}

                      <OPKeyValue
                        label={data.label}
                        value={
                          data.value
                            ? moment(data.value).format('DD MMM YYYY')
                            : '-'
                        }
                      />
                    </Grid>
                  );
                else if (data.type === 'select')
                  return (
                    <Grid item xs={6}>
                      <OPKeyValue
                        label={data.label}
                        value={data.value ? data.value : '-'}
                      />
                      {/* <Typography className={classes.bottomMargin}>
                        {data.label}
                        <span className={classes.compulsory}>*</span>
                      </Typography>
                      <FormControl variant='outlined' fullWidth size='small'>
                        <Select
                          disabled
                          // value={profile.profile_status}
                          value={data.value}
                          // onChange={(e) => handleStatusChange(e, profile)}
                        >
                          <MenuItem value='INTERVIEW_IN_PROCESS'>
                            Interview in Process
                          </MenuItem>
                          <MenuItem value='SHORT_LISTED'>Short Listed</MenuItem>
                          <MenuItem value='INTERVIEW_FAILURE_DROPPED'>
                            Failed
                          </MenuItem>
                          <MenuItem value='INTERVIEW_SUCCESS'>
                            Successful
                          </MenuItem>
                          <MenuItem value='INTERESTED'>Interested</MenuItem>
                          <MenuItem value='READY_TO_SHARE'>
                            Ready To Share
                          </MenuItem>
                          <MenuItem value='FILTERED'>Filtered</MenuItem>
                        </Select>
                      </FormControl> */}
                    </Grid>
                  );
              })}
            </Grid>
          </Paper>
        </DialogContent>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default ViewProfileContent;
