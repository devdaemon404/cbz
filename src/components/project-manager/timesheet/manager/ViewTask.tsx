import React, { useContext } from 'react';
import {
  Box,
  createStyles,
  Divider,
  makeStyles,
  Theme,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@material-ui/core';
import moment from 'moment';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';
import OPWeekPicker from 'src/components/common/OPWeekPicker';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxHeight: '40vh',
      overflowY: 'auto',
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
      border: `1px solid ${theme.palette.grey[300]}`,
      borderTop: 'none',
      '&:nth-child(1)': {
        borderTop: `1px solid ${theme.palette.grey[300]}`,
      },
      backgroundColor: theme.palette.grey[100],
      '&:hover': {
        backgroundColor: '#f2f2f2',
      },
    },
  }),
);

const ViewTask = () => {
  const classes = useStyles();
  const { allTasks } = useContext(MGRTimesheetContext);

  return (
    <>
      <Grid container spacing={2} direction='column'>
        <Grid item>
          <Typography variant='h6' color='primary'>
            Select a Week to View Created Tasks
          </Typography>
        </Grid>
        <Grid item>
          <OPWeekPicker />
        </Grid>
        <Grid item>
          {allTasks.length > 0 ? (
            <List className={classes.root}>
              {allTasks.map((task) => (
                <ListItem className={classes.nested}>
                  <ListItemText
                    primary={task.taskName}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component='span'
                          variant='body2'
                          color='textPrimary'>
                          {`${moment(task.startDate).format(
                            'DD MMM YY',
                          )}-${moment(task.endDate).format('DD MMM YY')}`}
                        </Typography>
                        <br />
                        {`Description : ${task.taskDesc}`}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant='body1'>
              No Task created for the selected week
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ViewTask;
