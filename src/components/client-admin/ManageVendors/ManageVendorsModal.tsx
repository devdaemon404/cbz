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
  Paper,
  TextField,
} from '@material-ui/core';
import StepperFormAddVendor from './StepperFormAddVendor';
import CAManageVendorsContext, {
  errorDefault,
} from 'src/contexts/client-admin/manage-vendors/ca-manage-vendors-context';
import { errorType } from 'src/types/response-types/client-admin/manage-vendors';

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

export default function ManageUsersModal({ open, setOpen, type, selected }) {
  const handleClose = () => {
    setOpen(false);
  };

  const {
    handleAPICall,
    activeStep,
    setActiveStep,
    dataOfContactInfo,
  } = useContext(CAManageVendorsContext);

  const classes = useStyles();

  const callApi = () => {
    if (validate()) {
      if (activeStep === 1) {
        handleAPICall();
      } else if (activeStep === 0) {
        setActiveStep(1);
      }
    }
  };

  // validation

  const [errors, setErrors] = React.useState<errorType>(errorDefault);

  React.useEffect(() => {
    setErrors(errorDefault);
    setActiveStep(0);
  }, [type, open]);
  // Custom Validations
  const validate = () => {
    // @ts-ignore-error
    let temp: contactInfoDataType = {
      id: '',
      email: '',
      admins_username: '',
      admins_first_name: '',
      admins_last_name: '',
      name: '',
      role: '',
      created: '',
      mobile: '',
      client_id: '',
      vendor_admin_user_id: '',
      admins_mobile: '',
      admins_email: '',
    };
    console.log(dataOfContactInfo);

    if (activeStep === 0) {
      if (dataOfContactInfo.admins_first_name.length === 0) {
        temp.admins_first_name = 'This Field is required.';
      } else if (!/^[a-zA-Z]*$/.test(dataOfContactInfo.admins_first_name)) {
        temp.admins_first_name = 'Only chracters Are allowed in Text Fields ';
      } else {
        temp.admins_first_name = '';
      }

      if (dataOfContactInfo.admins_last_name.length === 0) {
        temp.admins_last_name = 'This Field is required.';
      } else if (!/^[a-zA-Z]*$/.test(dataOfContactInfo.admins_last_name)) {
        temp.admins_last_name = 'Only chracters Are allowed in Text Fields ';
      } else {
        temp.admins_last_name = '';
      }

      if (
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.com$/.test(
          dataOfContactInfo.admins_email,
        )
      ) {
        temp.admins_email = '';
      } else {
        temp.admins_email = 'Enter a valid email';
      }

      temp.mobile = /^[6789]\d{9}$/.test(dataOfContactInfo.mobile)
        ? ''
        : 'Enter a valid Mobile Number';

      setErrors({ ...temp });
      return Object.values(temp).every((x) => x === '');
    } else if (activeStep === 1) {
      if (dataOfContactInfo.name.length === 0) {
        temp.name = 'This Field is required.';
      } else if (dataOfContactInfo.name.length < 3) {
        temp.name = 'Minimum 3 characters required ';
      } else if (!/^[a-zA-Z]*$/.test(dataOfContactInfo.name)) {
        temp.name = 'Only chracters Are allowed in Text Fields ';
      } else {
        temp.name = '';
      }
      if (dataOfContactInfo.admins_username.length === 0) {
        temp.admins_username = 'This Field is required.';
      } else if (!/^\w*$/.test(dataOfContactInfo.admins_username)) {
        temp.admins_username = 'Speical characters and spaces not allowed';
      } else {
        temp.admins_username = '';
      }
      if (dataOfContactInfo.role.length === 0) {
        temp.role = 'This Field is required.';
      } else {
        temp.role = '';
      }

      setErrors({ ...temp });
      return Object.values(temp).every((x) => x === '');
    }
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='md'
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          {type == 'new' ? 'Add New Vendor' : 'Edit Vendor Details'}
        </DialogTitle>

        <DialogContent dividers className={classes.form}>
          <Paper style={{ margin: 10, padding: 10 }} variant='outlined'>
            <StepperFormAddVendor
              errors={errors}
              setErrors={setErrors}
              validate={validate}
            />
          </Paper>
        </DialogContent>
        {activeStep === 1 && (
          <DialogActions>
            <Button autoFocus color='primary' onClick={callApi}>
              {type === 'new' ? 'Add Vendor' : 'Save changes'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
