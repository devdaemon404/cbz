import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { CircularProgress, Backdrop } from '@material-ui/core';

import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 100000,
      color: '#fff',
    },
  })
);

const OPLoader = ({ isLoading }) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

export default OPLoader;
