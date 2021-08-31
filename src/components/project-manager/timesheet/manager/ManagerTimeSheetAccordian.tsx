import React, { useState } from 'react';
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
import OPKeyValue from '../../../common/OPKeyValue';
import { green, blue } from '@material-ui/core/colors';

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

const names = [
  { label: 'Name', value: 'Ankit Sethi' },
  { label: 'Assignment ID ', value: '144665' },
  { label: 'Industry', value: 'IT-India' },
  { label: 'Data Range', value: '7/5/2020' },
  { label: 'Cost Center', value: 'TO FULFIL' },
  { label: 'Requisitor', value: 'Madhu Krishna' },
  { label: 'Timesheet Approver', value: 'Madhu Krishna' },
];

const codes = [
  { label: 'Pay Code', value: 'Placeholder' },
  { label: 'Expense Code', value: '#144665' },
  { label: 'Cost Center', value: 'To FULFIL' },
];

const ManagerTimeSheetAccordian = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [actions, setActions] = useState('SELECT');

  const handleActionsChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setActions(event.target.value as string);
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
              <Typography variant='h6' color='initial'>
                Engineer - Development Engineer - Sr
              </Typography>
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
    </div>
  );
};
export default ManagerTimeSheetAccordian;
