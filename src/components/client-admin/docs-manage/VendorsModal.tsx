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
import CAComplianceContext from 'src/contexts/client-admin/compliance/ca-cc-context';
import VendorsModalTable from './VendorsModalTable';

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

const VendorsModal = () => {
  const classes = useStyles();

  const { modalOpen, setModalOpen } = useContext(CAComplianceContext);

  return (
    <Dialog
      onClose={() => setModalOpen(false)}
      aria-labelledby='customized-dialog-title'
      open={modalOpen}
      maxWidth='md'
      fullWidth>
      <DialogTitle>
        <Typography variant='h6'>Compliance Check</Typography>
        <IconButton
          aria-label='delete'
          className={classes.closeButton}
          size='small'
          onClick={() => setModalOpen(false)}>
          <CloseIcon fontSize='inherit' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <VendorsModalTable />
      </DialogContent>
    </Dialog>
  );
};

export default VendorsModal;
