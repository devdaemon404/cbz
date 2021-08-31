import React from 'react';
import {
  DialogContent as MuiDialogContent,
  Grid,
  Theme,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import 'moment-timezone';
import { withStyles } from '@material-ui/styles';
import TimeSheetAccordian from './TimeSheetAccordian';
import OPWeekPicker from 'src/components/common/OPWeekPicker';

const useStyles = makeStyles((theme: Theme) => ({
  roundButton: {
    borderRadius: '40px',
    marginTop: theme.spacing(1),
  },
  buttonMargin: {
    margin: theme.spacing(2, 0),
  },
  paperPadding: {
    padding: theme.spacing(2),
  },
}));

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const TimeSheetModalContent = () => {
  const classes = useStyles();

  return (
    <div>
      <DialogContent>
        <Grid container spacing={2} direction='column'>
          <Grid item>
            <Paper className={classes.paperPadding} variant='outlined'>
              <Typography variant='body1' color='inherit'>
                Pick a Week
              </Typography>
              <OPWeekPicker contextType={'EMPLOYEE'} />
            </Paper>
          </Grid>
          <Grid item>
            <TimeSheetAccordian />
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  );
};

export default TimeSheetModalContent;
