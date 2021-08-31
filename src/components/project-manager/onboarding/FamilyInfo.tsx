import React, {
  ChangeEvent,
  Fragment,
  ReactNode,
  useContext,
  useEffect,
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
import 'date-fns';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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

const FamilyInfo = () => {
  // Tab value
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    familyInfo,
    addNewFamilyInfo,
    deleteFamilyInfo,
    handleFamilyInfoOnChange,
  } = useContext(OnboardingContext);

  useEffect(() => {
    console.log('Family: ', familyInfo);
  }, [familyInfo]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
          {familyInfo.map((data, index) => {
            const {
              familyMemberName,
              relationship,
              familyMemberDob,
              bloodGroup,
              occupation,
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
                            onClick={(e) => deleteFamilyInfo(e, index)}>
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
                      <FormLabel>Family Member Name</FormLabel>
                      <TextField
                        className={classes.margin}
                        id='outlined-basic'
                        value={familyMemberName}
                        placeholder='Enter family member name'
                        variant='outlined'
                        onChange={(e) =>
                          handleFamilyInfoOnChange(
                            e.target.value,
                            'familyMemberName',
                            index,
                          )
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
                  <Grid item xs={12} lg={10}>
                    <FormControl fullWidth variant='outlined'>
                      <FormLabel>Relationship</FormLabel>
                      <TextField
                        className={classes.margin}
                        id='outlined-basic'
                        value={relationship}
                        placeholder='Enter relationship'
                        variant='outlined'
                        onChange={(e) =>
                          handleFamilyInfoOnChange(
                            e.target.value,
                            'relationship',
                            index,
                          )
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
                      <FormLabel>Occupation</FormLabel>
                      <TextField
                        className={classes.margin}
                        id='outlined-basic'
                        value={occupation}
                        placeholder='Enter occupation'
                        variant='outlined'
                        onChange={(e) =>
                          handleFamilyInfoOnChange(
                            e.target.value,
                            'occupation',
                            index,
                          )
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={2}>
                    <FormControl fullWidth variant='outlined'>
                      <FormLabel>Date of Birth</FormLabel>
                      <KeyboardDatePicker
                        margin='normal'
                        id='family-dob'
                        format='dd/MM/yyyy'
                        inputVariant='outlined'
                        value={familyMemberDob || new Date()}
                        onChange={(value) =>
                          handleFamilyInfoOnChange(
                            moment(value).format('YYYY-MM-DD'),
                            'familyMemberDob',
                            index,
                          )
                        }
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={2}>
                    <FormControl fullWidth variant='outlined'>
                      <FormLabel>Blood Group</FormLabel>
                      <TextField
                        className={classes.margin}
                        id='outlined-basic'
                        variant='outlined'
                        value={bloodGroup}
                        placeholder='Enter blood group'
                        onChange={(e) =>
                          handleFamilyInfoOnChange(
                            e.target.value,
                            'bloodGroup',
                            index,
                          )
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
                  onClick={addNewFamilyInfo}
                  color='primary'>
                  ADD NEW
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default FamilyInfo;
