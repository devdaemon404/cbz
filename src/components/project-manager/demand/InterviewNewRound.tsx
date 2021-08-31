import React, { useContext, useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import timeSlotsJson from '../../../utils/statics/time-slots.json';
import timeZonesJson from '../../../utils/statics/time-zones.json';
import moment from 'moment';
import 'moment-timezone';
import {
  InterviewRoundType,
  interviewRoundTypeDefaultValue,
} from 'src/types/project-manager/demand';
import PMInterviewContext from 'src/contexts/project-manager/interview/pm-interview-context';
import { OPToast, ToastVariant } from '../../../utils/op-toast';
import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
import OPLoader from 'src/components/common/OPLoader';

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

const InterviewNewRound = ({
  // profileStatus,
  slotRejectionRaised,
  status,
  closeNewRoundModal,
}: {
  slotRejectionRaised: boolean;
  // profileStatus?: string;
  status?: string;
  closeNewRoundModal?: () => void;
}) => {
  const classes = useStyles();
  //Interview Context
  console.log({ status });
  const { bookSlots, isLoading, updateProfileStatus, rejectSlot } = useContext(
    PMInterviewContext,
  );
  const { getAllProfilesForDemand, isLoading: loading } = useContext(
    PMDemandContext,
  );
  //Data for select menu
  const timeSlotsArray = Object.entries(timeSlotsJson);
  const timeZonesArray = Object.entries(timeZonesJson);

  const [state, setState] = useState<InterviewRoundType>(
    interviewRoundTypeDefaultValue,
  );
  const [roundDescOtherValue, setRoundDescOtherValue] = useState('other');

  const [showOtherInput, setShowOtherInput] = useState(false);

  const onStateChange = (key, value) => {
    if (key === 'round_description' && value == 'other') {
      console.log('other.....');
      setState({ ...state, [key]: '' });
      setRoundDescOtherValue(value);
    }
    if (key === 'round_description' && value !== 'tech' && value !== 'hr') {
      console.log('other.....');
      setShowOtherInput(true);
      setRoundDescOtherValue(value);
    } else if (
      key === 'round_description' &&
      (value === 'tech' || value === 'hr')
    ) {
      setShowOtherInput(false);
    }

    setState({ ...state, [key]: value });
  };

  const onSlotsChange = (key, value, index) => {
    const _slots = [...state.slots];
    _slots.splice(index, 1, { ..._slots[index], [key]: value });
    setState({
      ...state,
      slots: [..._slots],
    });
  };

  const setTimeZones = (value: string) => {
    const [zone, zoneName] = value.split(' ');
    let _slots = [...state.slots];
    _slots = _slots.map((slot) => {
      return {
        ...slot,
        zone_name: zoneName,
        zone,
      };
    });
    setState({
      ...state,
      slots: [..._slots],
    });
  };

  const onNewRoundSubmit = async () => {
    const data = { ...state };
    console.log(data);

    // Validation
    if (data.notes.trim().length === 0) {
      OPToast.show('Please enter valid notes', {
        variant: ToastVariant.WARNING,
      });
      return;
    }
    if (data.interview_mode.trim().length === 0) {
      OPToast.show('Please select a valid interview mode', {
        variant: ToastVariant.WARNING,
      });
      return;
    }
    if (data.round_description.trim().length === 0) {
      OPToast.show('Please select a valid round description', {
        variant: ToastVariant.WARNING,
      });
      return;
    }
    data.slots = data.slots.map((slot) => ({
      ...slot,
      date: moment(slot.date).format('yyyy-MM-DD'),
    }));
    const res = await bookSlots({
      ...data,
    });
    if (slotRejectionRaised) {
      await rejectSlot();
    }
    if (res && closeNewRoundModal) {
      await closeNewRoundModal();
    }
    // console.log('PROFILE STATUS IN ROUND: ', profileStatus);
    // if (res && profileStatus === 'SHORT_LISTED') {
    // if (res) {
    //   const _statusRes = await updateProfileStatus('INTERVIEW_IN_PROCESS');
    //   if (_statusRes) await getAllProfilesForDemand('');
    // }
    // }
  };

  const onSlotTimeChange = (key, value, index) => {
    const _slots = [...state.slots];
    _slots.splice(index, 1, {
      ..._slots[index],
      time: { ..._slots[index].time, [key]: value },
    });
    setState({
      ...state,
      slots: [..._slots],
    });
  };

  // @ts-ignore
  return (
    <div>
      <OPLoader isLoading={isLoading || loading} />
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
              </Grid>
              <FormControl component='fieldset' className={classes.leftPadding}>
                {/* <FormLabel component='legend'>Interview Mode</FormLabel> */}
                <RadioGroup
                  row
                  aria-label=''
                  name=''
                  onChange={(e) =>
                    onStateChange(
                      'interview_mode',
                      (e.target as HTMLInputElement).value,
                    )
                  }
                  value={state.interview_mode}>
                  {interviewModes.map((mode) => (
                    <FormControlLabel
                      value={mode.value}
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
                    select
                    value={`${state.slots[0].zone} ${state.slots[0].zone_name}`}
                    size='small'
                    placeholder='Placeholder'
                    onChange={(e) => setTimeZones(e.target.value)}
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
                {state.slots.map((slot: any, index) => {
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
                          clearable
                          value={slot.date}
                          variant='inline'
                          inputVariant='outlined'
                          onChange={(date) =>
                            onSlotsChange('date', date, index)
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
                        justify='center'
                        alignItems='center'
                        spacing={1}>
                        <Grid item>
                          <Typography variant='body1' color='initial'>
                            From
                          </Typography>
                        </Grid>
                        <Grid item>
                          <TextField
                            id='from'
                            select
                            value={slot.time.from.toString()}
                            onChange={(e) =>
                              onSlotTimeChange('from', e.target.value, index)
                            }
                            name='from'
                            size='small'
                            placeholder='Time'
                            variant='outlined'>
                            {timeSlotsArray.map(([time, value]) => {
                              // console.log(time, value);
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
                        <Grid item>
                          <TextField
                            id='to'
                            select
                            name='to'
                            value={slot.time.to.toString()}
                            onChange={(e) =>
                              onSlotTimeChange('to', e.target.value, index)
                            }
                            size='small'
                            placeholder='Time'
                            variant='outlined'>
                            {timeSlotsArray.map(([time, value]) => {
                              if (parseInt(value) <= parseInt(slot.time.from)) {
                                return null;
                              }
                              return (
                                <MenuItem key={value} value={value}>
                                  {time}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </Grid>
                      </Grid>
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
              <FormControl
                component='fieldset'
                color='primary'
                className={classes.leftPadding}>
                {/* <FormLabel component='legend'>Interview Mode</FormLabel> */}
                <RadioGroup
                  row
                  aria-label='round name'
                  name='round-name'
                  value={state.round_description}
                  onChange={(e) =>
                    onStateChange('round_description', e.target.value)
                  }>
                  {roundDescriptions.map((mode) => (
                    <FormControlLabel
                      value={mode.value}
                      control={<Radio color='primary' />}
                      className={classes.radioLabel}
                      label={mode.label}
                    />
                  ))}
                  <FormControlLabel
                    value={roundDescOtherValue}
                    control={<Radio color='primary' />}
                    className={classes.radioLabel}
                    label='Other'
                  />

                  {showOtherInput && (
                    <TextField
                      id='outlined-basic'
                      variant='outlined'
                      placeholder='Write name...'
                      size='small'
                      onChange={(e) =>
                        onStateChange('round_description', e.target.value)
                      }
                    />
                  )}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item>
              <Typography
                className={classes.boldFont}
                variant='body1'
                color='initial'>
                Notes
              </Typography>
              <TextField
                id=''
                className={classes.leftPadding}
                label=''
                onChange={(e) => onStateChange('notes', e.target.value)}
                variant='outlined'
                value={state.notes}
                fullWidth
                multiline
                rows='5'
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item container direction='row-reverse' xs={12}>
        <Grid item>
          <Button
            style={{ marginTop: '16px' }}
            onClick={onNewRoundSubmit}
            variant='contained'
            color='primary'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default InterviewNewRound;
