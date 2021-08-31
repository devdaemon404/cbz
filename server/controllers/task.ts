import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import moment from 'moment';
import { makeJSDateObject } from '../../src/utils/helpers';

import TaskSchema from '../models/Task';
import TimeSheet from '../models/TimeSheet';

function sanitize(str: string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/gi;
  return str.replace(reg, (match) => map[match]);
}

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

// this function will validate tasks before adding it to db
// If task which has to be created has a startWeek which is
// already a week for a timesheet update tht timesheet to add
// this tasks
const validateTasksAndUpdateTimesheets = async (task) => {
  const { startDate, endDate, startWeek, endWeek, projectId } = task;
  const start: any = new Date(startDate);
  const end: any = new Date(endDate);

  // check if dates provided are valid or not
  if (isNaN(start) || isNaN(end)) return false;

  const { weekDates } = getWeekData(start, 7);

  let counter = startWeek;

  const endYear = `${end.getFullYear()}`;
  const weeksArr: [Number?] = [];

  // this will be executed when the endWeek is less
  // than the startweek so the task continues to next year
  if (counter > endWeek) {
    // add weeks till 53
    while (counter <= 53) weeksArr.push(counter++);
    counter = 0;
    // then till endWeek
    while (counter <= endWeek) weeksArr.push(counter++);
    task['startYear'] = Number(endYear) - 1;
  } else {
    while (counter <= endWeek) {
      weeksArr.push(counter++);
    }
    task['startYear'] = endYear;
  }

  task['weeksArr'] = weeksArr;
  task['endYear'] = endYear;

  delete task['year'];
  delete task['startWeek'];
  delete task['endWeek'];

  // get id of inserted doc to add the tasks
  // is timesheet for that week exists
  const { _id } = await TaskSchema.create(task);

  const timeSheetData = await TimeSheet.find({
    $and: [
      { $or: [{ year: task.startYear }, { year: task.endYear }] },
      { weekNumber: { $in: weeksArr } },
      { projectId },
    ],
  });

  // console.log(timeSheetData);

  if (!timeSheetData.length) return true;

  const weekData = {
    Sun: {
      date: weekDates[0],
      comments: '',
    },
    Mon: {
      date: weekDates[1],
      comments: '',
    },
    Tue: {
      date: weekDates[2],
      comments: '',
    },
    Wed: {
      date: weekDates[3],
      comments: '',
    },
    Thu: {
      date: weekDates[4],
      comments: '',
    },
    Fri: {
      date: weekDates[5],
      comments: '',
    },
    Sat: {
      date: weekDates[6],
      comments: '',
    },
  };

  const taskData = {
    taskId: _id,
    weekData,
  };

  // console.log(taskData);

  for (let td of timeSheetData) {
    td.data[td.data.length - 1].tasks = [
      ...td.data[td.data.length - 1].tasks,
      taskData,
    ];
    await TimeSheet.findByIdAndUpdate(td.id, td);
  }

  return true;
};

export const createTask = asyncHandler(async (req, res, next) => {
  const { tasks } = req.body;
  let areAllTasksValid = true;
  for (const task of tasks) {
    areAllTasksValid = await validateTasksAndUpdateTimesheets(task);
    if (!areAllTasksValid) break;
  }

  if (!areAllTasksValid)
    return next(new ErrorResponse(`Tasks data and dates are not valid`, 400));

  res.status(201).json({
    success: true,
    message: 'Task created',
  });
});

export const getTaskForProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const taskData = await TaskSchema.find({ projectId }).lean();

  if (!taskData)
    return next(new ErrorResponse(`No tasks for the project id`, 400));

  res.status(200).json({
    success: true,
    message: 'All tasks have been fetched',
    taskData,
  });
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  const keyArr = Object.keys(req.body);

  // check if request object is empty or not
  if (!keyArr.length)
    return next(new ErrorResponse(`No field specified for updates`, 400));

  // sanitize input since it cannot be sanitize at route
  // as we dont know what will the name of the key
  keyArr.forEach((f) => {
    req.body[f] = sanitize(req.body[f]);
  });

  delete req.body.weeksArr;
  delete req.body.startYear;
  delete req.body.endYear;
  delete req.body.startDate;
  delete req.body.endDate;

  const taskData = await TaskSchema.findByIdAndUpdate(taskId, req.body);

  if (!taskData)
    return next(new ErrorResponse(`No tasks with the provided id`, 400));

  res.status(200).json({
    success: true,
    message: 'Task has been updated',
  });
});

/**
 * @desc   get all task related to a project given weekNumber and projectID
 * @route  GET /api/v2/timesheet/task/
 * @access Private
 * @role   Project Manager
 */

export const getTasksForWeek = asyncHandler(async (req, res, next) => {
  const { projectId, weekNumber, year } = req.query;

  let data = await TaskSchema.find({
    $and: [
      { projectId },
      {
        $or: [{ startYear: year }, { endYear: year }],
      },
      { weeksArr: Number(weekNumber) },
    ],
  }).lean();

  let is53Present = false;
  let is1Present = false;

  let diffrenceOfWeekFrom53 = 0;
  let diffrenceOfWeekFrom1 = 0;

  // here lagorithm is if a task has both 53 and 1 then
  // the task carries on to next year
  // so what we will do is if the weekNumber is closer to 53
  // then query based on start year else query based on end year
  data = data.filter((task) => {
    is53Present = task.weeksArr.includes(53);
    is1Present = task.weeksArr.includes(1);

    if (is53Present && is1Present) {
      diffrenceOfWeekFrom53 = 53 - Number(weekNumber);
      diffrenceOfWeekFrom1 = Number(weekNumber) - 1;

      if (diffrenceOfWeekFrom1 > diffrenceOfWeekFrom53) {
        return year === task.startYear;
      } else {
        return year === task.endYear;
      }
    }

    return true;
  });

  res.status(200).json({
    success: true,
    message: 'All task data has been fetched',
    data,
  });
});
