import React, {
  Fragment,
  useState,
  ChangeEvent,
  useEffect,
  useContext,
} from 'react';
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
} from '@material-ui/core';
import OPLoader from '../../common/OPLoader';
import PMBaseLayout from '../PMBaseLayout';
import PositionResource from './PositionResource';
import Alert from '@material-ui/lab/Alert';
import ClientOrganization from './ClientOrganization';
import VendorOrganization from './VendorOrganization';
import WorkOrderSummary from './WorkOrderSummary';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';
import { PMWorkOrderApiService } from 'src/apis/project-manager/pm-workorder-api-service';
import { OPHttpClient } from 'src/utils/op-http-client';
import MGRWorkorderContext from 'src/contexts/project-manager/workorder/mgr-workorder-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    font: {
      fontWeight: 'bold',
    },
    headerMargin: {
      margin: theme.spacing(3, 0, 0, 3),
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    paperPadding: {
      padding: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
    alertPadding: {
      margin: theme.spacing(3, 3, 0, 3),
    },
    buttonPadding: {
      margin: theme.spacing(-3, 3, 3, 3),
    },
  }),
);

const WorkOrderTabs = ({ workorderId }: { workorderId: string }) => {
  const classes = useStyles();

  const { isLoading, currentWorkorder } = useContext(MGRWorkorderContext);
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
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

  const getSteps = () => {
    return [
      // 'Position & Resource Deatils',
      // 'Client Organization Details',
      // 'Vendor Organization Details',
      'Work Order Summary',
    ];
  };

  const steps = getSteps();

  const handleNext = () => {
    setTabValue((prevActiveValue) => prevActiveValue + 1);
  };

  const handleBack = () => {
    setTabValue((prevActiveValue) => prevActiveValue - 1);
  };

  const handleReset = () => {
    setTabValue(0);
  };

  return (
    <Fragment>
      <OPLoader isLoading={isLoading} />
      <Paper>
        <Grid container spacing={1} direction='column'>
          <Grid item className={classes.headerMargin}>
            <Typography variant='h6' color='initial' className={classes.font}>
              Work Order - {currentWorkorder?.data?.requestedResource} (
              {currentWorkorder?.data?.id})
            </Typography>
          </Grid>
          <Grid item>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              scrollButtons='auto'
              aria-label='simple tabs example'
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
              centered>
              {steps.map((label, index) => (
                <Tab
                  className={classes.font}
                  label={label}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
            <Alert severity='success' className={classes.alertPadding}>
              This workorder was Apporved
            </Alert>
            {currentWorkorder && (
              <>
                {/* <TabPanel value={tabValue} index={0}>
                  <PositionResource
                    workorder={currentWorkorder}
                    version={false}
                  />
                </TabPanel> */}
                {/* <TabPanel value={tabValue} index={1}>
                  <ClientOrganization workorder={currentWorkorder} />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <VendorOrganization workorder={currentWorkorder} />
                </TabPanel> */}
                <TabPanel value={tabValue} index={0}>
                  <WorkOrderSummary workorder={currentWorkorder} />
                </TabPanel>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* {tabValue < steps.length - 1 && (
        <Paper className={classes.paperPadding}>
          <div>
            <div>
              <Button
                disabled={tabValue === 0}
                onClick={handleBack}
                className={classes.backButton}>
                Back
              </Button>
              <Button variant='contained' color='primary' onClick={handleNext}>
                {tabValue === steps.length - 2 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </Paper>
      )} */}
    </Fragment>
  );
};

export default WorkOrderTabs;
