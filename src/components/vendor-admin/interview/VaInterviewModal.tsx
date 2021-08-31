import React, { useState, useContext } from 'react';
import {
  Dialog,
  IconButton,
  Typography,
  DialogTitle as MuiDialogTitle,
} from '@material-ui/core';
import {
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import InterviewModalContent from './VaInterviewModalContent';

const useStyles = makeStyles((theme: Theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  const cls = useStyles();
  return (
    <MuiDialogTitle disableTypography {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={cls.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const InterviewModal = ({
  // profileIndex,
  role,
  isOpen,
  onClose,
}: {
  // profileIndex: number;
  role: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Handling Interview Dailog close
  const handleInterviewDialogClose = () => {
    onClose();
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Dialog
        onClose={handleInterviewDialogClose}
        aria-labelledby='customized-dialog-title'
        fullWidth
        maxWidth='md'
        open={isOpen}>
        <DialogTitle
          id='customized-dialog-title'
          onClose={handleInterviewDialogClose}>
          {role === 'VENDOR_ADMIN' ? (
            <b>Freeze a Slot</b>
          ) : (
            <b>Interview Rounds</b>
          )}
        </DialogTitle>
        <InterviewModalContent
          // profileIndex={profileIndex}
          role={role}
          closeInterviewModal={handleInterviewDialogClose}
        />
      </Dialog>
    </MuiPickersUtilsProvider>
  );
};

export default InterviewModal;
