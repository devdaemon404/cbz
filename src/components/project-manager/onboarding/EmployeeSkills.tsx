import React, { ChangeEvent, useContext, useState } from 'react';
import {
  Tabs,
  Box,
  Tab,
  Typography,
  FormControl,
  FormLabel,
  Grid,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import ChipInput from 'material-ui-chip-input';
import OnboardingContext from '../../../contexts/employee/onboardingContext';

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
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  fixTopPadding: {
    paddingTop: '0 !important',
  },
  fixPadding: {
    padding: '0 !important',
  },
  fixMargin: {
    margin: '0 8px 0 0 !important',
  },
}));

const EmployeeSkills = () => {
  const {
    skills,
    workHistory,
    handleDateChange,
    handleWorkHistoryOnChange,
    addNewWork,
    deleteWork,
    handleSkillsOnChange,
  } = useContext(OnboardingContext);

  const [value, setValue] = useState(0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          scrollButtons='auto'
          aria-label='simple tabs example'
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          centered>
          <Tab className={classes.font} label='Skills' {...a11yProps(0)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='center'
            spacing={1}>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <FormLabel>Expert</FormLabel>
                <ChipInput
                  style={{
                    marginTop: 10,
                  }}
                  classes={{
                    inputRoot: classes.fixTopPadding,
                    input: classes.fixPadding,
                    chip: classes.fixMargin,
                  }}
                  defaultValue={skills.expert.length > 0 ? skills.expert : []}
                  size='small'
                  newChipKeys={[',', '/']}
                  variant='outlined'
                  placeholder='Enter the skills you are Expert at...'
                  // value={skills.expert}
                  onChange={(chips) => handleSkillsOnChange(chips, 2)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <FormLabel className={classes.margin}>Intermediate</FormLabel>
                <ChipInput
                  style={{
                    marginTop: 10,
                  }}
                  classes={{
                    inputRoot: classes.fixTopPadding,
                    input: classes.fixPadding,
                    chip: classes.fixMargin,
                  }}
                  size='small'
                  newChipKeys={[',', '/']}
                  placeholder='Enter the skills you are Intermediate at...'
                  variant='outlined'
                  defaultValue={
                    skills.intermediate.length > 0 ? skills.intermediate : []
                  }
                  // value={skills.intermediate}
                  onChange={(chips) => handleSkillsOnChange(chips, 1)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={10}>
              <FormControl fullWidth variant={'outlined'}>
                <FormLabel className={classes.margin}>Beginner</FormLabel>
                <ChipInput
                  style={{
                    marginTop: 10,
                  }}
                  classes={{
                    inputRoot: classes.fixTopPadding,
                    input: classes.fixPadding,
                    chip: classes.fixMargin,
                  }}
                  size='small'
                  newChipKeys={[',', '/']}
                  variant='outlined'
                  placeholder='Enter the skills you are Beginner at...'
                  defaultValue={
                    skills.beginner.length > 0 ? skills.beginner : []
                  }
                  // value={skills.beginner}
                  onChange={(chips) => handleSkillsOnChange(chips, 0)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default EmployeeSkills;
