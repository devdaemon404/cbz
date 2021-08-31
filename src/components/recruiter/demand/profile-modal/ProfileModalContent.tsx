import React, { useContext, useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Paper,
} from '@material-ui/core';
import { Formik, Form } from 'formik';

import GeneralInformation from './Forms/GeneralInfomation';

import PackageInformation from './Forms/PackageInformation';
import validationSchema from './FormModel/validationSchema';
import { profileFormModel } from './FormModel/profileFormModel';
import formInitialValues from './FormModel/formInitialValues';
import { makeStyles } from '@material-ui/core/styles';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import RDemandContext from 'src/contexts/recruiter/demand/r-demand-context';
const useStyles = makeStyles((theme) => ({
  stepper: {
    padding: theme.spacing(4, 20),
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttons: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  paperStyle: {
    padding: theme.spacing(5),
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: theme.spacing(60),
    maxHeight: theme.spacing(60),
    marginBottom: theme.spacing(2),
  },
}));

const steps = ['General Information', 'Package Information'];
const { formId, formField } = profileFormModel;

function _renderStepContent(step, values) {
  // console.log('values: ', values);
  switch (step) {
    case 0:
      return <GeneralInformation formField={formField} />;
    case 1:
      return <PackageInformation formField={formField} />;
    // case 2:
    //   return <ReviewOrder />;
    default:
      return <div>Not Found</div>;
  }
}

export default function CheckoutPage() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const {
    handleModal,
    initialModalValues,
    addProfile,
    modalMode,
    updateProfile,
  } = useContext(RDemandContext);
  const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function _submitForm(values, actions) {
    console.log('values', values);
    if (modalMode === 'Create Profile') {
      await addProfile(values);
    } else {
      await updateProfile(values);
    }
    actions.setSubmitting(false);
    handleModal(false);
  }

  function _handleSubmit(values, actions) {
    // console.log('submitting...', values, actions);
    if (isLastStep) {
      _submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function _handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
    <React.Fragment>
      <Grid container direction='column' spacing={1}>
        <Grid item>
          <Paper variant='outlined'>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.paperStyle} variant='outlined'>
            <Formik
              initialValues={initialModalValues}
              validationSchema={currentValidationSchema}
              style={{ position: 'relative' }}
              onSubmit={_handleSubmit}>
              {({ isSubmitting, values }) => (
                <Form id={formId} className={classes.formLayout}>
                  <div>{_renderStepContent(activeStep, values)}</div>

                  <div
                    className={classes.buttons}
                    style={{
                      position: 'absolute',
                      bottom: '40px',
                      right: '55px',
                    }}>
                    {activeStep !== 0 && (
                      <Button onClick={_handleBack} className={classes.button}>
                        Back
                      </Button>
                    )}
                    <div className={classes.wrapper}>
                      <Button
                        disabled={isSubmitting}
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={classes.button}>
                        {isLastStep ? 'Submit' : 'Next'}
                      </Button>
                      {isSubmitting && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
