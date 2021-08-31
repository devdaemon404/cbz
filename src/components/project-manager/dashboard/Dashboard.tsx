import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import moment from 'moment';
import {
  Work as WorkIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
} from '@material-ui/icons';
import OverviewCard from './OverviewCard';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Notification from './Notification';
import PMDashboardSVG from 'src/components/common/svg/PMDashboardSVG';
import PMInterviewContext from 'src/contexts/project-manager/interview/pm-interview-context';
import OPLoader from 'src/components/common/OPLoader';
import { columnsTotalWidthSelector } from '@material-ui/data-grid';

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

const Dashboard = () => {
  const classes = useStyles();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState({
    profiles: 0,
    demands: 0,
    contractors: 0,
  });

  const {
    getAllNotifications,
    allNotifications,
    isLoading,
    redirectFromNotification,
    getDashboardData,
  } = useContext(PMInterviewContext);

  const getInitialData = async () => {
    await getAllNotifications();
    const res = await getDashboardData();
    console.log('From da', res);
    setDashboardData(res);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    console.log('DAshboar', dashboardData);
    // getInitialData();
  }, [dashboardData]);

  const overviewCardData = [
    {
      label: 'Total Contractors',
      number: dashboardData.contractors,
      icon: PeopleIcon,
    },
    // { label: 'Timesheet Approvals', number: 21, icon: ScheduleIcon },
    // { label: 'Work Order Approvals', number: 25, icon: WorkIcon },
    // { label: 'Interview Schedules', number: 28, icon: ScheduleIcon },
    {
      label: 'Profile Review',
      number: dashboardData.profiles,
      icon: AssessmentIcon,
    },
    {
      label: 'Total Demands',
      number: dashboardData.demands,
      icon: ReceiptIcon,
    },
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
    profileId: string;
    reject_reason: string;
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
      profileId: '',
      reject_reason: '',
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
    data.profileId = notification.contentParams[0].value;
    data.reject_reason = notification.contentParams.filter(
      (p) => p.name === 'reject_reason',
    )[0]?.value;
    notificationData.push(data);
  });

  notificationData.reverse();

  const unreadLength = notificationData.filter((data) => !data.read).length;

  // notificationData = [
  //   {
  //     name: 'Steve Bold',
  //     avatarUrl: 'https://material-ui.com/static/images/avatar/1.jpg',
  //     post: 'Real Estate Owner',
  //     time: '14:21',
  //     body:
  //       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas autem doloremque consectetur simi',
  //   },
  //   { name: 'Marcio De Lahoya', avatarUrl: 'https://material-ui.com/static/images/avatar/2.jpg',
  //     post: 'Normal Customer',
  //     time: '08:13',
  //     body:
  //       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, deserunt esse! Iste commodi ',
  //   },
  //   {
  //     name: 'Steve Bold',
  //     avatarUrl: 'https://material-ui.com/static/images/avatar/1.jpg',
  //     post: 'Real Estate Owner',
  //     time: '14:21',
  //     body:
  //       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas autem doloremque consectetur simi',
  //   },
  //   {
  //     name: 'Marcio De Lahoya',
  //     avatarUrl: 'https://material-ui.com/static/images/avatar/2.jpg',
  //     post: 'Normal Customer',
  //     time: '08:13',
  //     body:
  //       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, deserunt esse! Iste commodi ',
  //   },
  //   {
  //     name: 'Steve Bold',
  //     avatarUrl: 'https://material-ui.com/static/images/avatar/1.jpg',
  //     post: 'Real Estate Owner',
  //     time: '14:21',
  //     body:
  //       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas autem doloremque consectetur simi',
  //   },
  // ];

  return (
    <div className={classes.root}>
      <OPLoader isLoading={isLoading} />
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
                spacing={1}
                direction='row'
                justify='space-between'
                alignItems='center'>
                <Grid item container direction='row' spacing={4}>
                  {overviewCardData.map((data, index) => (
                    <Grid
                      item
                      xs={4}
                      key={index}
                      style={{ marginTop: '1.5rem' }}>
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
                  style={{ textAlign: 'center' }}
                  color='primary'>
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
                          data.profileId,
                          data.reject_reason,
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
