import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import VABaseLayout from '../VABaseLayout';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';
import { Grid, makeStyles, Paper, Theme } from '@material-ui/core';

import ComplianceTable from './ComplianceTable';
import ComplianceForm from './ComplianceForm';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    height: '80vh',
  },
}));

const Compliance = ({ userName, id, index }) => {
  const classes = useStyles();
  const { isLoading } = useContext(VATimesheetContext);

  return (
    <VABaseLayout userName={userName} sidebarIndex={index ? index : 5}>
      <Fragment>
        <OPLoader isLoading={isLoading} />
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='stretch'
          spacing={2}>
          <Grid item xs={4}>
            <ComplianceForm />
          </Grid>
          <Grid item xs={8}>
            <ComplianceTable />
          </Grid>
        </Grid>
      </Fragment>
    </VABaseLayout>
  );
};

export default Compliance;
