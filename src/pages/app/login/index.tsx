import React from 'react';
import { Grid, Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import LoginAppbar from 'src/components/login/LoginAppbar';
import Welcome from 'src/components/login/Welcome';
import LoginForm from 'src/components/login/LoginForm';
import LoginState from 'src/contexts/login/loginState';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  
    height: '97.5vh',
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 700,
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/UyhtqolKMb4)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const { root, image } = classes;
  const style = clsx(root, image);

  return (
    <div className={style}>
      <LoginAppbar />
      <Box mt={8} mb={0} ml={20} mr={20}>
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          component={Paper}
          variant='outlined'
          spacing={4}
          style={{
            backgroundColor: '#C7C7D5',
            opacity: '0.8',
            padding: '2rem 4rem',
          }}>
          <Welcome />
          <LoginState>
            <LoginForm />
          </LoginState>
        </Grid>
      </Box>
    </div>
  );
}
