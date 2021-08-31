import React, { ChangeEvent, Fragment, useContext, useState } from 'react';
import OPLoader from '../../common/OPLoader';
import {
  Box,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Theme,
  Typography,
} from '@material-ui/core';

import CABaseLayout from '../CABaseLayout';
import CAComplianceContext from 'src/contexts/client-admin/compliance/ca-cc-context';
import Compliance from './Compliance';
import Vendors from './Vendors';
import AddDocument from './AddDocument';

const useStyles = makeStyles((theme: Theme) => ({
  font: {
    fontWeight: 'bolder',
  },
}));

const DocsManage = ({ userName, id, index, role }) => {
  const classes = useStyles();
  const { isLoading } = useContext(CAComplianceContext);

  const [value, setValue] = useState(0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}>
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <CABaseLayout userName={userName} sidebarIndex={5} role={role}>
      <Fragment>
        <OPLoader isLoading={isLoading} />
        <Paper elevation={2}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            scrollButtons='auto'
            aria-label='simple tabs example'
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            centered>
            <Tab
              className={classes.font}
              label='Compliance'
              {...a11yProps(1)}
            />
            <Tab className={classes.font} label='Vendors' {...a11yProps(0)} />
          </Tabs>
          <TabPanel value={value} index={1}>
            <Vendors />
          </TabPanel>
          <TabPanel value={value} index={0}>
            <Grid container spacing={2} alignItems='stretch'>
              <Grid item xs={3}>
                <AddDocument />
              </Grid>
              <Grid item xs={9}>
                <Compliance />
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Fragment>
    </CABaseLayout>
  );
};

export default DocsManage;
