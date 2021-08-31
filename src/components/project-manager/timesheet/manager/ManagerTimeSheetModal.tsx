import React, { useContext, useState } from 'react';
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
import TaskModal from './TaskModal';
import OPAreYouSure from 'src/components/common/OPAreYouSure';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';
import { addTaskDefaultData } from 'src/types/project-manager/timesheet';

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
    <MuiDialogTitle
      disableTypography
      {...other}
      style={{ paddingLeft: 16, paddingBottom: 0 }}>
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
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Handling Interview Dailog close
  const [areYouSureOpen, setAreYouSureOpen] = useState<boolean>(false);

  const { setTaskState } = useContext(MGRTimesheetContext);

  const handleManagerTaskModalClose = () => {
    // TODO: clear new task fields
    setTaskState([addTaskDefaultData]);
    onClose();
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Dialog
        onClose={() => setAreYouSureOpen(true)}
        aria-labelledby='customized-dialog-title'
        fullWidth
        maxWidth='md'
        open={isOpen}>
        <DialogTitle
          id='customized-dialog-title'
          onClose={() => setAreYouSureOpen(true)}>
          <b>Add/View Task</b>
        </DialogTitle>
        <TaskModal closeManagerTaskModal={handleManagerTaskModalClose} />
      </Dialog>

      <OPAreYouSure
        title='Are You Sure?'
        isOpen={areYouSureOpen}
        closeAreYouSure={() => setAreYouSureOpen(false)}
        functionToCall={handleManagerTaskModalClose}>
        You want to Close the Task Modal?
      </OPAreYouSure>
    </MuiPickersUtilsProvider>
  );
};

export default TimeSheetModal;
