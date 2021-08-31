import {
  Avatar,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    fontBold: {
      fontWeight: 'bold',
    },
    avatarSize: {
      height: theme.spacing(8),
      width: theme.spacing(8),
    },
    hoverEffect: {
      '&:hover': {
        backgroundColor: '#f2f2f2',
      },
      transition: 'ease-in .2s',
      borderBottom: '1px solid lightgrey',
      cursor: 'pointer',
    },
  });
});

const Notification = ({ data }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction='row'
      spacing={3}
      className={classes.hoverEffect}
      justify='space-between'
      alignItems='center'
      wrap='nowrap'>
      <Grid item>
        <Avatar
          alt={data.name}
          src={data.avatarUrl}
          className={classes.avatarSize}
        />
      </Grid>
      <Grid item container direction='column' spacing={1}>
        <Grid
          item
          container
          direction='row'
          justify='space-between'
          wrap='nowrap'
          alignItems='center'>
          <Grid item container direction='column'>
            <Grid item>
              <Typography
                variant='body1'
                color='initial'
                className={classes.fontBold}>
                {data.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant='subtitle2'
                color='initial'
                style={{
                  fontWeight: 'normal',
                  fontSize: '.8rem',
                }}
                className={classes.fontBold}>
                {data.post}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>{data.time}</Grid>
        </Grid>
        <Grid item>
          <Typography
            variant='subtitle2'
            color='initial'
            style={{ color: '#121212', opacity: 0.54, fontWeight: 'normal' }}>
            {data.body}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Notification;
