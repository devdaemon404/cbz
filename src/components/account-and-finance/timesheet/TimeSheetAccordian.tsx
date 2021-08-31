import React, { useContext, useEffect, useState } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import {
  Grid,
  Typography,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
} from '@material-ui/core';
import WeekTable from './WeekTable';
import OPKeyValue from '../../common/OPKeyValue';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    summaryBorder: {
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
    },
    textBackground: {
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(1),
    },
    boldFont: {
      fontWeight: theme.typography.fontWeightMedium,
    },
  }),
);

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const TimeSheetAccordian = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string | false>('panel2');

  const { vaTimesheetList, empId } = useContext(VATimesheetContext);

  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
  });

  useEffect(() => {
    const tempTimesheet = vaTimesheetList.filter(
      (timesheet) => timesheet.employeeId === empId,
    );

    if (tempTimesheet) {
      const { firstname, lastname, email, mobile } = tempTimesheet[0].profileId;

      setUserData({ firstname, lastname, email, mobile });
    }
  }, [empId]);

  const names = [
    { label: 'First Name', value: userData.firstname },
    { label: 'Last Name', value: userData.lastname },
    { label: 'Email', value: userData.email },
    { label: 'Mobile', value: userData.mobile },
  ];

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}>
        <AccordionSummary
          className={classes.summaryBorder}
          expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            General Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} direction='column'>
            <Grid item>
              {/* <Typography variant='h6' color='initial'>
                Engineer - Development Engineer - Sr
              </Typography> */}
            </Grid>
            <Grid container direction='row' spacing={2} item>
              {names.map((name) => (
                <Grid
                  container
                  direction='row'
                  spacing={2}
                  item
                  lg={6}
                  xs={12}
                  alignItems='center'>
                  <OPKeyValue label={name.label} value={name.value} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Timesheet</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={12}>
              {/* //
                *Week Table
              //*/}
              <WeekTable />
              {/* //
                *Week Table
              //*/}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default TimeSheetAccordian;
