import React, { Fragment, useContext } from 'react';
import {
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import LoginContext from 'src/contexts/login/loginContext';
import OPLoader from '../common/OPLoader';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0.5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  fontBold: {
    fontWeight: 'bold',
  },
}));

function ResetForm() {
  const classes = useStyles();
  const { isLoading } = useContext(LoginContext);

  return (
    <Fragment>
      <OPLoader isLoading={isLoading} />
      <Typography variant='h5' color='primary' className={classes.fontBold}>
        Password Requirements
      </Typography>
      <Typography variant='subtitle1' color='initial'>
        A minimum of 8 characters
      </Typography>
      <Typography variant='subtitle1' color='initial'>
        Atleast 1 upper character
      </Typography>
      <Typography variant='subtitle1' color='initial'>
        Atleast 1 smaller casecharacter
      </Typography>
      <Typography variant='subtitle1' color='initial'>
        Atleast 1 special character
      </Typography>
      <Typography variant='subtitle1' color='initial'>
        Atleast 1 number
      </Typography>
    </Fragment>
  );
}

export default ResetForm;
