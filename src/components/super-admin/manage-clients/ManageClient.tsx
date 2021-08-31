import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import SABaseLayout from '../SABaseLayout';
import {
  Grid,
  makeStyles,
  Paper,
  Theme,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import SAManageClientContext from 'src/contexts/super-admin/manage-clients/sa-mc-context';
import ManageClientTable from './ManageClientTable';
import ManageClientModal from './ManageClientModal';

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

const ManageClient = ({ userName, id }) => {
  const classes = useStyles();
  const { isLoading, handleModal, showAll, handleShowAllChange } = useContext(
    SAManageClientContext,
  );

  return (
    <SABaseLayout userName={userName} sidebarIndex={1}>
      <Fragment>
        <OPLoader isLoading={isLoading} />
        <Button
          variant='contained'
          color='secondary'
          startIcon={<AddIcon />}
          onClick={() => handleModal(true, 'Create Client')}
          disableFocusRipple
          className={classes.buttonBorder}>
          New Client
        </Button>
        <TextField
          select
          variant='outlined'
          size='small'
          value={showAll}
          onChange={handleShowAllChange}
          style={{ float: 'right' }}>
          <MenuItem value={'true'}>Show All</MenuItem>
          <MenuItem value={'false'}>Active</MenuItem>
        </TextField>
        <ManageClientTable userId={id} />
        <ManageClientModal />
      </Fragment>
    </SABaseLayout>
  );
};

export default ManageClient;
