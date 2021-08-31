import React, { useState, useContext } from 'react';
import {
  DialogContent as MuiDialogContent,
  Grid,
  Paper,
  Theme,
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Divider,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import OPLoader from 'src/components/common/OPLoader';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';
import AddTask from './AddTask';
import ViewTask from './ViewTask';
import OPKeyValue from 'src/components/common/OPKeyValue';

const useStyles = makeStyles((theme: Theme) => ({
  labelFont: {
    fontWeight: 'bold',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  summaryBorder: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
  },
}));

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

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
    '&hover:': {
      backgroundColor: '#f2f2f2',
    },
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

const TaskModal = ({
  closeManagerTaskModal,
}: {
  closeManagerTaskModal: () => void;
}) => {
  const classes = useStyles();

  const { selectedProject, isLoading } = useContext(MGRTimesheetContext);

  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <DialogContent>
      <OPLoader isLoading={isLoading} />
      <Grid container direction='column'>
        <Grid item xs={8}>
          <OPKeyValue
            label='Selected Project'
            value={selectedProject.projectName}
          />
        </Grid>
        <Grid item>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}>
            <AccordionSummary
              className={classes.summaryBorder}
              expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Add task</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AddTask closeManagerTaskModal={closeManagerTaskModal} />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}>
            <AccordionSummary
              className={classes.summaryBorder}
              expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>View Task</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ViewTask />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default TaskModal;
