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
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';
import VAManageUserContext from 'src/contexts/vendor-admin/manage-user/va-mu-context';
import ModalTable from './ModalTable';

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

const Modal = () => {
  const classes = useStyles();

  const { openModal, setOpenModal } = useContext(CAWorkorderContext);

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
      onClose={() => setOpenModal(false)}
      aria-labelledby='customized-dialog-title'
      open={openModal}
      maxWidth='md'
      fullWidth>
      <DialogTitle>
        <Typography variant='h6'>Select a Candidate</Typography>
        <IconButton
          aria-label='delete'
          className={classes.closeButton}
          size='small'
          onClick={() => setOpenModal(false)}>
          <CloseIcon fontSize='inherit' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ModalTable />
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
