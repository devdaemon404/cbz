import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import LoginState from 'src/contexts/login/loginState';
import { useContext } from 'react';
import LoginContext from 'src/contexts/login/loginContext';
import Reset from '../../../components/reset-password/Reset';

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
  const router = useRouter();
  console.log(router);
  const token = router.query.token;
  const reset = router.query.reset;
  console.log('reset value', reset);
  const classes = useStyles();
  const { resetAgain } = useContext(LoginContext);
  const { root, image } = classes;
  const style = clsx(root, image);

  useEffect(() => {
    console.log('In index reset again value', resetAgain);
  }, [resetAgain]);

  return (
    <div className={style}>
      <LoginState token={token} reset={reset}>
        <Reset />
      </LoginState>
    </div>
  );
}
