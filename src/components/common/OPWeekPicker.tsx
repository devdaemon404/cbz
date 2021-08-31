import clsx from 'clsx';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import isSameDay from 'date-fns/isSameDay';
import endOfWeek from 'date-fns/endOfWeek';
import React, { useContext, useState } from 'react';
import startOfWeek from 'date-fns/startOfWeek';
import isWithinInterval from 'date-fns/isWithinInterval';
import { DatePicker } from '@material-ui/pickers';
import { createStyles } from '@material-ui/styles';
// this guy required only on the docs site to work with dynamic date library
import { makeJSDateObject } from '../../utils/helpers';
import { IconButton, withStyles } from '@material-ui/core';
import moment from 'moment';
import MGRTimesheetContext from '../../contexts/project-manager/timesheet/manager/mgr-timesheet-context';
import EMPTimesheetContext from 'src/contexts/employee/timesheet/emp-ts-context';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';
import CATimesheetContext from 'src/contexts/client-admin/timesheet/manager/ca-timesheet-context';

const styles = createStyles((theme) => ({
  dayWrapper: {
    position: 'relative',
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: 'inherit',
  },
  customDayHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '2px',
    right: '2px',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '50%',
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
  },
  highlightNonCurrentMonthDay: {
    color: '#676767',
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  firstHighlight: {
    extend: 'highlight',
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  endHighlight: {
    extend: 'highlight',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
}));

const getWeekNumber = (date: Date) => {
  //find the year of the current date
  var oneJan = new Date(date.getFullYear(), 0, 1);
  // calculating number of days in given year before a given date
  // @ts-ignore
  var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  // adding 1 since to current date and returns value starting from 0
  var result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return result;
};

export const getWeekData = (date, numberOfDays: number) => {
  const startDate = startOfWeek(makeJSDateObject(date));
  const endDate = endOfWeek(makeJSDateObject(date));
  let weekDates: string[] = []; // 10/01/2021
  let weekDisplay: string[] = []; // 10 Sun
  const weekNumber = moment(endDate).week();
  // const weekNumber = getWeekNumber(date);
  const month = moment(date).format('MM');
  const year = moment(endDate).year().toString();
  for (var i = 0; i < numberOfDays; i++) {
    weekDates.push(moment(startDate).add(i, 'days').format('MM-DD-YYYY'));
    weekDisplay.push(moment(startDate).add(i, 'days').format('DD ddd'));
  }
  return { weekNumber, month, year, weekDates, weekDisplay };
};

const OPWeekPicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { setSelectedWeekData } = useContext(MGRTimesheetContext);
  const { setSelectedWeekData: setEmpWeekData } = useContext(
    EMPTimesheetContext,
  );
  const { setSelectedVAWeekData } = useContext(VATimesheetContext);
  const { setSelectedWeekData: setCAWeekData } = useContext(CATimesheetContext);

  const handleWeekChange = (date) => {
    const { weekNumber, month, year, weekDates, weekDisplay } = getWeekData(
      date,
      7,
    );
    setSelectedWeekData({
      weekNumber,
      month,
      year,
      weekDates,
      weekDisplay,
    });
    setEmpWeekData({
      weekNumber,
      month,
      year,
      weekDates,
      weekDisplay,
    });
    setSelectedVAWeekData({
      weekNumber,
      month,
      year,
      weekDates,
      weekDisplay,
    });
    setCAWeekData({
      weekNumber,
      month,
      year,
      weekDates,
      weekDisplay,
    });

    // switch (contextType) {
    //   case 'MANAGER':
    //     setSelectedWeekData({
    //       weekNumber,
    //       month,
    //       year,
    //       weekDates,
    //       weekDisplay,
    //     });
    //     break;
    //   case 'EMPLOYEE':
    //     setEmployeeTimesheetState({
    //       weekNumber,
    //       month,
    //       year,
    //       weekDates,
    //       weekDisplay,
    //     });
    //     break;
    //   case 'VEMPLOYEE':
    //     setEmpTimesheetState({
    //       weekNumber,
    //       month,
    //       year,
    //       weekDates,
    //       weekDisplay,
    //     });
    //     break;
    // }

    setSelectedDate(startOfWeek(makeJSDateObject(date)));
  };

  const formatWeekSelectLabel = (date, invalidLabel) => {
    const dateClone = makeJSDateObject(date);

    return dateClone && isValid(dateClone)
      ? `Week of ${format(startOfWeek(dateClone), 'MMM do')}`
      : invalidLabel;
  };

  const renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
    const { classes } = props;
    const dateClone = makeJSDateObject(date);
    const selectedDateClone = makeJSDateObject(selectedDate);

    const start = startOfWeek(selectedDateClone);
    const end = endOfWeek(selectedDateClone);

    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const isFirstDay = isSameDay(dateClone, start);
    const isLastDay = isSameDay(dateClone, end);

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, 'd')} </span>
        </IconButton>
      </div>
    );
  };

  return (
    <DatePicker
      // disableFuture
      value={selectedDate}
      onChange={handleWeekChange}
      renderDay={renderWrappedWeekDay}
      labelFunc={formatWeekSelectLabel}
    />
  );
};

export default withStyles(styles)(OPWeekPicker);
