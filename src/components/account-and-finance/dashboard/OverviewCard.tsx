import {
  Avatar,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '100%',
      height: '100%',
    },
    paperPadding: {
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
      height: '100%',
      transition: 'ease-in .2s',
      padding: theme.spacing(3),
      position: 'relative',
    },
    icon: {
      backgroundColor: theme.palette.primary.main,
      position: 'absolute',
      left: '50%',
      top: '0',
      transform: 'translate(-50%, -50%)',
    },
    hoverUnderline: {
      '&:hover': {
        textDecoration: 'underline',
      },
      cursor: 'pointer',
    },
    fontBold: {
      fontWeight: 'bold',
    },
  });
});

const OverviewCard = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper variant='elevation' elevation={5} className={classes.paperPadding}>
        <Avatar variant='rounded' className={classes.icon}>
          <data.icon color='inherit' />
        </Avatar>

        <Typography
          variant='body1'
          align='center'
          color='initial'
          style={{ color: 'gray', marginTop: '8px' }}>
          {data.label}
        </Typography>
        <Grid
          container
          direction='row'
          justify='space-around'
          alignItems='center'>
          <Grid item>
            <Typography
              variant='h2'
              color='primary'
              className={classes.fontBold}>
              {data.number}
            </Typography>
          </Grid>
          {/* <Grid item>
            <span className={classes.hoverUnderline}>
              <Typography variant='subtitle2' color='primary'>
                View more -&gt;
              </Typography>
            </span>
          </Grid> */}
        </Grid>
      </Paper>
    </div>
  );
};

export default OverviewCard;
