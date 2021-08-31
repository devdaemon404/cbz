import React, {
  ChangeEvent,
  Fragment,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Grid,
  Select,
  MenuItem,
  Divider,
  Button,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';
import OnboardingContext from '../../../contexts/employee/onboardingContext';

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

const AcademicInformation = () => {
  // Tab value
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    academicInfo,
    addNewAcadInfo,
    deleteAcadInfo,
    handleAcadInfoOnChange,
  } = useContext(OnboardingContext);

  const qualificationOptions = [
    '10th',
    '12th',
    'Undergraduate',
    'Postgraduate',
    'Diploma',
  ];

  // Input select option that is selected.
  // const [qualification, setQualification] = useState('');

  // Handling click on Input select
  // const handleInputSelect = (event: ChangeEvent<{ value: unknown }>) => {
  //   setQualification(event.target.value as string);
  // };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <Tabs
        value={tabValue}
        onChange={handleTabChange}
        scrollButtons='auto'
        aria-label='simple tabs example'
        indicatorColor='primary'
        textColor='primary'
        variant='fullWidth'
        centered>
        <Tab
          className={classes.font}
          label='Academic Information'
          {...a11yProps(0)}
        />
      </Tabs> */}

      <TabPanel value={tabValue} index={0}>
        {academicInfo.map((data, index) => {
          const {
            qualification,
            schoolCollegeName,
            specialization,
            yearOfPassing,
            percentage,
          } = data;

          return (
            <Fragment>
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
                          onClick={(e) => deleteAcadInfo(e, index)}>
                          DELETE
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Fragment>
              )}
              <Grid
                container
                className={classes.margin}
                direction='row'
                justify='center'
                alignItems='center'
                spacing={1}>
                <Grid item xs={12} lg={10}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>Qualification</FormLabel>
                    <Select
                      value={qualification}
                      onChange={(e) =>
                        handleAcadInfoOnChange(e, 'qualification', index)
                      }
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      className={classes.margin}>
                      <MenuItem value='' disabled>
                        Select your qualification
                      </MenuItem>
                      {qualificationOptions.map((qualification) => {
                        return (
                          <MenuItem key={qualification} value={qualification}>
                            {qualification}
                          </MenuItem>
                        );
                      })}
                    </Select>
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
                <Grid item xs={12} lg={10}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>School/College Name</FormLabel>
                    <TextField
                      className={classes.margin}
                      id='outlined-basic'
                      value={schoolCollegeName}
                      placeholder='Enter your School/College name'
                      variant='outlined'
                      onChange={(e) =>
                        handleAcadInfoOnChange(e, 'schoolCollegeName', index)
                      }
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
                    <FormLabel>Specialization</FormLabel>
                    <TextField
                      className={classes.margin}
                      id='outlined-basic'
                      value={specialization}
                      placeholder='BE in Computer Science'
                      variant='outlined'
                      onChange={(e) =>
                        handleAcadInfoOnChange(e, 'specialization', index)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={2}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>Year of passing</FormLabel>
                    <TextField
                      className={classes.margin}
                      id='outlined-basic'
                      variant='outlined'
                      value={yearOfPassing}
                      type='number'
                      placeholder='2020'
                      onChange={(e) =>
                        handleAcadInfoOnChange(e, 'yearOfPassing', index)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={2}>
                  <FormControl fullWidth variant='outlined'>
                    <FormLabel>Percentage</FormLabel>
                    <TextField
                      className={classes.margin}
                      id='outlined-basic'
                      variant='outlined'
                      value={percentage}
                      placeholder='79'
                      type='number'
                      onChange={(e) =>
                        handleAcadInfoOnChange(e, 'percentage', index)
                      }
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
          <Grid item xs={12} lg={10}>
            <Divider className={classes.dividerColor} />
          </Grid>
        </Grid>

        <Grid
          className={classes.margin}
          container
          direction='row'
          justify='center'
          alignItems='center'>
          <Grid
            container
            item
            xs={12}
            lg={10}
            direction='row'
            justify='flex-end'>
            <Grid item>
              <Button
                startIcon={<AddIcon />}
                onClick={addNewAcadInfo}
                color='primary'>
                ADD NEW
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
};

export default AcademicInformation;
