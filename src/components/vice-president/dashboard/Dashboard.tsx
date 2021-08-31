import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

import WorkIcon from '@material-ui/icons/Work';
import PeopleIcon from '@material-ui/icons/People';

import OverviewCard from './OverviewCard';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Notification from './Notification';
import PMDashboardSVG from 'src/components/common/svg/PMDashboardSVG';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '95%',
      margin: 'auto',
      marginTop: '-1rem',
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
  });
});

const Dashboard = () => {
  const classes = useStyles();

  const overviewCardData = [
    { label: 'Total Contractors', number: 21, icon: PeopleIcon },
    {
      label: 'Work Order Apporvals',
      number: 11,
      icon: WorkIcon,
    },
  ];

  const notificationData = [
    {
      name: 'Steve Bold',
      avatarUrl: 'https://material-ui.com/static/images/avatar/1.jpg',
      post: 'Real Estate Owner',
      time: '14:21',
      body:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas autem doloremque consectetur similique excepturi ullam, velit, totam unde voluptatum repellat facilis asperiores consequatur?',
    },
    {
      name: 'Marcio De Lahoya',
      avatarUrl: 'https://material-ui.com/static/images/avatar/2.jpg',
      post: 'Normal Customer',
      time: '08:13',
      body:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, deserunt esse! Iste commodi tempora atque doloribus, delectus ea repellendus nihil tempore beatae impedit perferendis corrupti, tenetur nulla, quo obcaecati dolorum',
    },
  ];

  return (
    <div className={classes.root}>
      <Paper variant='outlined' className={classes.paperPadding}>
        <Typography variant='h5' color='inherit'>
          Overview
        </Typography>
        <Grid
          container
          spacing={1}
          direction='row'
          justify='space-between'
          alignItems='center'>
          <Grid
            item
            container
            direction='row'
            justify='center'
            alignItems='stretch'
            className={classes.threeForth}
            spacing={4}>
            {overviewCardData.map((data, index) => (
              <Grid
                item
                xs={6}
                key={index}
                style={{ marginTop: '1.5rem', height: '100%' }}>
                <OverviewCard data={data} />
              </Grid>
            ))}
          </Grid>
          <Grid
            item
            container
            direction='column'
            justify='center'
            alignItems='center'
            spacing={1}
            className={classes.oneForth}>
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
                transform: 'scale(1.1)',
                position: 'relative',
                top: '1rem',
              }}>
              <PMDashboardSVG />
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid
        container
        direction='row'
        style={{ marginTop: '16px' }}
        spacing={2}
        wrap='nowrap'>
        <Grid item style={{ flexGrow: 1 }}>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Grid
              container
              direction='row'
              justify='space-between'
              alignItems='center'>
              <Grid item>
                <Typography variant='h5' color='inherit'>
                  Notifications
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle2' color='initial'>
                  You have{' '}
                  <span style={{ color: 'darkblue' }}>
                    {notificationData.length} new notifications.
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <div style={{ marginTop: '1rem', marginBottom: '8px' }}>
              <Grid container spacing={3} direction='column'>
                {notificationData.map((data, index) => (
                  <Grid item key={index}>
                    <Notification data={data} />
                  </Grid>
                ))}
              </Grid>
            </div>
          </Paper>
        </Grid>

        <Grid item style={{ flex: 'none' }}>
          <Paper variant='outlined' style={{ overflow: 'hidden' }}>
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
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
