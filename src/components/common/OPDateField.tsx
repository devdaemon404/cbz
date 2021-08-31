import React from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const OPDateField = () => {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2014-08-18T21:11:54'),
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify='space-around'>
          <KeyboardDatePicker
            clearable
            fullWidth
            value={selectedDate}
            variant='inline'
            inputVariant='outlined'
            onChange={(date) => handleDateChange(date)}
            size='small'
            minDate={new Date()}
            format='dd/MM/yyyy'
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default OPDateField;
