import {
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Button,
  Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';

import { useRouter } from 'next/router';

import OPLoader from 'src/components/common/OPLoader';
import CADashboardContext from 'src/contexts/client-admin/dashboard/ca-dashboard-context';
import { Form, Formik } from 'formik';
import initialFormValues from './FormModel/initialFormValues';
import validationSchema from './FormModel/validationSchema';
import BasicInformation from './BasicInfomation';
import ContactDetails from './ContactDetails';
import OrganisationDetails from './OrganisationDetails';
import BillingAddress from './BillingAddress';
import OfficeAddress from './OfficeAddress';
import AdditionalAddress from './AdditionalAddress';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      margin: 'auto',
      padding: '3rem',
    },
    paperPadding: {
      padding: theme.spacing(3, 4),
      marginTop: theme.spacing(3),
    },
    fontBold: {
      fontWeight: 'bold',
    },
  });
});

const Account = () => {
  const classes = useStyles();
  const router = useRouter();

  const { isLoading } = useContext(CADashboardContext);
  const handleSubmit = (values, actions) => {
    console.log('values', values);
  };

  return (
    <div className={classes.root}>
      <OPLoader isLoading={isLoading} />
      <Typography variant='h4' color='primary' className={classes.fontBold}>
        Account Information
      </Typography>
      <Paper variant='outlined' className={classes.paperPadding}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}>
          <Form autoComplete={'off'}>
            <BasicInformation />
            <ContactDetails />
            <OrganisationDetails />
            <BillingAddress />
            <OfficeAddress />
            <AdditionalAddress />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              style={{ marginTop: '2rem' }}>
              Submit
            </Button>
          </Form>
        </Formik>
      </Paper>
    </div>
  );
};

export default Account;
