import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Theme,
  Typography,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import DemandInformation from './DemandInformation';
import Skills from './Skills';
import SystemAccess from './SystemAccess';
import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import SummaryTab from './SummaryTab';
import DemandsSummaryTab from './DemandsSummaryTab';
import { Formik, Form } from 'formik';
import validationSchema from './FormModel/validationSchema';
import { demandFormModel } from './FormModel/demandFormModel';
import AdditionalInformation from './AdditionalInformation';
import ShareDemand from './ShareDemand';
import { addRequestIdToDemand } from 'server/controllers/demand';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    paperStyle: {
      overflowY: 'auto',
      overflowX: 'hidden',
      minHeight: theme.spacing(70),
      maxHeight: theme.spacing(70),
    },
    nextButton: {
      margin: theme.spacing(2, 0),
    },
  }),
);

const { formId, formField } = demandFormModel;

const PMDemandModal = ({ isOpen, title, onSubmit, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const {
    clearDemandFields,
    validation,
    disabled,
    checkData,
    initialModalValues,
    handleDemandFormSubmission,
    demandInfo,
    editDemandOnSubmit,
    editMode,
    shareSuccess,
    getDemandsForProject,
    demands,
    addRequestIdToDemand,
    sendAdditionalData,
  } = useContext(CADemandContext);

  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
  const currentValidationSchema = validationSchema[activeStep];

  // console.log(demands[demands.length - 1].request_id);

  useEffect(() => {
    let isError = false;
    Object.values(validation).forEach((d: any) => {
      if (d.error) {
        isError = d.error;

        console.log(d.error);
      }
    });

    // Object.values(demandInfo).forEach((d) => {
    //   console.log(d);
    // });

    setNextButtonDisabled(isError);
  }, [validation]);

  const stepperSteps = [
    'Demand Information',
    'Skills',
    'General Information',
    'Additional Information',
    'Summary',
    'Share Demand',
  ];
  const classes = useStyles();
  const getSteps = (): string[] => {
    return stepperSteps;
  };

  const steps = getSteps();
  const isStepOptional = (step: number) => {
    return false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const getStepContent = (step: number, values): JSX.Element => {
    switch (step) {
      case 0:
        return <DemandInformation formField={formField} />;
      case 1:
        return <Skills formField={formField} />;
      case 2:
        return <SystemAccess title={title} formField={formField} />;
      case 3:
        return <AdditionalInformation formField={formField} />;
      case 4:
        return <DemandsSummaryTab demandData={values} />;
      case 5:
        return <ShareDemand formField={formField} />;
      default:
        return <div>'Unknown step'</div>;
    }
  };

  const onSubmitClick = async (values, actions) => {
    console.log('VAlues', values);
    console.log('ACTIVE STEP', activeStep);
    console.log('total steps', steps.length - 1);

    if (activeStep === 2) {
      if (editMode) {
        await editDemandOnSubmit(values);
      } else {
        await handleDemandFormSubmission(values);
        // await getDemandsForProject();
      }
      setActiveStep(3);
    } else if (activeStep === steps.length - 2) {
      await sendAdditionalData(values);
      setActiveStep(5);
      // onClose();
    } else if (activeStep === steps.length - 1) {
      if (shareSuccess) {
        setActiveStep(0);
        if (demands[demands.length - 1].request_id === undefined)
          await addRequestIdToDemand(demands[demands.length - 1].id as string);
        onClose();
      } else {
        OPToast.show('Share demand First!', {
          variant: ToastVariant.WARNING,
        });
        setActiveStep(5);
      }
      // if (editMode) {
      //   await editDemandOnSubmit(values);
      // } else {
      //   await handleDemandFormSubmission(values);
      // }
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // On demand dialog close
  const handleDemandDialogClose = () => {
    onClose();
    setActiveStep(0);
    clearDemandFields();
  };
  return (
    <>
      <Typography variant='h6'>{title}</Typography>
      <Grid container direction='column' spacing={1}>
        <Grid item>
          <Paper variant='outlined'>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: ReactNode } = {};
                return (
                  <Step
                    key={label}
                    {...stepProps}
                    style={{ cursor: 'pointer' }}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Paper>
        </Grid>

        <Grid item>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <Formik
                  initialValues={initialModalValues}
                  validationSchema={currentValidationSchema}
                  onSubmit={onSubmitClick}>
                  {(state) => (
                    <Form id={formId}>
                      <Typography className={classes.instructions}>
                        <Paper
                          className={classes.paperStyle}
                          variant='outlined'>
                          {getStepContent(activeStep, state.values)}
                        </Paper>
                      </Typography>

                      <Grid container direction='column' spacing={3}>
                        <Grid item>
                          <Paper
                            variant='outlined'
                            style={{ padding: '5px 10px' }}>
                            <div className={classes.nextButton}>
                              <Grid
                                container
                                direction={'row-reverse'}
                                justify={'space-between'}>
                                <div>
                                  <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.button}>
                                    Back
                                  </Button>
                                  <Button
                                    variant='contained'
                                    type='submit'
                                    color='primary'
                                    className={classes.button}>
                                    {activeStep === steps.length - 1
                                      ? 'Finish'
                                      : 'Next'}
                                  </Button>
                                  {/* ) : (
      <Button
        onClick={() => handleNext(activeStep)}
        type='submit'
        disabled={nextButtonDisabled}
        variant='contained'
        color='primary'
        className={classes.button}>
        Next
      </Button>
    )} */}
                                  {isStepOptional(activeStep) && (
                                    <Button
                                      variant='contained'
                                      color='primary'
                                      onClick={handleSkip}
                                      className={classes.button}>
                                      Skip
                                    </Button>
                                  )}
                                </div>
                                {/* <div>
                                  <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={(e) => onClose()}
                                    className={classes.button}>
                                    Close
                                  </Button>
                                </div> */}
                              </Grid>
                            </div>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default PMDemandModal;
