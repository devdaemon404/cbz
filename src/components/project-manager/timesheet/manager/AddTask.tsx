import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useContext } from 'react';
import MGRTimesheetContext from 'src/contexts/project-manager/timesheet/manager/mgr-timesheet-context';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
  },
  labelFont: {
    fontWeight: 'bold',
  },
  fixHeight: {
    maxHeight: '50vh',
    overflowY: 'auto',
  },
}));

const AddTask = ({ closeManagerTaskModal }) => {
  const classes = useStyles();
  const {
    taskState,
    createTask,
    addNewTask,
    handleNewTaskChange,
    deleteCurrentTask,
  } = useContext(MGRTimesheetContext);

  return (
    <Grid container direction='column' spacing={2} justify='space-between'>
      <Grid
        item
        container
        direction='column'
        wrap='nowrap'
        className={classes.fixHeight}>
        {taskState.map((task, index) => (
          <Grid
            item
            container
            direction='row'
            spacing={2}
            component={Paper}
            variant='outlined'
            style={{ marginBottom: '1rem' }}
            className={classes.paperPadding}>
            <Grid
              item
              container
              direction='column'
              spacing={2}
              xs={4}
              justify='space-between'>
              <Grid item>
                <Typography
                  variant='body2'
                  className={classes.labelFont}
                  gutterBottom
                  color='inherit'>
                  Task Name
                </Typography>
                <TextField
                  name='taskName'
                  value={task.taskName}
                  fullWidth
                  size='small'
                  variant='outlined'
                  placeholder='Enter task name...'
                  onChange={(e) =>
                    handleNewTaskChange(e.target.value, 'taskName', index)
                  }
                />
              </Grid>
              <Grid item>
                <Typography
                  variant='body2'
                  className={classes.labelFont}
                  gutterBottom
                  color='inherit'>
                  Start Date
                </Typography>
                <KeyboardDatePicker
                  id='start-date'
                  format='dd/MM/yyyy'
                  inputVariant='outlined'
                  size='small'
                  fullWidth
                  value={task.startDate}
                  // onChange={(value) =>
                  //   setTaskState({
                  //     ...taskState,
                  //     startDate: moment(value).format('YYYY-MM-DD'),
                  //     startWeek: moment(value).week(),
                  //   })
                  // }
                  onChange={(value) =>
                    handleNewTaskChange(value, 'startDate', index)
                  }
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant='body2'
                  className={classes.labelFont}
                  gutterBottom
                  color='inherit'>
                  End Date
                </Typography>
                <KeyboardDatePicker
                  id='endDate'
                  inputVariant='outlined'
                  size='small'
                  fullWidth
                  format='dd/MM/yyyy'
                  value={task.endDate}
                  // onChange={(value) =>
                  //   setTaskState({
                  //     ...taskState,
                  //     endDate: moment(value).format('YYYY-MM-DD'),
                  //     endWeek: moment(value).week(),
                  //   })
                  // }
                  onChange={(value) =>
                    handleNewTaskChange(value, 'endDate', index)
                  }
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={8}
              container
              direction='column'
              justify='space-between'>
              <Grid item>
                <Typography
                  variant='body2'
                  className={classes.labelFont}
                  gutterBottom
                  color='inherit'>
                  Description
                </Typography>
                <TextField
                  name='taskDesc'
                  value={task.taskDesc}
                  fullWidth
                  size='small'
                  multiline
                  rows={5}
                  variant='outlined'
                  onChange={(e) =>
                    handleNewTaskChange(e.target.value, 'taskDesc', index)
                  }
                  placeholder='Enter task desc...'
                />
              </Grid>
              <Grid item>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                  }}>
                  {taskState.length !== 1 && (
                    <Button
                      variant='text'
                      style={{ color: 'red', background: '#ffcccb' }}
                      onClick={() => deleteCurrentTask(index)}>
                      <DeleteIcon />
                    </Button>
                  )}

                  {taskState.length === index + 1 && (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={addNewTask}
                      style={{ marginLeft: 8 }}>
                      <AddIcon />
                    </Button>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      {/* <Grid item> */}
      {/* <Divider />
      </Grid> */}
      <Grid item style={{ textAlign: 'right', marginTop: '1rem' }}>
        <Button
          variant='contained'
          color='primary'
          onClick={async () => {
            await createTask();
            closeManagerTaskModal();
          }}>
          Confirm
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddTask;
