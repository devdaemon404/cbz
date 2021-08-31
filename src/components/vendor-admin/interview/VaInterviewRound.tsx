import React, { useContext, useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CheckCircleOutline as CheckCircleOutLineIcon } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import timeSlotsJson from '../../../utils/statics/time-slots.json';
import timeZonesJson from '../../../utils/statics/time-zones.json';
import 'moment-timezone';
import { InterviewSlotType } from 'src/types/project-manager/demand';
import { RoundDataType } from 'src/types/vendor-admin/demand';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import { OPToast, ToastVariant } from '../../../utils/op-toast';
import VAInterviewContext from 'src/contexts/vendor-admin/interview/va-interview-context';
import OPKeyValue from 'src/components/common/OPKeyValue';
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

const slots: InterviewSlotType[] = [
  {
    id: '69b062ac-78e5-43f6-bff1-908c0f2e88dd',
    time: {
      from: 450,
      to: 510,
    },
    date: '2020-11-08',
    zone: 'GMT+5:30',
    zone_name: 'Asia/Kolkata',
  },
  {
    id: '32a20f5c-9293-48fd-87a4-9bc7a2c4325c',
    time: {
      from: 450,
      to: 510,
    },
    date: '2020-11-08',
    zone: 'GMT+5:30',
    zone_name: 'Asia/Kolkata',
  },
  {
    id: '26694fc5-5567-47a4-85f7-481e0337cc69',
    time: {
      from: 450,
      to: 510,
    },
    date: '2020-11-08',
    zone: 'GMT+5:30',
    zone_name: 'Asia/Kolkata',
  },
];

const InterviewRound = ({
  // profileIndex,
  role,
  interviewRound,
  isLastRound,
  closeInterviewModal,
}: {
  // profileIndex: number;
  role: string;
  interviewRound: RoundDataType;
  isLastRound: boolean;
  openNewRoundModal?: (statusForModal: string) => void;
  closeInterviewModal?: () => void;
}) => {
  const classes = useStyles();

  const [selectedSlotValue, setSelectedSlotValue] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [areYouSureOpen, setAreYouSureOpen] = useState<boolean>(false);

  const {
    currentProfile,
    freezeSlot,
    sendNotification,
    rejectSlot,
  } = useContext(VAInterviewContext);
  // const profile = profiles[profileIndex];
  const profile = currentProfile;
  const handleSlotValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedSlotValue((event.target as HTMLInputElement).value);
  };

  const handleReject = async () => {
    console.log(rejectReason);
    console.log({ profile });
    if (profile) {
      await rejectSlot(profile.id);

      await sendNotification('INTERVIEW_SLOTS_REJECTED', {
        id: profile.id,
        rejectReason,
      });
    }
    if (closeInterviewModal) closeInterviewModal();
  };
  // Data for select menu of Time and TimeZone
  const timeSlotsArray = Object.entries(timeSlotsJson);
  const timeZonesArray = Object.entries(timeZonesJson);

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
                    className={classes.boldFont}
                    variant='body1'
                    color='initial'>
                    Interview Mode
                  </Typography>
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
                      // disabled
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
                    // disabled
                    select
                    // @ts-ignore
                    value={`${interviewRound.times[0].raw?.zone} ${interviewRound?.times[0]?.raw?.zone_name}`}
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
                <Grid item container spacing={1} direction='column'>
                  {isLastRound &&
                  profile &&
                  (profile.interviewRoundsArr.length <
                    profile.interviewSlotsArr.length ||
                    profile.interviewRoundsArr[
                      profile.interviewSlotsArr.length - 1
                    ].status === 'RE_SCHEDULED') ? (
                    <RadioGroup
                      aria-label='selected slot'
                      name='selected-slot'
                      value={selectedSlotValue}
                      onChange={handleSlotValueChange}>
                      {interviewRound.times.map((slot: any, index) => {
                        return (
                          <Grid
                            container
                            item
                            direction='row'
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
                                // disabled
                                value={slot.raw.date}
                                // value={slot.date}
                                variant='inline'
                                inputVariant='outlined'
                                onChange={(date) =>
                                  console.log('date', date, index)
                                }
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
                              spacing={1}
                              alignItems='center'>
                              <Grid item>
                                <Typography variant='body1' color='initial'>
                                  From
                                </Typography>
                              </Grid>
                              <Grid item xs={8}>
                                <TextField
                                  select
                                  // disabled
                                  fullWidth
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
                              justify='center'
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
                                  fullWidth
                                  // disabled
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
                            <FormControlLabel
                              value={slot.id}
                              control={<Radio />}
                              label=''
                            />
                          </Grid>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <>
                      {interviewRound.times.map((slot: any, index) => {
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
                                // disabled
                                value={slot.raw.date}
                                // value={slot.date}
                                variant='inline'
                                inputVariant='outlined'
                                onChange={(date) =>
                                  console.log('date', date, index)
                                }
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
                              spacing={1}
                              justify='flex-end'
                              alignItems='center'>
                              <Grid item>
                                <Typography variant='body1' color='initial'>
                                  From
                                </Typography>
                              </Grid>
                              <Grid item xs={8}>
                                <TextField
                                  select
                                  fullWidth
                                  // disabled
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
                              justify='center'
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
                                  // disabled
                                  name='to'
                                  fullWidth
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
                    </>
                  )}
                </Grid>
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
                  }}>
                  <OPKeyValue
                    label='Other'
                    value={interviewRound.round_description}
                  />
                </div>
              ) : (
                <FormControl
                  component='fieldset'
                  color='primary'
                  className={classes.leftPadding}>
                  <RadioGroup row aria-label='' name=''>
                    {roundDescriptions.map((mode) => (
                      <FormControlLabel
                        value={mode.value}
                        // disabled
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
                // disabled
                className={classes.leftPadding}
                variant='outlined'
                value={interviewRound.notes}
                fullWidth
                multiline
                rows='5'
              />
            </Grid>
            <Grid item>
              {isLastRound &&
              role === 'VENDOR_ADMIN' &&
              profile &&
              (profile.interviewRoundsArr.length <
                profile.interviewSlotsArr.length ||
                profile.interviewRoundsArr[profile.interviewSlotsArr.length - 1]
                  .status === 'RE_SCHEDULED') ? (
                <>
                  {!profile.slotRejectionRaised ? (
                    <>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={async () => {
                          if (selectedSlotValue.trim().length === 0) {
                            OPToast.show('Please select a slot to be frozen', {
                              variant: ToastVariant.WARNING,
                            });
                            return;
                          }

                          const res = await freezeSlot({
                            profileId: profile.id,
                            roundNumber: interviewRound.round,
                            slotId: selectedSlotValue,
                            roundDescription: interviewRound.round_description,
                          });

                          const selectedSlot = profile.interviewSlotsArr[
                            profile.interviewSlotsArr.length - 1
                          ].times.filter((t) => t.id === selectedSlotValue)[0];

                          await sendNotification('INTERVIEW_RE_SCHEDULED', {
                            profileId: profile.id,
                            selectedSlot,
                          });

                          await sendNotification('INTERVIEW_SCHEDULED', {
                            profileId: profile.id,
                            selectedSlot,
                          });
                          if (res && closeInterviewModal) {
                            closeInterviewModal();
                            // setFreezeSlotRequired(false);
                          } else console.log(res);
                        }}>
                        Freeze Slot
                      </Button>
                      <Button
                        variant='outlined'
                        color='primary'
                        style={{ marginLeft: '1rem' }}
                        onClick={async () => {
                          await setAreYouSureOpen(true);
                        }}>
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Alert icon={false} severity='warning'>
                      Rejected
                    </Alert>
                  )}
                </>
              ) : null}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <OPAreYouSure
        title='Reject Reason'
        isOpen={areYouSureOpen}
        closeAreYouSure={() => {
          setRejectReason('');
          setAreYouSureOpen(false);
        }}
        functionToCall={() => handleReject()}>
        <TextField
          id='reject-reason'
          variant='outlined'
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </OPAreYouSure>
    </div>
  );
};

export default InterviewRound;
