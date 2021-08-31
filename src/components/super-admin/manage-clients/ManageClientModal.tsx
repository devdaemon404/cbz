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
  Switch,
  Theme,
  Typography,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import React, { useContext } from 'react';
import CheckboxField from 'src/components/common/FormFields/CheckboxField';
import InputField from 'src/components/common/FormFields/InputField';
import SelectField from 'src/components/common/FormFields/SelectField';
import SwitchField from 'src/components/common/FormFields/SwitchField';
import SAManageClientContext from 'src/contexts/super-admin/manage-clients/sa-mc-context';
import validationSchema from './FormModel/validationSchema';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    paperStyle: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(4),
    },
  }),
);

const ManageClientModal = () => {
  const classes = useStyles();

  const {
    openModal,
    modalMode,
    handleModal,
    submitUpdateClient,
    initialModalValues,
    submitAddClient,
  } = useContext(SAManageClientContext);

  const handleSubmit = (values) => {
    console.log('values', values);
    if (modalMode === 'Edit') {
      submitUpdateClient(values);
    } else if (modalMode === 'Create Client') {
      submitAddClient(values);
    }
    handleModal(false);
  };

  const currencies = [
    {
      value: 'INR',
      label: 'INR',
    },
    {
      value: 'USD',
      label: 'USD',
    },
    {
      value: 'EUR',
      label: 'EUR',
    },
  ];

  return (
    <Dialog
      onClose={() => handleModal(false)}
      aria-labelledby='customized-dialog-title'
      open={openModal}
      maxWidth='md'
      fullWidth>
      <DialogTitle>
        <Typography variant='h6'>{modalMode}</Typography>
        <IconButton
          aria-label='delete'
          className={classes.closeButton}
          size='small'
          onClick={() => handleModal(false)}>
          <CloseIcon fontSize='inherit' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialModalValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}>
          <Form autoComplete={'off'}>
            <Paper variant='outlined' className={classes.paperStyle}>
              <Grid
                container
                direction='row'
                alignItems='center'
                justify='center'
                spacing={3}>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    First Name<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField name='firstName' placeholder='Enter First Name' />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Last Name<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField name='lastName' placeholder='Enter Last Name' />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Email<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField
                    name='username'
                    placeholder='Enter Email'
                    disabled={modalMode === 'Edit'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Mobile<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField name='mobile' placeholder='Enter Mobile Number' />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Company Name<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField name='name' placeholder='Enter Company Name' />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Currency<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <SelectField name='currency' data={currencies} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Client Fees<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField
                    name='client_fees'
                    placeholder='Enter Client Fees'
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    System Fees<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField
                    name='system_fees'
                    placeholder='Enter System Fees'
                  />
                </Grid>
                {modalMode === 'Edit' && (
                  <Grid item xs={12}>
                    <Typography variant='body1' color='initial'>
                      Active<span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <SwitchField name='enabled' />
                  </Grid>
                )}
              </Grid>
            </Paper>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              style={{ marginBottom: '1rem', marginLeft: '90%' }}>
              Submit
            </Button>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ManageClientModal;
