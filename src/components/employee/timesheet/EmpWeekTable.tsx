import React, { Fragment, useContext, useEffect, useState } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

import {
  Box,
  Grid,
  Theme,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Popover,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  TextField,
  TextareaAutosize,
} from '@material-ui/core';
import OPKeyValue from 'src/components/common/OPKeyValue';
import classnames from 'classnames';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';
import InfoIcon from '@material-ui/icons/Info';
import DownloadIcon from '@material-ui/icons/ArrowDownward';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import moment from 'moment';
import {
  DefaultTaskType,
  TaskType,
  TimeSheetDataType,
  TimesheetTaskType,
} from 'src/types/project-manager/timesheet';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import OPAreYouSure from 'src/components/common/OPAreYouSure';
import EMPTimesheetContext from 'src/contexts/employee/timesheet/emp-ts-context';
import OPLoader from 'src/components/common/OPLoader';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import { GridComponent } from '@material-ui/data-grid';
import ClearIcon from '@material-ui/icons/Clear';
import { Clear } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.secondary.light,
  },
  table: {
    width: '100%',
  },
  rowBackground: {
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(1),
  },
  fieldWidth: {
    width: theme.spacing(6),
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  paperPadding: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paperBackground: {
    backgroundColor: theme.palette.secondary.light,
  },
  boldFont: {
    fontWeight: 'bold',
  },
  fixHeight: {
    maxHeight: '40vh',
    overflowY: 'auto',
  },
  input: {
    '&:invalid': {
      backgroundColor: '#ffb199',
      color: theme.palette.common.white,
    },
  },
}));

const EmpWeekTable = () => {
  const classes = useStyles();
  const {
    // selectedProject,
    isLoading,
    selectedWeekData,
    timesheetList,
    allTasks,
    timesheetId,
    handleAdjust,
    handleSubmit,
    handleSaveOrApprove,
    downloadTimesheet,
  } = useContext(EMPTimesheetContext);

  const currentDate = new Date();
  // const currentWeekNumber = moment(currentDate).week;
  const currentWeekData = getWeekData(currentDate, 7);

  // State for Are you sure popup
  const [areYouSureOpen, setAreYouSureOpen] = useState<boolean>(false);
  // weekDisplay ex: 10 Mon, weekDates ex: 2021-01-10
  const { weekDisplay, weekDates, weekNumber } = selectedWeekData;
  // State for Current task from allTasks
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  // State for if hrs value is wrong (toggle state)
  const [hrsError, setHrsError] = useState<Boolean>(false);
  // State for the current timesheet version out of timesheetList
  const [currentTimesheetVersion, setCurrentTimesheetVersion] = useState<
    TimeSheetDataType | undefined
    // @ts-ignore
  >({});
  const [defaultTasks, setDefaultTasks] = useState<DefaultTaskType[]>([]);
  const [edit, setEdit] = useState<Boolean>(true);
  const [currentTaskName, setCurrentTaskName] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [taskName, setTaskName] = useState('');
  const dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    // console.log('All task length', allTasks.length);
    // console.log("Timesheet's length", timesheetList);
    setDefaultTasks([]);
    // @ts-ignore
    setCurrentTimesheetVersion({});

    if (timesheetList.length > 0) {
      const initialTimesheet = timesheetList[timesheetList.length - 1];
      setCurrentTimesheetVersion({ ...initialTimesheet });
    } else {
      makeDefaultTask();
    }
  }, [timesheetList, allTasks]);

  const getVersionTotalHours = () => {
    let sum = 0;
    if (currentTimesheetVersion && currentTimesheetVersion!.tasks) {
      currentTimesheetVersion?.tasks.map((task) => {
        dayArray.map((day) => {
          sum += task.weekData[day].hrs;
        });
      });
    }
    return sum;
  };

  const getTotalHours = () => {
    let sum = 0;
    defaultTasks.map((task) => {
      dayArray.map((day) => {
        sum += task.weekData[day].hrs;
      });
    });

    return sum;
  };

  const handlePopoverOpen = (event, task: TimesheetTaskType) => {
    const cTask = allTasks.find((_task) => _task._id === task.taskId);
    if (cTask) {
      setCurrentTask(cTask);
    }
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitTimesheetChange = (event, type, index) => {
    const name = event.target.name;
    let value = event.target.value;
    if (value === '') {
      value = 0;
    }
    const errorHrs = validateHrsValue(value);
    if (errorHrs) return;
    value = parseInt(value);

    const [id, _day] = name.split('_');
    const tempTask = defaultTasks[index];
    if (tempTask) {
      const _week = tempTask.weekData;
      const tempData = {
        ...tempTask,
        weekData: {
          ..._week,
          [_day]: {
            ..._week[_day],
            [type]: value,
          },
        },
      };
      const tempAllTasks = defaultTasks;
      tempAllTasks[index] = tempData;
      setDefaultTasks([...tempAllTasks]);
    }
  };

  const handleTaskNameChange = (event) => {
    const value = event.target.value;
    const tempTask = defaultTasks[0];
    if (tempTask) {
      const tempData = {
        ...tempTask,
        taskName: value,
      };
      const tempAllTasks = defaultTasks;
      tempAllTasks[0] = tempData;
      setDefaultTasks([...tempAllTasks]);
    }
  };

  const handleCancel = async () => {
    const tempTask = defaultTasks[0];
    if (tempTask) {
      const tempData = {
        ...tempTask,
        taskName: currentTaskName,
      };
      const tempAllTasks = defaultTasks;
      tempAllTasks[0] = tempData;
      setDefaultTasks([...tempAllTasks]);
    }
  };

  const handleAdjustTimesheetChange = (event, type, index) => {
    const name = event.target.name;
    let value = event.target.value;
    if (value === '') {
      value = 0;
    }
    const errorHrs = validateHrsValue(value);
    if (errorHrs) return;
    value = parseInt(value);

    const [id, _day] = name.split('_');
    const tempTask = currentTimesheetVersion?.tasks[index];
    if (tempTask) {
      const _week = tempTask.weekData;
      const tempData = {
        ...tempTask,
        weekData: {
          ..._week,
          [_day]: {
            ..._week[_day],
            [type]: value,
          },
        },
      };
      let tempTaskData;
      if (currentTimesheetVersion)
        tempTaskData = currentTimesheetVersion!.tasks;

      tempTaskData[index] = tempData;
      // @ts-ignore
      setCurrentTimesheetVersion({
        ...currentTimesheetVersion,
        tasks: tempTaskData,
      });
    }
  };

  const handleAdjustTaskChange = (event) => {
    let value = event.target.value;
    const tempTask = currentTimesheetVersion?.tasks[0];
    if (tempTask) {
      const _week = tempTask.weekData;
      const tempData = {
        ...tempTask,
        taskName: value,
      };
      let tempTaskData;
      if (currentTimesheetVersion)
        tempTaskData = currentTimesheetVersion!.tasks;

      tempTaskData[0] = tempData;
      // @ts-ignore
      setCurrentTimesheetVersion({
        ...currentTimesheetVersion,
        tasks: tempTaskData,
      });
    }
  };

  const handleAdjustTasknameCancel = async () => {
    const tempTask = currentTimesheetVersion?.tasks[0];
    if (tempTask) {
      const _week = tempTask.weekData;
      const tempData = {
        ...tempTask,
        taskName: currentTaskName,
      };
      let tempTaskData;
      if (currentTimesheetVersion)
        tempTaskData = currentTimesheetVersion!.tasks;

      tempTaskData[0] = tempData;
      // @ts-ignore
      setCurrentTimesheetVersion({
        ...currentTimesheetVersion,
        tasks: tempTaskData,
      });
    }
  };

  const validateHrsValue = (hrs) => {
    const pattern = /^\d+$/;
    //string if this a digit or not
    if (pattern.test(hrs)) {
      if (hrs > 24) {
        setHrsError(true);
      } else {
        setHrsError(false);
      }
    } else {
      OPToast.show('Value must be a Number', { variant: ToastVariant.ERROR });
      return true;
    }
  };

  const makeDefaultTask = () => {
    console.log('inside deafult making');
    const defaultWeekDates = {
      Sun: {
        hrs: 0,
        date: weekDates[0],
      },
      Mon: {
        hrs: 0,
        date: weekDates[1],
      },
      Tue: {
        hrs: 0,
        date: weekDates[2],
      },
      Wed: {
        hrs: 0,
        date: weekDates[3],
      },
      Thu: {
        hrs: 0,
        date: weekDates[4],
      },
      Fri: {
        hrs: 0,
        date: weekDates[5],
      },
      Sat: {
        hrs: 0,
        date: weekDates[6],
      },
    };
    const tempDefaultTask: DefaultTaskType[] = [];
    // allTasks.map((task) => {
    const dTask = {
      taskName: '',
      weekData: defaultWeekDates,
    };
    tempDefaultTask.push(dTask);
    // });
    setDefaultTasks([...tempDefaultTask]);
  };

  const renderButtonAndAmendReason = (status) => {
    if (status === 'REJECTED' && weekNumber === currentWeekData.weekNumber)
      return (
        <Grid item>
          <Grid item container direction='row-reverse'>
            <Button
              variant='contained'
              disabled={hrsError ? true : false}
              onClick={() => handleSaveOrApprove('REJECTED', 'adj')}
              style={{ marginLeft: '8px' }}
              color='primary'>
              Amend
            </Button>
          </Grid>
        </Grid>
      );
    if (status === 'APPROVED' && weekNumber === currentWeekData.weekNumber)
      return (
        <Fragment>
          {/* <Grid item container direction='row-reverse'>
            <Button
              variant='contained'
              disabled={hrsError ? true : false}
              onClick={() => setAreYouSureOpen(true)}
              style={{ marginLeft: '8px' }}
              color='primary'>
              Adjust
            </Button>
          </Grid> */}
        </Fragment>
      );
    if (status === 'SUBMITTED' && weekNumber === currentWeekData.weekNumber) {
      return (
        <Fragment>
          <Grid item container direction='row-reverse'>
            <Button
              variant='contained'
              disabled={hrsError ? true : false}
              onClick={() => {
                if (currentTimesheetVersion) {
                  setCurrentTaskName(
                    //@ts-ignore
                    currentTimesheetVersion.tasks[0].taskName,
                  );
                  setEdit(true);
                  handleAdjust(currentTimesheetVersion!.tasks);
                }
              }}
              style={{ marginLeft: '8px' }}
              color='primary'>
              Submit
            </Button>
          </Grid>
          <Box m={1}></Box>
        </Fragment>
      );
    }
  };

  const renderTaskFieldOrText = (status, taskName) => {
    if (weekNumber === currentWeekData.weekNumber) {
      switch (status) {
        case 'REJECTED':
          return (
            <Grid
              container
              direction='row'
              justify='space-around'
              alignItems='flex-start'
              spacing={2}>
              <Grid item style={{ maxWidth: '150px' }}>
                <Typography>{taskName}</Typography>
              </Grid>
            </Grid>
          );
        case 'SUBMITTED':
          return (
            <>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  color='primary'
                  multiline
                  rows={3}
                  name='taskName'
                  disabled={edit ? true : false}
                  value={
                    //@ts-ignore
                    currentTimesheetVersion.tasks[0].taskName
                  }
                  onChange={(e) => {
                    handleAdjustTaskChange(e);
                  }}
                  placeholder='Enter your tasks for the week...'></TextField>
              </Grid>
              {edit ? (
                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-end'>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='primary'
                      size='small'
                      onClick={() => setEdit(false)}
                      style={{ marginTop: '1rem' }}
                      startIcon={<EditIcon />}>
                      Edit Task
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-end'
                  spacing={2}
                  style={{ padding: '10px 0 0 25px' }}>
                  <Grid
                    item
                    style={{
                      cursor: 'pointer',
                    }}>
                    <DoneAllIcon fontSize='small' color='primary' />
                    <Typography
                      color='primary'
                      variant='button'
                      onClick={() => {
                        setCurrentTaskName(
                          //@ts-ignore
                          taskName,
                        );
                        setEdit(true);
                      }}>
                      Save
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      cursor: 'pointer',
                    }}>
                    <ClearIcon fontSize='small' color='error' />
                    <Typography
                      color='error'
                      variant='button'
                      onClick={async () => {
                        await handleAdjustTasknameCancel();
                        setEdit(true);
                      }}>
                      Cancel
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </>
          );
        case 'APPROVED':
          return (
            <Grid
              container
              direction='row'
              justify='space-around'
              alignItems='flex-start'
              spacing={2}>
              <Grid item style={{ maxWidth: '150px' }}>
                <Typography>{taskName}</Typography>
              </Grid>
            </Grid>
          );
        case 'POSTED':
          return (
            <Grid
              container
              direction='row'
              justify='space-around'
              alignItems='flex-start'
              spacing={2}>
              <Grid item style={{ maxWidth: '150px' }}>
                <Typography>{taskName}</Typography>
              </Grid>
            </Grid>
          );
        default:
          return (
            <Grid
              container
              direction='row'
              justify='space-around'
              alignItems='flex-start'
              spacing={2}>
              <Grid item style={{ maxWidth: '150px' }}>
                <Typography>{taskName}</Typography>
              </Grid>
            </Grid>
          );
      }
    } else {
      if (taskName.length > 0) {
        return (
          <Grid
            container
            direction='row'
            justify='space-around'
            alignItems='flex-start'
            spacing={2}>
            <Grid item style={{ maxWidth: '150px' }}>
              <Typography>{taskName}</Typography>
            </Grid>
          </Grid>
        );
      } else {
        return (
          <Grid
            container
            direction='row'
            justify='space-around'
            alignItems='flex-start'
            spacing={2}>
            <Grid item style={{ maxWidth: '150px' }}>
              <Typography>{taskName}</Typography>
            </Grid>
          </Grid>
        );
      }
    }
  };

  const renderTextFieldOrText = (status, task, day, index) => {
    if (status === 'REJECTED' || status === 'APPROVED' || status === 'POSTED')
      return (
        <Grid>
          <Grid>
            <Typography variant='subtitle2' color='initial'>
              {task.weekData[day].hrs}
            </Typography>
          </Grid>
        </Grid>
      );
    if (status === 'SUBMITTED' && weekNumber === currentWeekData.weekNumber) {
      return (
        <TextField
          inputProps={{
            style: {
              textAlign: 'center',
            },
            className: classes.input,
            pattern: '^(2[0-4]|1[0-9]|[0-9])$',
            maxLength: 2,
          }}
          variant='outlined'
          color='primary'
          name={`${task.taskId}_${day}`}
          value={task.weekData[day].hrs}
          onChange={(e) => {
            handleAdjustTimesheetChange(e, 'hrs', index);
          }}
          className={classes.fieldWidth}
          size='small'></TextField>
      );
    } else {
      return (
        <Grid>
          <Grid>
            <Typography variant='subtitle2' color='initial'>
              {task.weekData[day].hrs}
            </Typography>
          </Grid>
        </Grid>
      );
    }
  };

  const renderReason = (status) => {
    switch (status) {
      case 'REJECTED':
        return (
          <OPKeyValue
            label='Reason'
            value={
              // @ts-ignore
              currentTimesheetVersion?.suggestion?.length < 1 ||
              currentTimesheetVersion?.suggestion === undefined ? (
                <b>No Reason Provided</b>
              ) : (
                <b>{currentTimesheetVersion?.suggestion}</b>
              )
            }
          />
        );
      case 'APPROVED':
        return (
          <OPKeyValue
            label='Description'
            value={
              <b>This version of Timesheet is Approved by Project Manager</b>
            }
          />
        );
      case 'POSTED':
        return (
          <OPKeyValue
            label='Description'
            value={<b>This version of Timesheet was Posted.</b>}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  const open = Boolean(anchorEl);

  // console.log({ allTasks });
  console.log({ timesheetList });
  console.log({ defaultTasks });
  // console.log({ currentTimesheetVersion });

  return (
    <Fragment>
      <OPLoader isLoading={isLoading} />
      <Box mb={2}>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='space-between'
          alignItems='center'>
          <Grid container direction='row' spacing={2} item xs={8}>
            <OPKeyValue
              label='Status'
              value={
                currentTimesheetVersion &&
                currentTimesheetVersion!.status !== undefined ? (
                  <b>{currentTimesheetVersion?.status}</b>
                ) : (
                  <b>NOT SUBMITTED</b>
                )
              }
            />

            {timesheetList.length > 0 && (
              <>{renderReason(currentTimesheetVersion?.status)}</>
            )}
          </Grid>
          <Grid item>
            {currentTimesheetVersion &&
            currentTimesheetVersion.status === 'APPROVED' ? (
              <Button
                variant='contained'
                color='primary'
                size='small'
                onClick={() => downloadTimesheet([timesheetId])}
                style={{ marginBottom: '1rem' }}
                // className={classes.button}
                startIcon={<DownloadIcon />}>
                Timesheet
              </Button>
            ) : null}
            {/* <br />
            {timesheetList.length > 0 && currentTimesheetVersion && (
              <FormControl size='small'>
                <Select
                  variant='outlined'
                  value={currentTimesheetVersion._id}
                  onChange={handleCurrentTimesheetVersionChange}>
                  {timesheetList.map((timesheet) => (
                    <MenuItem value={timesheet._id}>
                      Version - {timesheet.id.split('-')[3]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )} */}
          </Grid>
        </Grid>
      </Box>

      <Fragment>
        {timesheetList.length ? (
          <Fragment>
            <Box className={classes.fixHeight}>
              <TableContainer variant='outlined' component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align='center'
                        style={{ borderRight: '1px solid lightgrey' }}>
                        <Typography
                          variant='body1'
                          className={classes.boldFont}
                          color='initial'>
                          Tasks
                        </Typography>
                      </TableCell>
                      {weekDisplay?.map((day) => (
                        <TableCell align='center'>{day}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {currentTimesheetVersion && (
                    <TableBody>
                      {currentTimesheetVersion?.tasks?.map((task, index) => (
                        <TableRow>
                          <TableCell
                            className={classes.rowBackground}
                            align='center'
                            style={{
                              borderRight: '1px solid lightgrey',
                            }}>
                            <>
                              {renderTaskFieldOrText(
                                currentTimesheetVersion.status,
                                currentTimesheetVersion.tasks[0].taskName,
                              )}

                              {/* {weekNumber === currentWeekData.weekNumber &&
                              (currentTimesheetVersion.status === 'SUBMITTED' ||
                                currentTimesheetVersion.status ===
                                  'REJECTED') ? (
                                <>
                                  {edit ? (
                                    <Grid
                                      container
                                      direction='row'
                                      justify='flex-start'
                                      alignItems='flex-end'>
                                      <Grid item xs={12}>
                                        <Button
                                          variant='contained'
                                          color='primary'
                                          size='small'
                                          onClick={() => setEdit(false)}
                                          style={{ marginTop: '1rem' }}
                                          startIcon={<EditIcon />}>
                                          Edit Task
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  ) : (
                                    <Grid
                                      container
                                      direction='row'
                                      justify='flex-start'
                                      alignItems='flex-end'
                                      spacing={2}
                                      style={{ padding: '10px 0 0 25px' }}>
                                      <Grid
                                        item
                                        style={{
                                          cursor: 'pointer',
                                        }}>
                                        <DoneAllIcon
                                          fontSize='small'
                                          color='primary'
                                        />
                                        <Typography
                                          color='primary'
                                          variant='button'
                                          onClick={() => {
                                            setCurrentTaskName(
                                              //@ts-ignore
                                              currentTimesheetVersion.tasks[0]
                                                .taskName,
                                            );
                                            setEdit(true);
                                          }}>
                                          Save
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        style={{
                                          cursor: 'pointer',
                                        }}>
                                        <ClearIcon
                                          fontSize='small'
                                          color='error'
                                        />
                                        <Typography
                                          color='error'
                                          variant='button'
                                          onClick={async () => {
                                            await handleAdjustTasknameCancel();
                                            setEdit(true);
                                          }}>
                                          Cancel
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  )}
                                </>
                              ) : (
                                <></>
                              )} */}
                            </>
                          </TableCell>
                          <>
                            {dayArray.map((day, _index) => {
                              return (
                                <TableCell
                                  className={classes.rowBackground}
                                  align='center'>
                                  <Grid
                                    container
                                    spacing={1}
                                    direction='row'
                                    justify='center'>
                                    <Grid
                                      container
                                      spacing={1}
                                      direction='row'
                                      justify='center'>
                                      <Grid item>
                                        {renderTextFieldOrText(
                                          currentTimesheetVersion.status,
                                          task,
                                          day,
                                          index,
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                              );
                            })}
                          </>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Box>
            <Box mt={2}>
              <Grid item>
                <Paper
                  className={classnames(
                    classes.paperPadding,
                    classes.paperBackground,
                  )}
                  variant='outlined'>
                  <Typography variant='body2' color='initial' align='right'>
                    <b>Total Hours : {getVersionTotalHours()} </b>
                  </Typography>
                </Paper>
              </Grid>
              {currentTimesheetVersion &&
                timesheetList[timesheetList.length - 1]._id ===
                  currentTimesheetVersion?._id &&
                renderButtonAndAmendReason(currentTimesheetVersion!.status)}
            </Box>
          </Fragment>
        ) : (
          <Fragment>
            <Box className={classes.fixHeight}>
              <TableContainer variant='outlined' component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align='center'
                        style={{ borderRight: '1px solid lightgrey' }}>
                        <Typography
                          variant='body1'
                          className={classes.boldFont}
                          color='initial'>
                          Task
                        </Typography>
                      </TableCell>
                      {weekDisplay?.map((day) => (
                        <TableCell align='center'>{day}</TableCell>
                      ))}
                    </TableRow>
                    {/* <TableRow>
                      {JSON.stringify({
                        defaultTasks,
                        timesheetList,
                        allTasks,
                        selectedWeekData,
                      })}
                    </TableRow> */}
                  </TableHead>

                  <TableBody>
                    {defaultTasks.map((task, index) => (
                      <TableRow>
                        <TableCell
                          className={classes.rowBackground}
                          align='center'
                          style={{
                            borderRight: '1px solid lightgrey',
                            // padding: '10px',
                          }}>
                          <Grid item xs={12}>
                            <TextField
                              variant='outlined'
                              color='primary'
                              multiline
                              rows={3}
                              name='taskName'
                              disabled={edit ? true : false}
                              value={task.taskName}
                              onChange={(e) => {
                                handleTaskNameChange(e);
                              }}
                              placeholder='Enter your tasks for the week...'></TextField>
                          </Grid>
                          {edit ? (
                            <Grid
                              container
                              direction='row'
                              justify='flex-start'
                              alignItems='flex-end'>
                              <Grid item xs={12}>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  size='small'
                                  onClick={() => setEdit(false)}
                                  style={{ marginTop: '1rem' }}
                                  startIcon={<EditIcon />}>
                                  Edit Task
                                </Button>
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid
                              container
                              direction='row'
                              justify='flex-start'
                              alignItems='flex-end'
                              spacing={2}
                              style={{ padding: '10px 0 0 25px' }}>
                              <Grid
                                item
                                style={{
                                  cursor: 'pointer',
                                }}>
                                <DoneAllIcon fontSize='small' color='primary' />

                                <Typography
                                  color='primary'
                                  variant='button'
                                  onClick={() => {
                                    setCurrentTaskName(
                                      defaultTasks[0].taskName,
                                    );
                                    setEdit(true);
                                  }}>
                                  Save
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                style={{
                                  cursor: 'pointer',
                                }}>
                                <ClearIcon fontSize='small' color='error' />
                                <Typography
                                  color='error'
                                  variant='button'
                                  onClick={async () => {
                                    await handleCancel();
                                    setEdit(true);
                                  }}>
                                  Cancel
                                </Typography>
                              </Grid>

                              {/* <Grid item>
                              <IconButton
                                color='secondary'
                                aria-owns={
                                  open ? 'mouse-over-popover' : undefined
                                }
                                aria-haspopup='true'
                                onMouseEnter={(e) => handlePopoverOpen(e, task)}
                                onMouseLeave={handlePopoverClose}>
                                <InfoIcon fontSize='small' />
                              </IconButton>
                            </Grid> */}
                            </Grid>
                          )}
                        </TableCell>

                        {dayArray.map((day, _index) => {
                          return (
                            <TableCell
                              className={classes.rowBackground}
                              align='center'>
                              <Grid
                                container
                                spacing={1}
                                direction='row'
                                justify='center'>
                                <Grid
                                  container
                                  spacing={1}
                                  direction='row'
                                  justify='center'>
                                  <Grid item>
                                    {weekNumber ===
                                    currentWeekData.weekNumber ? (
                                      <TextField
                                        inputProps={{
                                          style: { textAlign: 'center' },
                                          className: classes.input,
                                          pattern: '^(2[0-4]|1[0-9]|[0-9])$',
                                          maxLength: 2,
                                        }}
                                        variant='outlined'
                                        color='primary'
                                        name={`${task.taskName}_${day}`}
                                        value={task.weekData[day].hrs}
                                        onChange={(e) => {
                                          handleSubmitTimesheetChange(
                                            e,
                                            'hrs',
                                            index,
                                          );
                                        }}
                                        className={classes.fieldWidth}
                                        size='small'></TextField>
                                    ) : (
                                      <Typography
                                        variant='subtitle2'
                                        color='initial'>
                                        {task.weekData[day].hrs}
                                      </Typography>
                                    )}
                                    {/* <TextField
                                          inputProps={{
                                            style: { textAlign: 'center' },
                                            className: classes.input,
                                            pattern: '^(2[0-4]|1[0-9]|[0-9])$',
                                            maxLength: 2,
                                          }}
                                          variant='outlined'
                                          color='primary'
                                          name={`${task.taskId}_${day}`}
                                          value={task.weekData[day].hrs}
                                          onChange={(e) => {
                                            handleSubmitTimesheetChange(
                                              e,
                                              'hrs',
                                              index,
                                            );
                                          }}
                                          className={classes.fieldWidth}
                                          size='small'></TextField> */}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box mt={2}>
              <Grid item>
                <Paper
                  className={classnames(
                    classes.paperPadding,
                    classes.paperBackground,
                  )}
                  variant='outlined'>
                  <Typography variant='body2' color='initial' align='right'>
                    <b>Total Hours : {getTotalHours()} </b>
                  </Typography>
                </Paper>
              </Grid>
              <Fragment>
                <Grid item container direction='row-reverse'>
                  {weekNumber === currentWeekData.weekNumber ? (
                    <Button
                      variant='contained'
                      disabled={hrsError ? true : false}
                      onClick={() => handleSubmit(defaultTasks)}
                      style={{ marginLeft: '8px' }}
                      color='primary'>
                      Submit
                    </Button>
                  ) : (
                    ``
                  )}
                </Grid>
              </Fragment>
            </Box>
          </Fragment>
        )}
      </Fragment>

      <Popover
        id='mouse-over-popover'
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        {currentTask && (
          <Typography variant='subtitle2' color='primary'>
            {`${moment(currentTask.startDate).format('DD MMM YY')}-${moment(
              currentTask.endDate,
            ).format('DD MMM YY')}`}{' '}
            <br />
            {currentTask.taskDesc}
          </Typography>
        )}
      </Popover>

      <OPAreYouSure
        isOpen={areYouSureOpen}
        closeAreYouSure={() => setAreYouSureOpen(false)}
        functionToCall={() => handleSaveOrApprove('REJECTED', 'adj')}>
        You want to adjust the already approved timesheet?
      </OPAreYouSure>
    </Fragment>
  );
};

export default EmpWeekTable;
