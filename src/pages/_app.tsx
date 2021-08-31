import React, { Fragment } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import '../utils/scrollbar.css';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ThemeProvider } from '@material-ui/styles';
import defaultTheme from '../utils/theme';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps, router }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Head>
        <title>OP-Cloudsbuzz</title>
      </Head>
      <Component {...pageProps} key={router.route} />
    </ThemeProvider>
  );
}
