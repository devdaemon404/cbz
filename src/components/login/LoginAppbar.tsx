import React from 'react';
import { Typography, AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 700,
  },
}));

function LoginAppbar() {
  const classes = useStyles();
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Cloudsbuzz
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default LoginAppbar;
