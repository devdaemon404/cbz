import React, { useContext } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core';
import CAManageUsersContext, {
  defaultModalData,
  defaultSelectedRowData,
} from 'src/contexts/client-admin/manage-users/ca-manage-users-context';
import OPAreYouSure from 'src/components/common/OPAreYouSure';
import { TemporaryCredentials } from 'aws-sdk';
import {
  modalDataType,
  SelectedDataType,
} from 'src/types/response-types/client-admin/manage-users';
// @ts-ignore
import { Datum } from 'src/contexts/client-admin/projects/ca-projects-context';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    typo: {
      fontWeight: 'bold',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },

    input: {
      width: '100%',
    },
  }),
);

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h5'>{children}</Typography>
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

export default function ManageUsersModal() {
  const classes = useStyles();
  const {
    modelOpen,
    modalType,
    selectedRowData,
    modalData,
    setModelOpen,
    addUpdateApiCall,
    setModalData,
  } = useContext(CAManageUsersContext);

  // closes the modal
  const handleClose = () => {
    setErrors({
      email: '',
      department_name: '',
      username: '',
      firstName: '',
      lastName: '',
      mobile: '',
    });
    setModelOpen(false);
  };
  // validation

  const [errors, setErrors] = React.useState({
    email: '',
    department_name: '',
    username: '',
    firstName: '',
    lastName: '',
    mobile: '',
  });

  // Custom Validations
  const validate = () => {
    // @ts-ignore-error
    let temp: SelectedDataType & Datum & modalDataType = defaultModalData;
    console.log(modalData);

    if (modalData.username.length === 0) {
      temp.username = 'This Field is required.';
    } else {
      temp.username = '';
    }
    if (modalData.firstName.length === 0) {
      temp.firstName = 'This Field is required.';
    } else if (!/^[a-zA-Z]*$/.test(modalData.firstName)) {
      temp.firstName = 'Only chracters Are allowed in Text Fields ';
    } else temp.firstName = '';

    if (modalData.lastName.length === 0) {
      temp.lastName = 'This Field is required.';
    } else if (!/^[a-zA-Z]*$/.test(modalData.lastName)) {
      temp.lastName = 'Only chracters Are allowed in Text Fields ';
    } else temp.lastName = '';

    if (modalData.role === 'VICE_PRESIDENT') {
      if (modalData.department_name.length === 0) {
        temp.department_name = 'This Field is required.';
      } else if (modalData.department_name.length < 3) {
        temp.department_name = 'Minimum 3 characters required';
      } else if (!/^[a-zA-Z]*$/.test(modalData.department_name)) {
        temp.department_name = 'Only chracters Are allowed in Text Fields ';
      } else {
        temp.department_name = '';
      }
    } else if (modalData.role !== 'VICE_PRESIDENT') {
      temp.department_name = '';
    }

    //    better regex for all email domains    :    ^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$

    temp.email =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.com$/.test(modalData.email) &&
      modalData.email.length > 0
        ? ''
        : 'Enter a valid email';

    temp.mobile = /^[6789]\d{9}$/.test(modalData.mobile)
      ? ''
      : 'Enter a valid Mobile Number';

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };
  // form Submit Handler for UPDATE and DELETE functions
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (validate()) {
      addUpdateApiCall();
      handleClose();
    }
  };

  // Pre Render all the Data in form as values
  React.useEffect(() => {
    let email = selectedRowData.email;
    let firstName = selectedRowData.firstname;
    let username = selectedRowData.username;
    let lastName = selectedRowData.lastname;
    let mobile = selectedRowData.mobile;
    let role = selectedRowData.role;
    let department_name = selectedRowData.department_name;
    let obj = {
      email,
      lastName,
      firstName,
      mobile,
      role,
      username,
      department_name,
    };
    // @ts-ignore-error
    setModalData(obj);
  }, [modelOpen]);

  // INPUT FIELDS MAP FUNCTION
  const formInputs = [
    {
      type: 'text',
      label: 'First Name',
      value: 'firstName',
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      label: 'Last Name',
      value: 'lastName',
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      label: 'User Name',
      required: true,
      value: 'username',
      disabled: modalType === 'edit' ? true : false,
    },
    {
      type: 'text',
      label: 'Email Id',
      value: 'email',
      required: true,
      disabled: modalType === 'edit' ? true : false,
    },

    {
      type: 'text',
      label: 'Contact Number',
      value: 'mobile',
      helpText: 'Enter a Correct Mobile Number',
      required: true,
      disabled: false,
    },
  ];

  const items = formInputs.map((formInput, iterator) => {
    return (
      <Grid item lg={6} key={iterator}>
        <FormControl fullWidth>
          <Typography className={classes.typo}>
            {formInput.label}
            {formInput.required && <span style={{ color: 'red' }}> *</span>}
          </Typography>
          <TextField
            {...(errors[formInput.value] && {
              error: true,
              helperText: errors[formInput.value],
            })}
            variant='outlined'
            margin='dense'
            disabled={formInput.disabled}
            onChange={(e) => {
              setModalData({ ...modalData, [formInput.value]: e.target.value });
            }}
            defaultValue={modalData[formInput.value]}
            // required={formInput.required}

            id={`my-input-${iterator}`}
            aria-describedby={`my-helper-text-${iterator}`}
          />
        </FormControl>
      </Grid>
    );
  });

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='md'
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={modelOpen}>
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          {modalType == 'new' ? 'Add New User' : 'Edit User'}
        </DialogTitle>
        <form onSubmit={onSubmitHandler}>
          <DialogContent dividers className={classes.form}>
            <Paper style={{ margin: 10, padding: 10 }} variant='outlined'>
              <Grid container item lg={12} spacing={3}>
                {items}
                <Grid item lg={6}>
                  <FormControl fullWidth>
                    <Typography className={classes.typo}>
                      Role
                      <span style={{ color: 'red' }}> *</span>
                    </Typography>
                    <TextField
                      disabled={modalType === 'edit' ? true : false}
                      variant='outlined'
                      margin='dense'
                      value={modalData.role}
                      // required
                      onChange={(e) => {
                        setModalData({ ...modalData, role: e.target.value });
                      }}
                      select>
                      <MenuItem value='CLIENT_ADMIN'>Client Manager</MenuItem>
                      <MenuItem value='PROJECT_MANAGER'>
                        Project Manager
                      </MenuItem>
                      <MenuItem value='VICE_PRESIDENT'>Vice President</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                {modalData.role === 'VICE_PRESIDENT' && (
                  <Grid item lg={6}>
                    <FormControl fullWidth>
                      <Typography className={classes.typo}>
                        Department Name
                        <span style={{ color: 'red' }}> *</span>
                      </Typography>
                      <TextField
                        variant='outlined'
                        margin='dense'
                        value={modalData.department_name}
                        {...(errors.department_name && {
                          error: true,
                          helperText: errors.department_name,
                        })}
                        onChange={(e) => {
                          setModalData({
                            ...modalData,
                            department_name: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color='primary' type='submit'>
              {modalType === 'new' ? 'Add New User' : 'Save changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
