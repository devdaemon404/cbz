import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import VABaseLayout from '../VABaseLayout';
import { Grid, makeStyles, Paper, Theme, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import VAManageUserContext from 'src/contexts/vendor-admin/manage-user/va-mu-context';
import ManageUserTable from './ManageUserTable';
import ManageUserModal from './ManageUserModal';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    height: '80vh',
  },
  buttonBorder: {
    borderRadius: '40px',
    marginBottom: theme.spacing(2),
  },
}));

const ManageUser = ({ userName, id }) => {
  const classes = useStyles();
  const { isLoading, handleModal } = useContext(VAManageUserContext);

  return (
    <VABaseLayout userName={userName} sidebarIndex={1}>
      <Fragment>
        <OPLoader isLoading={isLoading} />
        <Button
          variant='contained'
          color='secondary'
          startIcon={<AddIcon />}
          onClick={() => handleModal(true, 'Create User')}
          disableFocusRipple
          className={classes.buttonBorder}>
          NEW USER
        </Button>
        <ManageUserTable userId={id} />

        <ManageUserModal />
      </Fragment>
    </VABaseLayout>
  );
};

export default ManageUser;
