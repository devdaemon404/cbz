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
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';
import { Form, Formik } from 'formik';
import CreateTab from './CreateTab';
import SummaryTab from './SummaryTab';
import OPLoader from 'src/components/common/OPLoader';
import formInitialValues from './FormModel/formInitialValues';
import validationSchema from './FormModel/validationSchema';
import { updateWorkOrderStatus } from 'server/controllers/workOrder';

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
  }),
);

const CreateTabs = () => {
  const classes = useStyles();

  const {
    isLoading,
    setCreatePageShow,
    setCurrentWorkorderId,
    initialWorkorderFormValues,
    createWorkorder,
    updateWorkorder,
    editMode,
  } = useContext(CAWorkorderContext);

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
    return ['Position & Resource details', 'Workorder Summary'];
  };

  const steps = getSteps();

  const handleNext = () => {};

  const handleBack = () => {
    setTabValue((prevActiveValue) => prevActiveValue - 1);
  };

  const handleReset = () => {
    setTabValue(0);
  };

  const submitWorkorder = async (values) => {
    if (editMode) {
      await updateWorkorder(values);
    } else {
      await createWorkorder(values);
    }
    await setCreatePageShow(false);
    await setCurrentWorkorderId('');
  };

  const handleSubmit = (values, actions) => {
    if (tabValue < steps.length - 1) {
      setTabValue((prevActiveValue) => prevActiveValue + 1);
    } else if (tabValue === steps.length - 1) {
      submitWorkorder(values);
    }
  };

  return (
    <Fragment>
      <OPLoader isLoading={isLoading} />
      <Formik
        initialValues={initialWorkorderFormValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <Form>
          <Paper>
            <Grid container spacing={1} direction='column'>
              {/* <Grid item className={classes.headerMargin}>
                <Typography
                  variant='h6'
                  color='initial'
                  className={classes.font}>
                  Work Order
                </Typography>
              </Grid> */}
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
                      disabled={index === 1 ? true : false}
                    />
                  ))}
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                  <CreateTab />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <SummaryTab />
                </TabPanel>
              </Grid>
            </Grid>
          </Paper>

          {tabValue < steps.length && (
            <Paper className={classes.paperPadding}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      setCreatePageShow(false);
                      setCurrentWorkorderId('');
                    }}>
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    disabled={tabValue === 0}
                    onClick={handleBack}
                    className={classes.backButton}>
                    Back
                  </Button>
                  <Button variant='contained' color='primary' type='submit'>
                    {tabValue === steps.length - 1
                      ? editMode
                        ? 'Update Workorder'
                        : 'Create Workorder'
                      : 'Next'}
                  </Button>
                </div>
              </div>
            </Paper>
          )}
        </Form>
      </Formik>
    </Fragment>
  );
};

export default CreateTabs;
