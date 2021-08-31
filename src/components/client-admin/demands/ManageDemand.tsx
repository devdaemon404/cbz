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

import PMTable from 'src/components/client-admin/demands/PMTable';
import { Add as AddIcon } from '@material-ui/icons';
import CADemandContext, {
  CADemandContextDefault,
} from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import PMDemandModal from './PMDemandModel';
import OPLoader from 'src/components/common/OPLoader';
import CABaseLayout from '../CABaseLayout';

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
  PENDING_FOR_APPROVAL,
  CREATED_DEMANDS,
}

const ManageDemandPage = ({ userName, projectId }) => {
  const [tableViewState, setTableViewState] = useState<TableViewStates>(
    TableViewStates.PENDING_FOR_APPROVAL,
  );

  const [createDemandModalOpened, setCreateDemandModalOpened] = useState(false);

  const {
    handleDemandFormSubmission,
    editDemandOnSubmit,
    getDemandsForProject,
    editDemandModalOpened,
    setEditDemandModalOpened,
    isLoading,
    setDemandInfo,
    setInitialModalValues,
    setEditMode,
  } = useContext(CADemandContext);
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

  useEffect(() => {
    console.log('Use Effect Called Manage Demand: ');
    getDemandsForProject();
  }, []);

  return (
    <CABaseLayout sidebarIndex={3} userName={userName}>
      <Fragment>
        <OPLoader isLoading={isLoading} />

        {!createDemandModalOpened && !editDemandModalOpened && (
          <>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<AddIcon />}
              onClick={async () => {
                await setEditMode(false);
                // await setDemandInfo(CADemandContextDefault.demandInfo);
                await setInitialModalValues(
                  CADemandContextDefault.initialModalValues,
                );
                await setCreateDemandModalOpened(true);
              }}
              disableFocusRipple
              className={classes.buttonBorder}>
              NEW DEMAND
            </Button>
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
                  label='Created Demands'
                  {...a11yProps(1)}
                />
                <Tab
                  className={classes.font}
                  label='Pending for Approval'
                  {...a11yProps(0)}
                />
              </Tabs>

              <TabPanel value={value} index={1}>
                <PMTable
                  openEditDemandModal={() => {
                    setEditDemandModalOpened(true);
                  }}
                  tableViewState={TableViewStates.PENDING_FOR_APPROVAL}
                  projectId={projectId}
                />
              </TabPanel>

              <TabPanel value={value} index={0}>
                <PMTable
                  openEditDemandModal={() => {
                    setEditDemandModalOpened(true);
                  }}
                  tableViewState={TableViewStates.CREATED_DEMANDS}
                  projectId={projectId}
                />
              </TabPanel>
            </Paper>
          </>
        )}

        <>
          {createDemandModalOpened && (
            <PMDemandModal
              isOpen={createDemandModalOpened}
              title={'Create Demand'}
              onSubmit={handleDemandFormSubmission}
              onClose={() => {
                setCreateDemandModalOpened(false);
              }}
            />
          )}
          {editDemandModalOpened && (
            <PMDemandModal
              isOpen={editDemandModalOpened}
              title={'Edit Demand'}
              onSubmit={editDemandOnSubmit}
              onClose={() => {
                setEditDemandModalOpened(false);
              }}
            />
          )}
        </>
      </Fragment>
    </CABaseLayout>
  );
};

export default ManageDemandPage;
