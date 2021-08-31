import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField, Typography } from '@material-ui/core';

const ScreeningRejectModal = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>
          Do you want to change the Status?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Typography variant='body1' color='primary'>
              Notes:
            </Typography>
            <TextField
              id='outlined-multiline-static'
              multiline
              fullWidth
              rows={4}
              placeholder='Notes'
              variant='outlined'
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary'>
            Confirm
          </Button>
          <Button onClick={handleClose} color='primary' autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ScreeningRejectModal;
