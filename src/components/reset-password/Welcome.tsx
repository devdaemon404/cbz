import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GradientIcon from '@material-ui/icons/Gradient';
import HelpIcon from '@material-ui/icons/Help';
import { Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/router';

import InputField from '../common/FormFields/InputField';
import LoginContext from 'src/contexts/login/loginContext';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function Welcome() {
  const router = useRouter();
  const classes = useStyles();

  const {
    resetPassword,
    resetAgain,
    resetPasswordWithUsername,
    currentInitialValues,
    currentValidationSchema,
  } = useContext(LoginContext);

  const handleSubmit = async (values, actions) => {
    if (resetAgain) {
      await resetPasswordWithUsername(values);
    } else {
      await resetPassword(values);
      actions.resetForm({
        values: {
          new_password: '',
          confirm_password: '',
          username: '',
        },
      });
      // await setFieldValue('new_password', '');
      // await setFieldValue('confirm_password', '');
    }
  };

  useEffect(() => {
    console.log('Reset Again chnged', resetAgain);
  }, [resetAgain]);

  return (
    <>
      <Typography variant='h5'>Welcome to</Typography>
      <Typography
        color='primary'
        variant='h4'
        style={{ fontWeight: 600, marginBottom: '2rem' }}>
        CLOUDSBUZZ
      </Typography>

      <Formik
        initialValues={currentInitialValues}
        onSubmit={handleSubmit}
        validationSchema={currentValidationSchema}>
        <Form>
          {resetAgain ? (
            <Grid container direction='column' spacing={4}>
              <Grid item>
                <Typography variant='h5'>
                  Get recovery link to your email
                </Typography>
              </Grid>
              <Grid item>
                <InputField
                  label='Username'
                  size='large'
                  type='username'
                  name='username'
                  placeholder='Enter your username'
                />
              </Grid>
              <Grid item>
                <Button
                  type='submit'
                  size='large'
                  variant='contained'
                  fullWidth
                  color='primary'>
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Typography
                  variant='subtitle2'
                  color='primary'
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => {
                    router.push('login');
                  }}>
                  Back to login
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container direction='column' spacing={4}>
              <Grid item>
                <Typography variant='h5'>Set new password</Typography>
              </Grid>
              <Grid item>
                <InputField
                  label='New Password'
                  size='large'
                  type='password'
                  name='new_password'
                  placeholder='Enter New Password'
                />
              </Grid>
              <Grid item>
                <InputField
                  label='Confirm Password'
                  size='large'
                  type='password'
                  name='confirm_password'
                  placeholder='Confirm Password'
                />
              </Grid>
              <Grid item>
                <Button
                  type='submit'
                  size='large'
                  variant='contained'
                  fullWidth
                  color='primary'>
                  Update Password
                </Button>
              </Grid>
              <Grid item>
                <Typography
                  variant='subtitle2'
                  color='primary'
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => {
                    router.push('login');
                  }}>
                  Back to login
                </Typography>
              </Grid>
            </Grid>
          )}
        </Form>
      </Formik>
    </>
  );
}

export default Welcome;
