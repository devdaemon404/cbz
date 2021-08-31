import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  CheckCircleOutline as CheckCircleOutLineIcon,
  AccessTime as AccessTimeIcon,
  PowerSettingsNewRounded,
} from '@material-ui/icons';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import timeSlotsJson from '../../../utils/statics/time-slots.json';
import timeZonesJson from '../../../utils/statics/time-zones.json';
import moment from 'moment';
import 'moment-timezone';
import {
  InterviewRoundType,
  interviewRoundTypeDefaultValue,
  InterviewSlotInformationType,
} from 'src/types/project-manager/demand';
import PMInterviewContext from 'src/contexts/project-manager/interview/pm-interview-context';
import OPKeyValue from 'src/components/common/OPKeyValue';
import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
import { useRouter } from 'next/router';
import { Alert } from '@material-ui/lab';
import OPAreYouSure from 'src/components/common/OPAreYouSure';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  roundButton: {
    borderRadius: '40px',
    marginTop: theme.spacing(1),
  },
  radioLabel: {
    color: '#111',
  },
  leftPadding: {
    paddingLeft: theme.spacing(1),
  },
  iconButton: {
    padding: 0,
    color: theme.palette.success.main,
  },
  buttonMargin: {
    margin: theme.spacing(2, 0),
  },
  boldFont: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

interface InterviewMode {
  label: string;
  value: string;
}

interface RoundDescription {
  label: string;
  value: string;
}

const interviewModes: InterviewMode[] = [
  { label: 'Telephonic', value: 'TELEPHONIC' },
  { label: 'Video Conference', value: 'VIDEO' },
  { label: 'Face to Face', value: 'FACE_TO_FACE' },
];

const roundDescriptions: RoundDescription[] = [
  { label: 'Tech', value: 'tech' },
  { label: 'HR', value: 'hr' },
];

const InterviewRound = ({
  interviewRound,
  isLastRound,
  openNewRoundModal,
  closeInterviewModal,
}: {
  interviewRound: InterviewSlotInformationType;
  isLastRound: boolean;
  openNewRoundModal: (statusForModal: string) => void;
  closeInterviewModal: () => void;
}) => {
  const classes = useStyles();
  //Interview Context
  const {
    requestNextRound,
    rescheduleCurrentRound,
    setInterviewSuccess,
    fetchInterview,
    sendNotification,
    areYouSureOpen,
    setAreYouSureOpen,
    rejectReason,
    setRejectReason,
  } = useContext(PMInterviewContext);

  const { getAllProfilesForDemand } = useContext(PMDemandContext);

  const router = useRouter();
  // @ts-ignore
  const demandId: string = router.query.demandId;
  //Data for select menu of Time and TimeZone
  const timeSlotsArray = Object.entries(timeSlotsJson);
  const timeZonesArray = Object.entries(timeZonesJson);

  const handleRoundStatusChange = async (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>,
  ) => {
    const { value } = event.target;
    let statusForModal: string = '';
    // If next round requested. (First freeze the current round and schedule it.)
    if (String(value) === 'NEXT_ROUND_REQUIRED') {
      statusForModal = 'NEXT_ROUND_REQUIRED';
      const res = await requestNextRound();
      if (res) await sendNotification('INTERVIEW_NEXT_ROUND_REQUIRED');
      if (res) openNewRoundModal(statusForModal);
      // For rescheduling the round. (First freeze the current round and schedule it.)
    } else if (String(value) === 'RE_SCHEDULED') {
      statusForModal = 'RE_SCHEDULED';
      const res = await rescheduleCurrentRound();
      if (res) await sendNotification('INTERVIEW_RE_SCHEDULED');
      if (res) openNewRoundModal(statusForModal);
      // When the candidate clears the interview successfully.
    } else if (String(value) === 'SUCCESSFUL') {
      const res = await setInterviewSuccess(true);
      if (res) await sendNotification('INTERVIEW_SUCCESS');
      if (res) closeInterviewModal();
      // When the candiate is not able to clear the interview
    } else if (String(value) === 'FAILURE') {
      setAreYouSureOpen(true);
    }
    await fetchInterview();
    if (demandId) {
      await getAllProfilesForDemand(demandId);
    }
  };

  // @ts-ignore
  return (
    <div>
      <Grid item>
        <Paper variant='outlined' className={classes.paperPadding}>
          <Grid container direction='column' spacing={3}>
            <Grid item>
              <Grid item container direction='row' justify='space-between'>
                <Grid item>
                  <Typography
                    variant='body1'
                    className={classes.boldFont}
                    color='initial'>
                    Interview Mode
                  </Typography>
                </Grid>
                <Grid>
                  {interviewRound.status &&
                    interviewRound.status !== 'SUCCESSFUL' &&
                    interviewRound.status !== 'FAILURE' && (
                      <FormControl variant='outlined' size='small'>
                        <Select
                          name='round-status'
                          disabled={!isLastRound}
                          value={interviewRound.status}
                          onChange={(e) => handleRoundStatusChange(e)}>
                          <MenuItem value='NEXT_ROUND_REQUIRED'>
                            Next Round Required
                          </MenuItem>
                          <MenuItem value='SUCCESSFUL'>Successful</MenuItem>
                          <MenuItem value='SCHEDULED'>Scheduled</MenuItem>
                          <MenuItem value='FAILURE'>Failure</MenuItem>
                          <MenuItem value='RE_SCHEDULED'>Rescheduled</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  {interviewRound.status &&
                  interviewRound.status === 'SUCCESSFUL' ? (
                    <Alert icon={false} severity='success'>
                      Interview Success
                    </Alert>
                  ) : null}
                  {interviewRound.status &&
                  interviewRound.status === 'FAILURE' ? (
                    <Alert icon={false} severity='error'>
                      Interview Failure
                    </Alert>
                  ) : null}
                </Grid>
              </Grid>
              <FormControl component='fieldset' className={classes.leftPadding}>
                {/* <FormLabel component='legend'>Interview Mode</FormLabel> */}
                <RadioGroup
                  row
                  aria-label=''
                  name=''
                  value={interviewRound.interview_mode}>
                  {interviewModes.map((mode) => (
                    <FormControlLabel
                      value={mode.value}
                      disabled
                      control={<Radio color='primary' />}
                      className={classes.radioLabel}
                      label={mode.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid container item direction='column' spacing={2}>
              <Grid item>
                <Typography
                  className={classes.boldFont}
                  variant='body1'
                  color='initial'>
                  Interview Time Slot
                </Typography>
              </Grid>
              <Grid
                container
                item
                className={classes.leftPadding}
                direction='row'
                spacing={2}
                alignItems='center'>
                <Grid item xs={2}>
                  <Typography
                    className={classes.boldFont}
                    variant='body1'
                    color='initial'>
                    Time Zone
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    id='outlined-select-currency'
                    disabled
                    select
                    value={`${interviewRound?.times[0]?.raw?.zone} ${interviewRound?.times[0]?.raw?.zone_name}`}
                    size='small'
                    placeholder='Placeholder'
                    variant='outlined'>
                    {timeZonesArray.map(([zone, zoneNameArray]) => {
                      return zoneNameArray.map((zoneName, index) => {
                        return (
                          <MenuItem key={index} value={`${zone} ${zoneName}`}>
                            {zone} {zoneName}
                          </MenuItem>
                        );
                      });
                    })}
                  </TextField>
                </Grid>
                {interviewRound?.times?.map((slot: any, index) => {
                  return (
                    <Grid
                      container
                      item
                      direction='row'
                      spacing={2}
                      alignItems='center'>
                      <Grid item xs={2}>
                        <Typography
                          className={classes.boldFont}
                          variant='body1'
                          color='initial'>
                          Slot {index + 1}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <KeyboardDatePicker
                          disabled
                          value={slot.raw.date}
                          variant='inline'
                          inputVariant='outlined'
                          onChange={(date) => console.log('date', date, index)}
                          size='small'
                          // minDate={new Date()}
                          format='dd/MM/yyyy'
                        />
                      </Grid>

                      <Grid
                        item
                        container
                        direction='row'
                        xs={3}
                        justify='flex-end'
                        alignItems='center'
                        spacing={1}>
                        <Grid item>
                          <Typography variant='body1' color='initial'>
                            From
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            select
                            fullWidth
                            disabled
                            value={slot.raw.time.from?.toString()}
                            name='from'
                            size='small'
                            placeholder='Time'
                            variant='outlined'>
                            {timeSlotsArray.map(([time, value]) => {
                              return (
                                <MenuItem key={value} value={value}>
                                  {time}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        xs={3}
                        alignItems='center'
                        spacing={1}>
                        <Grid item>
                          <Typography variant='body1' color='initial'>
                            To
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            select
                            disabled
                            fullWidth
                            name='to'
                            value={slot.raw.time.to.toString()}
                            size='small'
                            placeholder='Time'
                            variant='outlined'>
                            {timeSlotsArray.map(([time, value]) => {
                              return (
                                <MenuItem key={value} value={value}>
                                  {time}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </Grid>
                      </Grid>
                      {interviewRound.selectedSlotId === slot.id && (
                        <Grid item>
                          <IconButton
                            className={classes.iconButton}
                            aria-label='directions'>
                            <CheckCircleOutLineIcon />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                className={classes.boldFont}
                variant='body1'
                color='initial'>
                Round Name
              </Typography>
              {interviewRound.round_description !== 'hr' &&
              interviewRound.round_description !== 'tech' ? (
                <div
                  style={{
                    width: '50%',
                    paddingTop: '1rem',
                    paddingLeft: '0.5rem',
                  }}>
                  <OPKeyValue
                    label='Other'
                    value={interviewRound.round_description}
                  />
                </div>
              ) : (
                // <Typography
                //   variant='body1'
                //   color='primary'
                //   style={{
                //     marginLeft: '1rem',
                //     marginTop: '0.5rem',
                //     padding: '0.5rem',
                //   }}>
                //   {interviewRound.round_description}
                // </Typography>
                <FormControl
                  component='fieldset'
                  color='primary'
                  className={classes.leftPadding}>
                  <RadioGroup row aria-label='' name=''>
                    {roundDescriptions.map((mode) => (
                      <FormControlLabel
                        value={mode.value}
                        disabled
                        control={<Radio color='primary' />}
                        className={classes.radioLabel}
                        label={mode.label}
                        checked={
                          mode.value === interviewRound.round_description
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </Grid>
            <Grid item>
              <Typography
                className={classes.boldFont}
                variant='body1'
                color='initial'>
                Notes
              </Typography>
              <TextField
                disabled
                className={classes.leftPadding}
                variant='outlined'
                value={interviewRound.notes}
                fullWidth
                multiline
                rows='5'
              />
            </Grid>
          </Grid>
        </Paper>

        <OPAreYouSure
          title='Provide reason for rejection'
          isOpen={areYouSureOpen}
          closeAreYouSure={() => setAreYouSureOpen(false)}
          functionToCall={async () => {
            const res = await setInterviewSuccess(false);
            if (res) closeInterviewModal();
          }}>
          <TextField
            id='reject-reason'
            variant='outlined'
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </OPAreYouSure>
      </Grid>
    </div>
  );
};

export default InterviewRound;
