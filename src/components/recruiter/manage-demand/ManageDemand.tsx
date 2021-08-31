import {
  Button,
  createStyles,
  makeStyles,
  Tabs,
  Box,
  Typography,
  Paper,
  Tab,
  Theme,
} from '@material-ui/core';
import React, {
  ChangeEvent,
  useState,
  Fragment,
  useContext,
  useEffect,
} from 'react';
import PMBaseLayout from 'src/components/project-manager/PMBaseLayout';
import PMTable from 'src/components/recruiter/manage-demand/PMTable';
import { Add as AddIcon } from '@material-ui/icons';
import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
import OPLoader from '../../common/OPLoader';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import RecruiterBaseLayout from '../RecruiterBaseLayout';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonBorder: {
      borderRadius: '40px',
      marginBottom: theme.spacing(2),
    },
    font: {
      fontWeight: 'bolder',
    },
  }),
);

export enum TableViewStates {
  OPEN_DEMANDS,
  CLOSED_DEMANDS,
}

const ManageDemandPage = ({ userName }) => {
  const [tableViewState, setTableViewState] = useState<TableViewStates>(
    TableViewStates.OPEN_DEMANDS,
  );

  const { demands, isLoading } = useContext(VADemandContext);
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handlePendingChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setTableViewState(event.target.value as TableViewStates);
  };

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
    <RecruiterBaseLayout sidebarIndex={1} userName={userName}>
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
              label='Open Demands'
              {...a11yProps(0)}
            />
            <Tab
              className={classes.font}
              label='Close Demands'
              {...a11yProps(1)}
            />
          </Tabs>

          <TabPanel value={value} index={0}>
            <PMTable tableViewState={TableViewStates.OPEN_DEMANDS} />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <PMTable tableViewState={TableViewStates.CLOSED_DEMANDS} />
          </TabPanel>
        </Paper>
      </Fragment>
    </RecruiterBaseLayout>
  );
};

export default ManageDemandPage;
