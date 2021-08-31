import { useRouter } from 'next/router';
import {
  makeStyles,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Backdrop,
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DashboardBaseLayout from '../../employee/dashboard/DashboardBaseLayout';
import React, { Fragment, useEffect, useState, useContext } from 'react';
import DocumentUpload from './DocumentUpload';
import WorkHistory from './WorkHistory';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AcademicInformation from './AcademicInformation';
import OnboardingSubmission from './OnboardingSubmission';

import OnboardingContext from '../../../contexts/employee/onboardingContext';
import OtpInput from 'react-otp-input';
import OPLoader from 'src/components/common/OPLoader';
import { OPToast } from 'src/utils/op-toast';
import EmployeeSkills from './EmployeeSkills';
import FamilyInfo from './FamilyInfo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 100000,
      color: '#fff',
    },
  }),
);

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const getSteps = (): string[] => {
  return [
    'Work History',
    'Academic Information',
    'Family Information',
    'Upload Document',
    'Review and submit',
  ];
};

const OnboardingBase = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const steps = getSteps();

  const router = useRouter();

  const onboardingContext = useContext(OnboardingContext);
  const {
    handleOnboardingOtp,
    handleFormSubmission,
    documents,
    isLoading,
    checkData,
    contactInfo,
  } = onboardingContext;

  const [otp, setOtp] = useState('');

  const [mentionedReason, setMentionedReason] = useState('');

  const isStepOptional = (step: number) => {
    return false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const getStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return <WorkHistory />;
      case 1:
        return <AcademicInformation />;
      case 2:
        return <FamilyInfo />;
      case 3:
        return <DocumentUpload />;
      case 4:
        return (
          <OnboardingSubmission
            onUploadClick={() => {
              setActiveStep(2);
            }}
          />
        );
      default:
        return <div>'Unknown step'</div>;
    }
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
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

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!checkData()) {
      return;
    }
    let fileNotUploadedCount = 0;
    for (const doc of documents) {
      console.log(doc);
      if (doc.files.length === 0) {
        fileNotUploadedCount++;
      }
    }
    console.log('count', fileNotUploadedCount);

    // fileNotUploadedCount represents the amount of files not uploaded
    if (fileNotUploadedCount > 0) {
      setOpen(true);
    } else if (fileNotUploadedCount === 0) {
      console.log('test');
      handleOTPOpen();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openOTP, setOpenOTP] = useState(false);

  const handleOTPOpen = () => {
    if (
      mentionedReason.trim() === '' &&
      documents.filter((d) => d.files.length === 0).length !== 0
    ) {
      OPToast.show('Please Mention a Reason for not Uploading');
    } else {
      handleOnboardingOtp(mentionedReason);
      setOpen(false);
      setOpenOTP(true);
    }
  };
  const handleOTPClose = () => {
    setOpenOTP(false);
  };

  const handleOnboardingFormSubmit = async () => {
    if (otp !== '') {
      handleFormSubmission(otp);
      setOpen(false);
    }
  };
  return (
    <Fragment>
      <DashboardBaseLayout sidebarIndex={1} userName={contactInfo.fullName}>
        <div className={classes.root}>
          <OPLoader isLoading={isLoading} />
          <Stepper activeStep={activeStep} alternativeLabel nonLinear>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: { optional?: React.ReactNode } = {};
              return (
                <Step
                  key={label}
                  {...stepProps}
                  onClick={() => {
                    setActiveStep(index);
                  }}
                  style={{ cursor: 'pointer' }}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
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
                  <Paper
                  // style={{
                  //   padding: '40px 80px'
                  // }}
                  >
                    {getStepContent(activeStep)}
                  </Paper>
                </Typography>
                <div>
                  <Grid container direction={'row-reverse'}>
                    <Paper style={{ padding: '2rem' }}>
                      {activeStep === steps.length - 1 ? (
                        <Button
                          onClick={handleClick}
                          variant='contained'
                          color='primary'
                          className={classes.button}>
                          Submit
                        </Button>
                      ) : (
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleNext}
                          className={classes.button}>
                          {' '}
                          Next{' '}
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
                    </Paper>
                  </Grid>
                </div>
              </div>
            )}
          </div>
          {/* MODAL for submission of form */}
          <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
            maxWidth='md'
            fullWidth>
            <DialogTitle id='customized-dialog-title' onClose={handleClose}>
              <IconButton
                color='primary'
                style={{ padding: '0px 4px 4px 0px' }}>
                <ErrorOutlineIcon color='error' />
              </IconButton>
              Confirm
            </DialogTitle>
            <DialogContent dividers>
              <Grid container justify='center' alignItems='center'>
                <Grid item xs={10}>
                  <Paper
                    elevation={0}
                    style={{
                      backgroundColor: '#f2f2f2',
                      borderRadius: 0,
                      padding: '16px',
                      margin: '8px',
                    }}>
                    <Typography>
                      Are you sure you want to proceed without the following
                      documents?
                    </Typography>
                    <ul>
                      {documents.map((doc) => {
                        if (doc.files.length === 0) {
                          return <li>{doc.label}</li>;
                        } else return <div />;
                      })}
                    </ul>
                  </Paper>
                  <TextField
                    id='standard-full-width'
                    label='Mention Reasons'
                    value={mentionedReason}
                    onChange={(e) => setMentionedReason(e.target.value)}
                    style={{ margin: 8 }}
                    placeholder='Write your reasons here...'
                    fullWidth
                    required
                    margin='normal'
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color='primary'>
                Go Back
              </Button>
              <Button
                autoFocus
                onClick={handleOTPOpen}
                variant='contained'
                color='primary'>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            onClose={handleOTPClose}
            aria-labelledby='customized-dialog-title'
            open={openOTP}
            maxWidth='sm'
            fullWidth>
            <DialogTitle id='customized-dialog-title' onClose={handleOTPClose}>
              Validate OTP
            </DialogTitle>
            <DialogContent dividers>
              <Grid
                container
                direction='column'
                justify='center'
                alignItems='center'
                spacing={2}>
                <Grid item xs={10}>
                  <Paper
                    elevation={0}
                    style={{
                      backgroundColor: '#f2f2f2',
                      borderRadius: 0,
                      padding: '16px',
                    }}>
                    <Typography>
                      To finish the process please enter the one time password
                      sent to you email address.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    shouldAutoFocus
                    isInputNum
                    inputStyle={{
                      fontSize: '25px',
                      width: '2rem',
                      borderRadius: '5px',
                      backgroundColor: 'f2f2f2',
                    }}
                    separator={<span style={{ width: '12px' }}></span>}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Button
                    onClick={handleOnboardingFormSubmit}
                    autoFocus
                    variant='contained'
                    color='primary'>
                    Validate
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardBaseLayout>
    </Fragment>
  );
};

export default OnboardingBase;
