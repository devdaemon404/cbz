import React, { useContext, useState } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import {
  FiberManualRecord as FiberManualRecordIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import {
  Grid,
  Typography,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import WeekTable from './WeekTable';
import OPKeyValue from '../../../common/OPKeyValue';
import { green, blue } from '@material-ui/core/colors';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';

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

const codes = [
  { label: 'Pay Code', value: 'Placeholder' },
  { label: 'Expense Code', value: '#144665' },
  { label: 'Cost Center', value: 'To FULFIL' },
];

const TimeSheetAccordian = () => {
  const classes = useStyles();

  const { currentEmployeeData } = useContext(MGRTimesheetContext);

  const [expanded, setExpanded] = useState<string | false>('panel2');

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  // console.log('Current employee data: ', currentEmployeeData);

  const names = [
    { label: 'First Name', value: currentEmployeeData?.profile?.firstname },
    { label: 'Last Name', value: currentEmployeeData?.profile?.lastname },
    { label: 'Date Of Joining', value: currentEmployeeData?.profile?.doj },
    { label: 'Email', value: currentEmployeeData?.profile?.email },
    { label: 'Experience', value: currentEmployeeData?.profile?.experience },
    { label: 'Location', value: currentEmployeeData?.profile?.location },
    { label: 'Mobile', value: currentEmployeeData?.profile?.mobile },
  ];

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
              {names.map((name, index) => (
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
            {/* <Grid container direction='column' spacing={2} item xs={7}>
              {codes.map((code, index) => (
                <OPKeyValue label={code.label} value={code.value} />
              ))}
            </Grid>
            <Grid container direction='column' item xs={5}>
              <Grid container direction='row-reverse' item>
                <Button variant='contained' color='primary'>
                  Edit Timesheet
                </Button>
              </Grid>
            </Grid> */}
            <Grid item xs={12}>
              <WeekTable />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default TimeSheetAccordian;
