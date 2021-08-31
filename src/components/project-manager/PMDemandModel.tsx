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
import PMDemandContext from '../../contexts/project-manager/demand/pm-demand-context';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import SummaryStep from './SummaryStep';

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
      minHeight: theme.spacing(54),
      maxHeight: theme.spacing(54),
    },
    nextButton: {
      margin: theme.spacing(2, 0),
    },
  }),
);

const PMDemandModal = ({ isOpen, title, onSubmit, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const {
    clearDemandFields,
    validation,
    disabled,
    checkData,
    demandInfo,
  } = useContext(PMDemandContext);

  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

  useEffect(() => {
    let isError = false;
    Object.values(validation).forEach((d) => {
      if (d.error) {
        isError = d.error;
      }
    });
    // Object.values(demandInfo).forEach((d) => {
    //   console.log(d);
    // });
    console.log('demand idnodsafasdll', demandInfo);
    setNextButtonDisabled(isError);
  }, [validation]);

  const classes = useStyles();
  const getSteps = (): string[] => {
    return ['Demand Information', 'Skills', 'System Access', 'Demand Summary'];
  };

  const steps = getSteps();
  const isStepOptional = (step: number) => {
    return false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const getStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return <DemandInformation />;
      case 1:
        return <Skills />;
      case 2:
        return <SystemAccess title={title} />;
      case 3:
        return <SummaryStep />;
      default:
        return <div>'Unknown step'</div>;
    }
  };

  const handleNext = (step) => {
    console.log('Active step: ', step);
    if (step === 0) {
      if (demandInfo.name === '') {
        OPToast.show('Fields cannot be empty', {
          variant: ToastVariant.INFO,
          duration: 1000,
        });
        return;
      }
      if (demandInfo.duration == 0) {
        OPToast.show(`Enter duration greater than 0`, {
          variant: ToastVariant.ERROR,
        });
        return;
      }
      //@ts-ignore
      // if (demandInfo.expense === 0) {
      //   OPToast.show(`Please enter expense greater than 0`, {
      //     variant: ToastVariant.ERROR,
      //   });
      //   return;
      // }
      if (demandInfo.hours_per_week <= 1 || demandInfo.hours_per_week > 168) {
        OPToast.show(`Hours per week should be between 1 and 168`, {
          variant: ToastVariant.ERROR,
        });
        return;
      }
    }

    if (step === 1) {
      // if (demandInfo.skills.additional_skills.length === 0) {
      //   OPToast.show(`Please enter atleast one additional skill`, {
      //     variant: ToastVariant.ERROR,
      //   });
      //   return;
      // }
      if (demandInfo.skills.primary_skills.length === 0) {
        OPToast.show(`Please enter atleast one primary skill`, {
          variant: ToastVariant.ERROR,
        });
        return;
      }
      if (demandInfo.skills.secondary_skills.length === 0) {
        OPToast.show(`Please enter atleast one secondary skill`, {
          variant: ToastVariant.ERROR,
        });
        return;
      }
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const onSubmitClick = async () => {
    //Validations
    if (!checkData()) {
      return;
    }

    await onSubmit();
    setActiveStep(0);
    onClose();
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
    <Dialog
      onClose={handleDemandDialogClose}
      aria-labelledby='customized-dialog-title'
      open={isOpen}
      maxWidth='md'
      fullWidth>
      <DialogTitle>
        <Typography variant='h6'>{title}</Typography>
        <IconButton
          aria-label='delete'
          className={classes.closeButton}
          size='small'
          onClick={handleDemandDialogClose}>
          <CloseIcon fontSize='inherit' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
                  <Typography className={classes.instructions}>
                    <Paper variant='outlined' className={classes.paperStyle}>
                      {getStepContent(activeStep)}
                    </Paper>
                  </Typography>
                  <div className={classes.nextButton}>
                    <Grid container direction={'row-reverse'}>
                      {activeStep === steps.length - 1 ? (
                        <Button
                          onClick={onSubmitClick}
                          variant='contained'
                          color='primary'
                          className={classes.button}>
                          Finish
                        </Button>
                      ) : (
                        <Button
                          disabled={nextButtonDisabled}
                          variant='contained'
                          color='primary'
                          onClick={() => handleNext(activeStep)}
                          className={classes.button}>
                          Next
                        </Button>
                      )}
                      {isStepOptional(activeStep) && (
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleSkip}
                          className={classes.button}>
                          Skip
                        </Button>
                      )}
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}>
                        Back
                      </Button>
                    </Grid>
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PMDemandModal;
