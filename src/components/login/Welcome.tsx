import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GradientIcon from '@material-ui/icons/Gradient';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function Welcome() {
  const classes = useStyles();
  return (
    <Grid item xs={7}>
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='flex-start'
        spacing={2}>
        <Grid item spacing={4}>
          <Typography variant='h4'>Welcome to</Typography>
          <Typography color='primary' variant='h3' style={{ fontWeight: 700 }}>
            CLOUDSBUZZ
          </Typography>
        </Grid>
        <Grid item spacing={4}>
          <Typography variant='body1'>
            A technology company (tech company) is a type of business entity
            that focuses mainly on the development and manufacturing of
            technology products or providing technology as a service.
          </Typography>
        </Grid>
        <Grid item spacing={4}>
          <Grid container spacing={2} style={{ padding: '0.5rem 1rem' }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant='text'
                color='inherit'
                className={classes.button}
                startIcon={<GradientIcon />}>
                <Typography variant='body2' style={{ fontWeight: 800 }}>
                  Resources
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant='text'
                color='inherit'
                className={classes.button}
                startIcon={<HelpIcon />}>
                <Typography variant='body2' style={{ fontWeight: 800 }}>
                  Support
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Welcome;
