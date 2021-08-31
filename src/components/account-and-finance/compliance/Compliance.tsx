import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';
import { Grid, makeStyles, Paper, Theme } from '@material-ui/core';

import ComplianceTable from './ComplianceTable';
import ComplianceForm from './ComplianceForm';
import AFBaseLayout from '../AFBaseLayout';

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
    <AFBaseLayout userName={userName} sidebarIndex={4}>
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
    </AFBaseLayout>
  );
};

export default Compliance;
