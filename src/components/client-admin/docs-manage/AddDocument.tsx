import React, { ChangeEvent, Fragment, useContext, useState } from 'react';
import OPLoader from '../../common/OPLoader';
import {
  Box,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Theme,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';

import CABaseLayout from '../CABaseLayout';
import CAComplianceContext from 'src/contexts/client-admin/compliance/ca-cc-context';
import Compliance from './Compliance';
import Vendors from './Vendors';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from 'src/components/common/FormFields/InputField';

const useStyles = makeStyles((theme: Theme) => ({
  font: {
    fontWeight: 'bolder',
  },
  paperPadding: {
    padding: '2rem',
    height: '100%',
  },
  buttonStyle: {
    float: 'right',
    // marginBottom: '2rem',
  },
}));

const AddDocument = () => {
  const classes = useStyles();
  const {
    isLoading,
    initialFormValues,
    addCompliance,
    updateCompliance,
    editMode,
    resetForm,
  } = useContext(CAComplianceContext);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');

  const onSubmitClick = (values, actions) => {
    console.log(values, actions);
    if (editMode) {
      updateCompliance(values);
    } else {
      addCompliance(values);
    }
  };

  const nameRegex = /^\w+$/;

  return (
    <Formik
      style={{ height: '100%' }}
      initialValues={initialFormValues}
      validationSchema={Yup.object().shape({
        document_type: Yup.string()
          .required(`Document Type is required`)
          .matches(nameRegex, 'Special characters and spaces not allowed'),
        document_name: Yup.string().required(`Document Name is required`),
      })}
      onSubmit={onSubmitClick}>
      <Form style={{ height: '100%' }}>
        <Paper variant='outlined' className={classes.paperPadding}>
          <Grid
            // component={Paper}
            // variant='outlined'
            container
            direction='column'
            spacing={4}
            wrap='nowrap'
            style={{ height: '100%' }}
            justify='center'>
            <Grid
              // component={Paper}
              // variant='outlined'
              style={{ padding: '4rem 2rem' }}
              item
              container
              direction='column'
              // spacing={1}
            >
              <Grid item style={{ marginBottom: '1rem' }}>
                <Typography
                  variant='h5'
                  color='primary'
                  className={classes.font}>
                  {editMode ? 'Update Document' : 'Create Document'}
                </Typography>
              </Grid>
              <Grid item style={{ marginBottom: '1rem' }}>
                <Typography variant='body1' color='initial'>
                  Document Type
                </Typography>
                <InputField name='document_type' />
              </Grid>
              <Grid item>
                <Typography variant='body1' color='initial'>
                  Document Name
                </Typography>
                <InputField name='document_name' />
              </Grid>
            </Grid>

            <Grid
              item
              // component={Paper}
              // variant='outlined'
              style={{ marginTop: '2rem' }}>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                className={classes.buttonStyle}>
                {editMode ? 'Update' : 'Create'}
              </Button>
              <Button
                variant='text'
                color='primary'
                onClick={resetForm}
                style={{ marginRight: '1rem' }}
                className={classes.buttonStyle}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Form>
    </Formik>
  );
};

export default AddDocument;
