import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
import Head from 'next/head';

const Success = () => {
  return (
    <Fragment>
      <Head>
        <title>OP-Success</title>
      </Head>
      <Typography variant='h6'>Form Uploaded Successfully</Typography>
    </Fragment>
  );
};
export default Success;
