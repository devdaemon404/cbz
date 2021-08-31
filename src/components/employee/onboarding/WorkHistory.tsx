import React, { ChangeEvent, Fragment, useContext, useState } from 'react';
import {
  Tabs,
  Box,
  Tab,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Grid,
  Divider,
  Button,
} from '@material-ui/core';

import { Add as AddIcon } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';

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
}));

const WorkHistory = () => {
  const {
    skills,
    workHistory,
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
      <Tabs
        value={value}
        onChange={handleTabChange}
        scrollButtons='auto'
        aria-label='simple tabs example'
        indicatorColor='primary'
        textColor='primary'
        variant='fullWidth'
        centered>
        <Tab className={classes.font} label='Work History' {...a11yProps(0)} />
        <Tab className={classes.font} label='Skills' {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        {workHistory.map((data, index) => {
          const {
            companyName,
            jobTitle,
            startDate,
            endDate,
            responsibilities,
          } = data;

          return (
            <Fragment>
              {/* This ensures that divider and delete doesn't appear on first iteration */}
              {index === 0 ? (
                <div></div>
              ) : (
                <Fragment>
                  <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    className={classes.margin}>
                    <Grid item xs={10}>
                      <Divider className={classes.dividerColor} />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'>
                    <Grid
                      container
                      item
                      lg={10}
                      direction='row'
                      justify='flex-end'>
                      <Grid item>
                        <Button
                          startIcon={<CloseIcon />}
                          color='primary'
                          onClick={(e) => deleteWork(e, index)}>
                          DELETE
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Fragment>
              )}

              <Grid
                // className={classes.margin}
                container
                direction='row'
                justify='center'
                alignItems='center'
                spacing={2}>
                <Grid item xs={5}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>Previous Company Name</FormLabel>
                    <TextField
                      className={classes.margin}
                      value={companyName || ''}
                      placeholder='Future World'
                      onChange={(e) =>
                        handleWorkHistoryOnChange(e, 'companyName', index)
                      }
                      variant='outlined'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>Job Title</FormLabel>
                    <TextField
                      className={classes.margin}
                      value={jobTitle || ''}
                      placeholder='Software Engineer'
                      onChange={(e) =>
                        handleWorkHistoryOnChange(e, 'jobTitle', index)
                      }
                      variant='outlined'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>Start Date</FormLabel>
                    <TextField
                      className={classes.margin}
                      type='date'
                      value={startDate || ''}
                      onChange={(e) =>
                        handleWorkHistoryOnChange(e, 'startDate', index)
                      }
                      variant='outlined'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>End Date</FormLabel>
                    <TextField
                      className={classes.margin}
                      type='date'
                      value={endDate || ''}
                      onChange={(e) =>
                        handleWorkHistoryOnChange(e, 'endDate', index)
                      }
                      variant='outlined'
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={10}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>Responsibilities</FormLabel>
                    <TextField
                      className={classes.margin}
                      rows={3}
                      value={responsibilities || ''}
                      multiline={true}
                      onChange={(e) =>
                        handleWorkHistoryOnChange(e, 'responsibilities', index)
                      }
                      placeholder='Enter the responsibilities you had...'
                      variant='outlined'
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Fragment>
          );
        })}
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          className={classes.margin}>
          <Grid item xs={10}>
            <Divider className={classes.dividerColor} />
          </Grid>
        </Grid>

        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid container item lg={10} direction='row' justify='flex-end'>
            <Grid item>
              <Button
                startIcon={<AddIcon />}
                color='primary'
                onClick={addNewWork}>
                ADD NEW
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
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
                newChipKeys={[',', '/']}
                variant='outlined'
                placeholder='Enter the skills you are Expert at...'
                value={skills.expert}
                onChange={(chips) => handleSkillsOnChange(chips, 2)}
                onDelete={(chip, index) =>
                  handleSkillsOnChange(
                    skills.expert.filter((_, i) => i !== index),
                    2,
                  )
                }
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
                newChipKeys={[',', '/']}
                placeholder='Enter the skills you are Intermediate at...'
                variant='outlined'
                value={skills.intermediate}
                onChange={(chips) => handleSkillsOnChange(chips, 1)}
                onDelete={(chip, index) =>
                  handleSkillsOnChange(
                    skills.intermediate.filter((_, i) => i !== index),
                    1,
                  )
                }
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
                newChipKeys={[',', '/']}
                variant='outlined'
                placeholder='Enter the skills you are Beginner at...'
                value={skills.beginner}
                onChange={(chips) => handleSkillsOnChange(chips, 0)}
                onDelete={(chip, index) =>
                  handleSkillsOnChange(
                    skills.beginner.filter((_, i) => i !== index),
                    0,
                  )
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
};

export default WorkHistory;
