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
}));

function LoginForm() {
  const classes = useStyles();
  const {
    loginData,
    handleLoginChange,
    loginOnSubmit,
    error,
    isLoading,
    setResetAgain,
  } = useContext(LoginContext);
  const { username, password } = loginData;
  const { userNameError, passwordError } = error;

  const submitForm = (e) => {
    e.preventDefault();
    loginOnSubmit();
  };

  return (
    <Fragment>
      <OPLoader isLoading={isLoading} />
      <Grid item xs={5}>
        <form onSubmit={submitForm}>
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='flex-start'
            spacing={1}>
            <Grid item className={classes.form}>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Username
              </Typography>
              <TextField
                type='text'
                // @ts-ignore
                error={userNameError.errFlag}
                variant='outlined'
                margin='normal'
                style={{ width: '100%' }}
                name='username'
                value={username}
                onChange={(e) => {
                  handleLoginChange(e);
                }}
                autoFocus
                // placeholder='username'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {userNameError.errFlag ? (
                <Typography color='error'>{userNameError.errMsg}</Typography>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item className={classes.form}>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Password
              </Typography>
              <TextField
                // @ts-ignore
                error={passwordError.errFlag}
                variant='outlined'
                margin='normal'
                required
                name='password'
                style={{ width: '100%' }}
                type='password'
                value={password}
                onChange={(e) => {
                  handleLoginChange(e);
                }}
                // placeholder='password'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {passwordError.errFlag ? (
                <Typography color='error'>{passwordError.errMsg}</Typography>
              ) : (
                <></>
              )}
            </Grid>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              // onClick={loginOnSubmit}
              className={classes.submit}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* {/* <Link href='reset-password'  variant='body2' color='textSecondary'> */}
                {/* Need Assistance with Login? */}
                {/* </Link> */}
              </Grid>
              <Grid item>
                <Link
                  href='resetpassword?reset=true'
                  variant='body2'
                  color='textSecondary'>
                  Forget Password?
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Fragment>
  );
}

export default LoginForm;
