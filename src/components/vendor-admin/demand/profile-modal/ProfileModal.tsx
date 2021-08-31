import {
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React, { useContext } from 'react';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import ProfileModalContent from './ProfileModalContent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }),
);

const ProfileModal = () => {
  const classes = useStyles();

  const { openModal, modalMode, handleModal } = useContext(VADemandContext);

  return (
    <Dialog
      onClose={() => handleModal(false)}
      aria-labelledby='customized-dialog-title'
      open={openModal}
      maxWidth='md'
      fullWidth>
      <DialogTitle>
        <Typography variant='h6'>{modalMode}</Typography>
        <IconButton
          aria-label='delete'
          className={classes.closeButton}
          size='small'
          onClick={() => handleModal(false)}>
          <CloseIcon fontSize='inherit' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ProfileModalContent />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
