import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';
import { OPToast, ToastVariant } from 'src/utils/op-toast';

export default function AmendReason() {
  const { handleSaveOrApprove } = useContext(MGRTimesheetContext);
  const [open, setOpen] = useState(false);
  const [amendReason, setAmendReason] = useState<string>();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // console.log('AMEND REASON', amendReason);

  // const handleAmend = () => {};

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Amend
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'>
        <DialogContent>
          <DialogContentText>
            To Amend to this timesheet, please enter your reason here.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={3}
            variant='outlined'
            margin='dense'
            label='Amend Reason'
            type='text'
            color='primary'
            onChange={(e) => setAmendReason(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='text'
            size='small'
            onClick={handleClose}
            color='primary'>
            Cancel
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={() => {
              if (amendReason === undefined || '') {
                OPToast.show('Please give a reason to amend', {
                  variant: ToastVariant.ERROR,
                });
              } else {
                handleSaveOrApprove('REJECTED', 'amd', amendReason);
              }
              handleClose();
            }}
            color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
