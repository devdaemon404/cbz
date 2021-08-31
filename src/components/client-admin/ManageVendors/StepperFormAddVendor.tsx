import React, { useEffect, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
} from '@material-ui/core';
import CAManageVendorsContext, {
  contactInfoDataDefault,
} from 'src/contexts/client-admin/manage-vendors/ca-manage-vendors-context';
import { contactInfoDataType } from 'src/types/response-types/client-admin/manage-vendors';
import id from 'date-fns/esm/locale/id/index.js';

const FormContactInfo = ({ activeStep, errors, setErrors, validate }) => {
  const { dataOfContactInfo, setdataOfContactInfo, modalType } = useContext(
    CAManageVendorsContext,
  );

  const formInputs = [
    {
      label: 'First Name',
      value: 'admins_first_name',
      type: 'text',
      required: true,
      disabled: false,
    },
    {
      label: 'Last Name',
      value: 'admins_last_name',
      type: 'text',
      required: true,
      disabled: false,
    },
    {
      label: 'Contact Number',
      value: 'mobile',
      type: 'number',
      required: true,
      disabled: false,
    },

    {
      label: 'Email Id',
      value: 'admins_email',
      type: 'text',
      required: true,
      disabled: modalType === 'edit' ? true : false,
    },
  ];
  const contactInfo = formInputs.map((formInput, iterator) => {
    return (
      <Grid item lg={12} key={iterator}>
        <FormControl fullWidth>
          <Typography>
            <b>
              {' '}
              {formInput.label}
              {formInput.required && <span style={{ color: 'red' }}> *</span>}
            </b>{' '}
          </Typography>
          <TextField
            style={{ marginBottom: 20 }}
            {...(errors[formInput.value] && {
              error: true,
              helperText: errors[formInput.value],
            })}
            type={formInput.type}
            //@ts-ignore
            maxength={formInput.type === 'number' ? '10' : '100000'}
            variant='outlined'
            disabled={formInput.disabled}
            name={formInput.value}
            value={dataOfContactInfo[formInput.value]}
            onChange={(e) => {
              console.log();
              if (e.target.name === 'mobile') {
                if (e.target.value.length > 10) {
                  console.log('detected');
                  return;
                } else {
                  setdataOfContactInfo({
                    ...dataOfContactInfo,
                    [e.target.name]: e.target.value,
                  });
                }
              } else {
                setdataOfContactInfo({
                  ...dataOfContactInfo,
                  [e.target.name]: e.target.value,
                });
              }
            }}
            margin='dense'
          />
        </FormControl>
      </Grid>
    );
  });

  const sysAccessFields = [
    {
      label: 'Vendor Name',
      value: 'name',
      required: true,
      disabled: false,
    },

    {
      label: "Vendor's Username",
      value: 'admins_username',
      required: true,
      disabled: modalType === 'edit' ? true : false,
    },
  ];

  const SystemAccessData = sysAccessFields.map((formInput, iterator) => {
    return (
      <Grid item lg={12} key={iterator}>
        <FormControl fullWidth>
          <Typography>
            <b>
              {' '}
              {formInput.label}
              {formInput.required && <span style={{ color: 'red' }}> *</span>}
            </b>{' '}
          </Typography>
          <TextField
            style={{ marginBottom: 20 }}
            {...(errors[formInput.value] && {
              error: true,
              helperText: errors[formInput.value],
            })}
            variant='outlined'
            name={formInput.value}
            value={dataOfContactInfo[formInput.value]}
            disabled={formInput.disabled}
            onChange={(e) => {
              setdataOfContactInfo({
                ...dataOfContactInfo,
                [e.target.name]: e.target.value,
              });
            }}
            margin='dense'
          />
        </FormControl>
      </Grid>
    );
  });

  return (
    <>
      {activeStep === 0 && contactInfo}
      {activeStep === 1 && (
        <>
          {SystemAccessData}
          <Grid item lg={12}>
            <FormControl fullWidth>
              <Typography>
                <b>
                  Role
                  <span style={{ color: 'red' }}> *</span>
                </b>
              </Typography>
              <TextField
                style={{ marginBottom: 20 }}
                {...(errors.role && {
                  error: true,
                  helperText: errors.role,
                })}
                variant='outlined'
                name={'role'}
                onChange={(e) => {
                  setdataOfContactInfo({
                    ...dataOfContactInfo,
                    [e.target.name]: e.target.value,
                  });
                }}
                margin='dense'
                required
                value={dataOfContactInfo.role}
                select>
                <MenuItem value='' disabled>
                  SELECT ROLE
                </MenuItem>

                <MenuItem value='VENDOR_ADMIN'>Vendor Admin Manager</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    completed: {
      display: 'inline-block',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

function getSteps() {
  return ['Contact Information', 'System Access'];
}

export default function StepperFormAddVendor({ errors, setErrors, validate }) {
  const classes = useStyles();
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {},
  );

  const {
    dataOfContactInfo,
    setdataOfContactInfo,
    activeStep,
    setActiveStep,
  } = useContext(CAManageVendorsContext);

  const steps = getSteps();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    // @ts-ignore
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (activeStep < totalSteps() - 1) {
      console.log(dataOfContactInfo, activeStep);
      console.log(validate());
      if (validate()) {
        handleNext();
      }
    }
    if (activeStep === totalSteps() - 1) {
      return;
    }
  };

  //

  //
  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            {' '}
            <StepButton
              disabled
              onClick={handleStep(index)}
              completed={completed[index]}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        <form onSubmit={onSubmitHandler}>
          <div>
            <FormContactInfo
              activeStep={activeStep}
              errors={errors}
              setErrors={setErrors}
              validate={validate}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant='contained'
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}>
                Back
              </Button>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                style={
                  activeStep === 1 ? { display: 'none' } : { display: 'block' }
                }
                className={classes.button}>
                Next
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
