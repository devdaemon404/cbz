import React, { Fragment, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Theme,
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
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@material-ui/core';
import OPKeyValue from 'src/components/common/OPKeyValue';
import classnames from 'classnames';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';
import {
  TaskType,
  TimesheetTaskType,
  VATimeSheetDataType,
  VAEmpTimeSheetDataType,
  TimeSheetDataType,
  VATimesheetType,
} from 'src/types/project-manager/timesheet';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';

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

const WeekTable = () => {
  const classes = useStyles();
  const {
    // selectedProject,
    selectedVAWeekData,
    vaTimesheetList,
    allTasks,
    empId,
  } = useContext(VATimesheetContext);

  console.log({ vaTimesheetList });
  // console.log('ALL TASKS', allTasks);

  const { weekDisplay, weekNumber } = selectedVAWeekData;

  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  const [currentTimesheetVersion, setCurrentTimesheetVersion] = useState<
    VAEmpTimeSheetDataType
  >();

  // const [currentEmployeeTimesheet, setCurrentEmployeeTimesheet] = useState<
  //   VATimeSheetDataType
  // >();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getVersionTotalHours = () => {
    let sum = 0;
    currentTimesheetVersion?.tasks.map((task) => {
      dayArray.map((day) => {
        sum += task.weekData[day].hrs;
      });
    });
    return sum;
  };

  const handleCurrentTimesheetVersionChange = (event) => {
    const timesheet = vaTimesheetList[0].data.find(
      (timesheet) => timesheet._id === event.target.value,
    );
    console.log({ timesheet });
    setCurrentTimesheetVersion(timesheet);
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

  useEffect(() => {
    console.log(vaTimesheetList[0].data.length - 1);
    if (vaTimesheetList.length) {
      const initialTimesheet = vaTimesheetList[0];
      console.log({ initialTimesheet });
      setCurrentTimesheetVersion({
        ...initialTimesheet.data[vaTimesheetList[0].data.length - 1],
      });
    }
  }, [vaTimesheetList]);

  useEffect(() => {
    const tempTimesheet = vaTimesheetList.filter(
      (timesheet) => timesheet.employeeId === empId,
    );
    if (tempTimesheet)
      setCurrentTimesheetVersion({
        ...tempTimesheet[0].data[tempTimesheet[0].data.length - 1],
      });
  }, [empId]);

  // useEffect(() => {
  //   setCurrentTimesheetVersion(undefined);
  // }, [weekNumber]);

  console.log({ currentTimesheetVersion });

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
            value={<b>This version is Approved.</b>}
          />
        );
      case 'POSTED':
        return (
          <OPKeyValue
            label='Description'
            value={<b>This version was Posted.</b>}
          />
        );
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Fragment>
      <Box mb={2}>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='space-between'
          alignItems='center'>
          <Grid container direction='column' spacing={2} item xs={8}>
            {/* <OPKeyValue
              label='Project'
              value={
                selectedProject.projectName.length ? (
                  <b>{selectedProject.projectName}</b>
                ) : (
                  <b>default</b>
                )
              }
            /> */}
            {allTasks.length > 0 && (
              <OPKeyValue
                label='Status'
                value={
                  currentTimesheetVersion?.status !== undefined ? (
                    <b>{currentTimesheetVersion?.status}</b>
                  ) : (
                    <b>Not Submitted by Employee</b>
                  )
                }
              />
            )}

            {/* {vaTimesheetList.length > 0 && (
              <>{renderReason(currentTimesheetVersion?.status)}</>
            )} */}
          </Grid>
          {/* <Grid item>
            {vaTimesheetList.length > 0 && currentTimesheetVersion && (
              <FormControl size='small'>
                <Select
                  variant='outlined'
                  value={currentTimesheetVersion._id}
                  onChange={handleCurrentTimesheetVersionChange}>
                  {vaTimesheetList[0].data.map((timesheet) => (
                    <MenuItem value={timesheet._id}>
                      Version - {timesheet.id.split('-')[3]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid> */}
        </Grid>
      </Box>
      <Fragment>
        {allTasks.length ? (
          <Fragment>
            {vaTimesheetList.length ? (
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
                      </TableHead>
                      {currentTimesheetVersion && (
                        <TableBody>
                          {currentTimesheetVersion?.tasks?.map(
                            (task, index) => (
                              <TableRow>
                                <TableCell
                                  className={classes.rowBackground}
                                  align='center'
                                  style={{
                                    borderRight: '1px solid lightgrey',
                                  }}>
                                  <Grid
                                    container
                                    direction='row'
                                    justify='space-between'
                                    alignItems='center'>
                                    <Grid item>
                                      {
                                        allTasks.find(
                                          (_task) => task.taskId === _task._id,
                                        )?.taskName
                                      }
                                    </Grid>
                                    <Grid item>
                                      <IconButton
                                        color='secondary'
                                        aria-owns={
                                          open
                                            ? 'mouse-over-popover'
                                            : undefined
                                        }
                                        aria-haspopup='true'
                                        onMouseEnter={(e) =>
                                          handlePopoverOpen(e, task)
                                        }
                                        onMouseLeave={handlePopoverClose}>
                                        <InfoIcon fontSize='small' />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
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
                                        <Grid item>
                                          <Typography
                                            variant='subtitle2'
                                            color='initial'>
                                            {task.weekData[day].hrs}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ),
                          )}
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
                </Box>
              </Fragment>
            ) : (
              <Paper variant='outlined'>
                {allTasks.map((task) => (
                  <List className={classes.root}>
                    <ListItem>
                      <ListItemText
                        primary={task.taskName}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component='span'
                              variant='body2'
                              color='textPrimary'>
                              {`${moment(task.startDate).format(
                                'DD MMM YY',
                              )}-${moment(task.endDate).format('DD MMM YY')}`}
                            </Typography>
                            <br />
                            {`Description : ${task.taskDesc}`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </List>
                ))}
                <Typography variant='body1' align='center' color='primary'>
                  No Timesheet Created For the tasks above.
                </Typography>
              </Paper>
            )}
          </Fragment>
        ) : (
          <Fragment>
            <Paper variant='outlined'>
              <Typography variant='body1' align='center' color='primary'>
                No Tasks for current week.
              </Typography>
            </Paper>
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
    </Fragment>
  );
};

export default WeekTable;
