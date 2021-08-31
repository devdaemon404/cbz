import React from 'react';
import {
  Grid,
  Typography,
  Dialog,
  IconButton,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
} from '@material-ui/core';
import 'moment-timezone';
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
import InterviewNewRound from './InterviewNewRound';

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

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const InterviewNewRoundModal = ({
  // profileStatus,
  slotRejectionRaised,
  status,
  isOpen,
  onClose,
}: {
  // profileStatus: string;
  slotRejectionRaised: boolean;
  status: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleInterviewNewRoundModalClose = () => {
    onClose();
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Dialog
        onClose={handleInterviewNewRoundModalClose}
        aria-labelledby='customized-dialog-title'
        fullWidth
        maxWidth='md'
        open={isOpen}>
        <DialogTitle
          id='customized-dialog-title'
          onClose={handleInterviewNewRoundModalClose}>
          {slotRejectionRaised ? (
            <>
              <b>Reschedule Round</b>
              <i>(Vendor Admin rejected previous slot)</i>
            </>
          ) : status === 'RE_SCHEDULED' ? (
            <b>Reschedule Round</b>
          ) : (
            <b>Next Round</b>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1} direction='column'>
            <InterviewNewRound
              slotRejectionRaised={slotRejectionRaised}
              // profileStatus={profileStatus}
              status={status}
              closeNewRoundModal={handleInterviewNewRoundModalClose}
            />
          </Grid>
        </DialogContent>
      </Dialog>
    </MuiPickersUtilsProvider>
  );
};

export default InterviewNewRoundModal;
