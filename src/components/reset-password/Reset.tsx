import React, { useEffect, useContext } from 'react';
import { Grid, Box, Paper } from '@material-ui/core';
import LoginAppbar from 'src/components/login/LoginAppbar';
import Welcome from 'src/components/reset-password/Welcome';
import ResetForm from 'src/components/reset-password/ResetForm';
import LoginContext from 'src/contexts/login/loginContext';

export default function Reset() {
  const { resetAgain } = useContext(LoginContext);

  useEffect(() => {
    console.log('In index reset again value', resetAgain);
  }, [resetAgain]);

  return (
    <>
      <LoginAppbar />
      <Box mt={8} mb={0} ml={40} mr={40}>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='center'
          component={Paper}
          variant='outlined'
          spacing={8}
          style={{
            backgroundColor: '#C7C7D5',
            opacity: '0.8',
            padding: '2rem 4rem',
          }}>
          <Grid item xs={resetAgain ? 12 : 7}>
            <Welcome />
          </Grid>
          {!resetAgain && (
            <Grid item xs={4}>
              <ResetForm />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
