import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

const OPAreYouSure = ({
  isOpen,
  functionToCall,
  title,
  closeAreYouSure,
  children,
}: {
  title?: string;
  isOpen: boolean;
  functionToCall: () => void;
  closeAreYouSure: () => void;
  children?: any;
}) => {
  const handleCloseWithAction = () => {
    functionToCall();
    closeAreYouSure();
  };

  const handleClose = () => {
    closeAreYouSure();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>
          {title || 'Are You Sure?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{children}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            No
          </Button>
          <Button onClick={handleCloseWithAction} color='primary'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OPAreYouSure;
