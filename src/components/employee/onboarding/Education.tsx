import {
  Tabs,
  Box,
  Tab,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Grid,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { ChangeEvent, ReactNode, useState } from 'react';

interface TabPanelProps {
  children?: ReactNode;
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
        <Box>
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  font: {
    fontWeight: 'bolder',
  },
}));

const Education = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        scrollButtons='auto'
        aria-label='simple tabs example'
        indicatorColor='primary'
        textColor='primary'
        variant='fullWidth'
        centered>
        <Tab className={classes.font} label='Education' {...a11yProps(0)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Grid
          container
          className={classes.margin}
          direction='row'
          justify='center'
          alignItems='center'
          spacing={1}>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth variant='outlined'>
              <FormLabel>School or College</FormLabel>
              <TextField
                className={classes.margin}
                id='outlined-basic'
                placeholder='ABC public school or college'
                variant='outlined'
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.margin}
          direction='row'
          justify='center'
          alignItems='center'
          spacing={1}>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth variant='outlined'>
              <FormLabel>Degree</FormLabel>
              <TextField
                className={classes.margin}
                id='outlined-basic'
                placeholder='BE in Computer Science'
                variant='outlined'
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.margin}
          direction='row'
          justify='center'
          alignItems='center'
          spacing={1}>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth variant='outlined'>
              <FormLabel>Feild of Study</FormLabel>
              <TextField
                className={classes.margin}
                id='outlined-basic'
                variant='outlined'
              />
            </FormControl>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
};

export default Education;
