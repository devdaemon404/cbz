import {
  Paper,
  Tabs,
  Box,
  Tab,
  Typography,
  makeStyles,
  Theme,
  Container,
} from '@material-ui/core';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import SummaryTab from './SummaryTab';
import ViewProfileTab from './ViewProfileTab';
import WorkOrderTab from './WorkOrderTab';
import { DemandDataType } from '../../../types/project-manager/demand';
import { useRouter } from 'next/router';
import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import OPLoader from 'src/components/common/OPLoader';
import PMInterviewState from '../../../contexts/project-manager/interview/PMInterviewState';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(6),
  },
  margin: {
    // marginTop: theme.spacing(1),
  },
  font: {
    fontWeight: 'bolder',
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const PMSummary = ({ demandData }: { demandData: DemandDataType }) => {
  const router = useRouter();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { getAllProfilesForDemand, isLoading } = useContext(CADemandContext);

  // const getAllProfiles = () => {
  //   const { demandId } = router.query;
  //   getAllProfilesForDemand(demandId as string);
  // };

  // getAllProfiles();

  useEffect(() => {
    console.log('Demand Data: ', demandData);
    const { demandId } = router.query;
    console.log('Demand Id: ; ', demandId);
    const fetchData = async () => {
      await getAllProfilesForDemand(demandId as string);
    };
    fetchData();
  }, []);

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
    <div className={classes.root}>
      <OPLoader isLoading={isLoading} />
      <Container maxWidth='xl'>
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
            <Tab className={classes.font} label='Summary' {...a11yProps(0)} />
            {/* <Tab
              className={classes.font}
              label='View Profiles'
              {...a11yProps(1)}
            /> */}
            {/* <Tab
              className={classes.font}
              label='Work Order'
              {...a11yProps(2)}
            /> */}
          </Tabs>

          <TabPanel value={value} index={0}>
            <SummaryTab
              changeValue={() => setValue(1)}
              demandData={demandData}
            />
          </TabPanel>

          {/* <TabPanel value={value} index={1}>
            <PMInterviewState>
              <ViewProfileTab demandData={demandData} />
            </PMInterviewState>
          </TabPanel> */}

          {/* <TabPanel value={value} index={2}>
            <PMInterviewState>
              <WorkOrderTab />
            </PMInterviewState>
          </TabPanel> */}
        </Paper>
      </Container>
    </div>
  );
};

export default PMSummary;
