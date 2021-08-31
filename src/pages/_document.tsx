import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import React, { Fragment } from 'react';
import theme from '../utils/theme';

export default class MyDocument extends Document {
  public static async getInitialProps(documentContext: DocumentContext) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = documentContext.renderPage;

    documentContext.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(documentContext);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        <Fragment key='styles'>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </Fragment>,
      ],
    };
  }

  public render() {
    return (
      <Html>
        <Head>
          <meta charSet='utf-8' />
          <link rel='shortcut icon' href='/favicon.ico' />
          {/* PWA primary color */}
          <meta name='theme-color' content={theme.palette.primary.main} />
          <link
            rel='shortcut icon'
            type='image/x-icon'
            href='/static/images/logo_transparent_favi.png'
          />
          {/*<link href="https://fonts.googleapis.com/css?family=Crimson+Pro:200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap&subset=latin-ext" rel="stylesheet" />*/}
          <link
            href='https://fonts.googleapis.com/css?family=Cabin:400,400i,500,500i,600,600i,700,700i&display=swap'
            rel='stylesheet'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
