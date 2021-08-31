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
  Theme,
  Typography,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import InputField from 'src/components/common/FormFields/InputField';
import SelectField from 'src/components/common/FormFields/SelectField';
import VAManageUserContext from 'src/contexts/vendor-admin/manage-user/va-mu-context';
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

const ManageUserModal = () => {
  const classes = useStyles();

  const {
    openModal,
    modalMode,
    handleModal,
    submitAddUser,
    submitUpdateUser,
    initialModalValues,
  } = useContext(VAManageUserContext);

  const handleSubmit = (values) => {
    if (modalMode === 'Edit') {
      submitUpdateUser(values);
    } else if (modalMode === 'Create User') {
      submitAddUser(values);
    }
    handleModal(false);
  };

  const roles = [
    {
      value: 'SELECT',
      label: 'Select',
    },
    {
      value: 'RC',
      label: 'Recruiter',
    },
    {
      value: 'ACC',
      label: 'Finance Manager',
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
                  <InputField name='firstname' placeholder='Enter First Name' />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Last Name<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField name='lastname' placeholder='Enter Last Name' />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Username<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField
                    name='username'
                    placeholder='Enter Username'
                    disabled={modalMode === 'Edit'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1' color='initial'>
                    Email<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <InputField
                    name='email'
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
                    Role<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <SelectField
                    name='role'
                    data={roles}
                    disabled={modalMode === 'Edit'}
                  />
                </Grid>
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

export default ManageUserModal;
