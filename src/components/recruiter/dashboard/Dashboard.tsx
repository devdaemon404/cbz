import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import moment from 'moment';
import {
  Work as WorkIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  AccessAlarm as PendingIcon,
} from '@material-ui/icons';
import OverviewCard from './OverviewCard';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Notification from './Notification';
import PMDashboardSVG from 'src/components/common/svg/PMDashboardSVG';
import PMInterviewContext from 'src/contexts/project-manager/interview/pm-interview-context';
import OPLoader from 'src/components/common/OPLoader';
import VADashboardContext from 'src/contexts/vendor-admin/dashboard/va-dashboard-context';
import { useState } from 'react';

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

  const {
    getAllNotifications,
    allNotifications,
    isLoading,
    redirectFromNotification,
    getDashboardData,
  } = useContext(VADashboardContext);

  const [data, setData] = useState({
    contractors: 0,
    demands: 0,
  });

  useEffect(() => {
    getAllNotifications();

    const getData = async () => {
      const res = await getDashboardData();
      if (res) {
        setData(res);
      }
    };
    getData();
  }, []);

  const overviewCardDataRecruiter = [
    { label: 'Total Demands', number: 21, icon: ReceiptIcon },
    {
      label: 'Demands Pending for Submittals',
      number: 11,
      icon: PendingIcon,
    },
    { label: 'Total Onboardings', number: 20, icon: PeopleIcon },
    { label: 'Interview Schedules', number: 15, icon: ScheduleIcon },
  ];

  const overviewCardData = [
    {
      label: 'Total Contractors',
      number: data ? data?.contractors : 0,

      icon: PeopleIcon,
    },
    // { label: 'Timesheet Approvals', number: 21, icon: ScheduleIcon },
    // { label: 'Work Order Approvals', number: 25, icon: WorkIcon },
    // { label: 'Interview Schedules', number: 28, icon: ScheduleIcon },
    // { label: 'Profile Review', number: 18, icon: AssessmentIcon },
    {
      label: 'Total Demands',
      number: data ? (data?.demands ? data.demands : 0) : 0,
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
    rejectReason?: string;
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
      rejectReason: '',
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
    data.rejectReason = notification.contentParams.filter(
      (d) => d.name === 'reject_reason',
    )[0]?.value;
    notificationData.push(data);
  });

  notificationData.reverse();

  const unreadLength = notificationData.filter((data) => !data.read).length;

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
