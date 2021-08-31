import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  Work as WorkIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
} from '@material-ui/icons';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import OPLoader from 'src/components/common/OPLoader';
import PMDashboardSVG from 'src/components/common/svg/PMDashboardSVG';
import moment from 'moment';

import TimeSheetModal from '../timesheet/TimeSheetModal';
import Notification from './Notification';
import OverviewCard from './OverviewCard';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import EMPTimesheetContext from 'src/contexts/employee/timesheet/emp-ts-context';
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '99%',
      margin: 'auto',
      // marginTop: '-4rem',
    },
    paperPadding: {
      padding: theme.spacing(3, 4),
    },
    threeForth: {
      width: '60%',
    },
    oneForth: {
      width: '40%',
    },
    fontBold: {
      fontWeight: 'bold',
    },
    dashboardParent: {
      '&:hover .dashboard-icon': {
        transform: 'scale(1.04)',
        transition: 'all .3s ease-in-out',
      },
    },
    firstChild: {
      '&:first-child': {
        borderTop: '1px solid lightgrey',
      },
    },
  });
});

const Dashboard = (props) => {
  const classes = useStyles();
  const {
    fetchAllTimesheet,
    loading,
    setSelectedWeekData,
    employeeDetails,
    fetchAllTasks,
    projectId,
    getAllNotifications,
    allNotifications,
    notificationRead,
  } = useContext(EMPTimesheetContext);

  const [
    employeeTimeSheetModalOpened,
    setEmployeeTimeSheetModalOpened,
  ] = useState<boolean>(false);

  useEffect(() => {
    getAllNotifications();
  }, []);

  const overviewCardData = [
    {
      label: 'Name',
      value: employeeDetails
        ? `${employeeDetails?.profile?.firstname} ${employeeDetails?.profile?.lastname}`
        : '',
      icon: PersonIcon,
    },
    {
      label: 'Designation',
      value: employeeDetails
        ? `${employeeDetails?.user?.roles[0]?.role_name}`
        : '',
      icon: WorkIcon,
    },

    {
      label: 'Official Email ID',
      value: employeeDetails ? `${employeeDetails?.profile.email}` : '',
      icon: EmailIcon,
    },
    // {
    //   label: 'Project Name',
    //   value: employeeDetails ? `${employeeDetails?.project?.projectName} ` : '',
    //   icon: PersonIcon,
    // },
    // {
    //   label: 'Project Manager Email ID',
    //   value: employeeDetails
    //     ? `${employeeDetails?.project?.project_manager_user?.email}`
    //     : '',
    //   icon: EmailIcon,
    // },
  ];

  interface Notification {
    name: string;
    avatarUrl: string;
    post: string;
    time: string;
    body: string;
    type: string;
    id: string;
    user_id: string;
    read: boolean;
  }
  let notificationData: Notification[] = [];

  allNotifications.map((notification) => {
    let data: Notification = {
      name: '',
      avatarUrl: '',
      post: '',
      time: '',
      body: '',
      type: '',
      id: '',
      user_id: '',
      read: false,
    };

    data.name = notification.subject;
    data.avatarUrl = 'https://material-ui.com/static/images/avatar/1.jpg';
    data.post = notification.email;
    data.time = moment(notification.created).format('HH:mm');
    data.body = notification.description;
    data.type = notification.event_type.split('_')[0];
    data.id = notification.id;
    data.user_id = notification.user_id;
    data.read = notification.read;
    notificationData.push(data);
  });

  notificationData.reverse();
  const unreadLength = notificationData.filter((data) => !data.read).length;

  const redirectFromNotification = (type, id, user_id, read) => {
    if (!read) {
      notificationRead(id, user_id);
    }
    getAllNotifications();
  };

  return (
    <div className={classes.root}>
      <OPLoader isLoading={loading} />
      <Grid container direction='row' wrap='nowrap' spacing={2}>
        <Grid container direction='column' item xs={8} spacing={2}>
          <Grid item className={classes.dashboardParent}>
            <Paper variant='outlined' className={classes.paperPadding}>
              <Grid
                container
                direction='row'
                wrap='nowrap'
                justify='space-around'
                alignItems='center'>
                <Grid item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      disableToolbar
                      autoOk
                      orientation='landscape'
                      variant='static'
                      openTo='date'
                      value={new Date()}
                      onChange={() => console.log('changed')}
                    />
                  </MuiPickersUtilsProvider>

                  <Button
                    disabled={projectId ? false : true}
                    onClick={async () => {
                      if (projectId) await fetchAllTasks(projectId);
                      if (projectId) await fetchAllTimesheet(projectId);
                      setEmployeeTimeSheetModalOpened(true);
                    }}
                    variant='contained'
                    style={{
                      margin: 'auto',
                      marginBottom: '16px',
                      display: 'block',
                    }}
                    color='primary'>
                    View your Timesheet
                  </Button>
                  <TimeSheetModal
                    isOpen={employeeTimeSheetModalOpened}
                    username={props.userName}
                    onClose={async () => {
                      await setSelectedWeekData(getWeekData(new Date(), 7));
                      setEmployeeTimeSheetModalOpened(false);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction='column'
                  justify='center'
                  alignItems='center'
                  spacing={1}>
                  <Grid item>
                    <Typography
                      variant='h5'
                      color='primary'
                      align='center'
                      className={classes.fontBold}>
                      “Technology is best when it brings people together.”
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant='body1'
                      color='inherit'
                      align='center'
                      style={{ color: '#707070' }}>
                      Welcome to cloudsbuzz, this is a dashboard design.
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      transform: 'scale(1.3) translateY(10px)',
                      position: 'relative',
                      top: '1.3rem',
                    }}>
                    <PMDashboardSVG className='dashboard-icon' />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item>
            <Paper variant='outlined' className={classes.paperPadding}>
              <Typography
                variant='h5'
                color='inherit'
                className={classes.fontBold}>
                Overview
              </Typography>
              <Grid
                container
                spacing={2}
                direction='row'
                justify='space-between'
                alignItems='center'>
                <Grid item container direction='row' spacing={4}>
                  {overviewCardData.map((data, index) => (
                    <Grid item xs={4} key={index} style={{ marginTop: '2rem' }}>
                      <OverviewCard data={data} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid container direction='column' item xs={4}>
          <Paper variant='outlined'>
            <Grid
              item
              container
              direction='row'
              justify='space-between'
              alignItems='center'
              className={classes.paperPadding}>
              <Grid item>
                <Typography
                  variant='h5'
                  color='inherit'
                  className={classes.fontBold}>
                  Notifications
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle2' color='initial'>
                  You have{' '}
                  <span style={{ color: 'darkblue' }}>
                    {/* {notificationData.length} new notifications. */}
                    {unreadLength} unread notifications.
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction='column'
              wrap='nowrap'
              style={{ height: '80vh', overflowY: 'auto' }}>
              {notificationData.length === 0 ? (
                <Typography
                  variant='h6'
                  color='primary'
                  style={{ margin: '2rem' }}>
                  There are no notifications
                </Typography>
              ) : (
                <>
                  {notificationData.map((data, index) => (
                    <Grid
                      item
                      key={index}
                      className={classes.firstChild}
                      onClick={() =>
                        redirectFromNotification(
                          data.type,
                          data.id,
                          data.user_id,
                          data.read,
                        )
                      }>
                      <Notification data={data} />
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
