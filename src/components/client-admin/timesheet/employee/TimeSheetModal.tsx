import React from 'react';
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
import TimeSheetModalContent from './TimeSheetModalContent';
import { EmployeeType } from 'src/types/project-manager/timesheet';

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

const TimeSheetModal = ({
  isOpen,
  onClose,
  userData,
}: {
  isOpen: boolean;
  onClose: () => void;
  userData: EmployeeType;
}) => {
  // Handling Interview Dailog close
  const handleTimeSheetModalClose = () => {
    onClose();
  };

  // console.log(userData);

  const { user, employee_id } = userData;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Dialog
        onClose={handleTimeSheetModalClose}
        aria-labelledby='customized-dialog-title'
        fullWidth
        maxWidth='md'
        open={isOpen}>
        <DialogTitle
          id='customized-dialog-title'
          onClose={handleTimeSheetModalClose}>
          <b>
            Timesheet - {user?.username} ({employee_id})
          </b>
        </DialogTitle>
        <TimeSheetModalContent
          closeTimeSheetModal={handleTimeSheetModalClose}
        />
      </Dialog>
    </MuiPickersUtilsProvider>
  );
};

export default TimeSheetModal;
