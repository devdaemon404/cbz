import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Paper } from '@material-ui/core';
import CreateWorkOrder from './CreateWorkOrder';
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  hoverUnderline: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: 9999,
  },
  font: {
    fontWeight: 'bold',
  },
  margin: {
    margin: theme.spacing(2, 0),
  },
  tableRowHover: {
    '&:hover': {
      // backgroundImage:
      //   'linear-gradient(to right top, #ffffff, #f9f9fc, #f2f4f9, #eaf0f6, #e1ebf2);',
      backgroundColor: '#f5f5f5',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paperPadding: {
    padding: theme.spacing(2),
  },
  tabpanel: {
    height: '650px',
  },
}));

export default function CreateWorkOrderTab({
  openCreatePage,
  setOpenCreatePage,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <Paper variant='outlined' className={classes.paperPadding}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          aria-label='full width tabs example'>
          <Tab
            style={{ fontWeight: 'bold' }}
            label='Position & Resource Details'
            {...a11yProps(0)}
          />
          <Tab
            style={{ fontWeight: 'bold' }}
            label='work order summary'
            {...a11yProps(1)}
          />
        </Tabs>

        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}>
          <TabPanel
            value={value}
            index={0}
            dir={theme.direction}
            // @ts-ignore
            className={classes.tabpanel}>
            <CreateWorkOrder
              openCreatePage={openCreatePage}
              setOpenCreatePage={setOpenCreatePage}
            />
          </TabPanel>
          <TabPanel
            value={value}
            index={1}
            dir={theme.direction}
            // @ts-ignore
            className={classes.tabpanel}>
            Item Two
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </div>
  );
}
