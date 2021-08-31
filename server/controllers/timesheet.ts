import mongoose from 'mongoose';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { Request, Response, NextFunction } from 'express';

import TimeSheet from '../models/TimeSheet';
import TaskSchema from '../models/Task';
import { ApprovalStatus } from 'src/types/project-manager/timesheet';

// the bigger date has to be the 2nd argument
// const getDiffInDate = (date1: Date, date2: Date): number =>
//   (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);

interface RespObje {
  valid: boolean;
  message: string | null;
}

// function to validate tasks
const checkIfTimesheetIsValid = async (task): Promise<RespObje> => {
  const { week, taskId } = task;

  // week should contain 7 days
  if (Object.keys(week).length !== 7)
    return {
      valid: false,
      message: `Tasks data does not contain all days for task ${taskId}`,
    };

  const start: any = new Date(week['Sun']['date']);
  const end: any = new Date(week['Sat']['date']);

  if (isNaN(start) || isNaN(end))
    return {
      valid: false,
      message: `Dates provided are not valid dates for ${taskId}`,
    };

  // check whether the start and end are sun and sat
  if (start.getDay() !== 0 || end.getDay() !== 6)
    return {
      valid: false,
      message: `Dates provided are not valid dates for ${taskId}`,
    };

  const taskData = await TaskSchema.findById(taskId).lean();

  if (taskData === null)
    return { valid: false, message: `No such task exists with id ${taskId}` };

  // const taskStart = new Date(taskData.startDate);
  // const taskEnd = new Date(taskData.endDate);

  // // check if timesheet start is between the tasks start and end time
  // const isTimesheetStartValid =
  //   getDiffInDate(taskStart, start) >= 0 && getDiffInDate(start, taskEnd) >= 0;

  // // check if timesheet end is between the tasks start and end time
  // const isTimesheetEndValid =
  //   getDiffInDate(taskStart, end) >= 0 && getDiffInDate(end, taskEnd) >= 0;

  // console.log(isTimesheetEndValid, isTimesheetStartValid);

  // if (!isTimesheetEndValid || !isTimesheetStartValid)
  //   return {
  //     valid: false,
  //     message: `Start and end date should be between the tasks schedule for task ID ${taskId}`,
  //   };

  return { valid: true, message: null };
};

/**
 * @desc   Create a task
 * @route  POST /api/v2/timesheet/task
 * @access Private
 * @role   Project Manager
 */

export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;

    const { startDate, endDate } = req.body;

    const start: any = new Date(startDate);
    const end: any = new Date(endDate);

    if (isNaN(start) || isNaN(end))
      return next(new ErrorResponse(`Dates given are invalid`, 400));

    // const diffInTime = getDiffInDate(start, end);

    // if (diffInTime < 0)
    //   return next(
    //     new ErrorResponse(`Start date of task should be before end date`, 400),
    //   );

    await TaskSchema.create({
      ...req.body,
      projectId: mongoose.Types.ObjectId(projectId),
      // startWeek,
      // endWeek,
      year: start.getFullYear(),
    });

    res.status(201).json({
      success: true,
      message: 'Task created',
    });
  },
);

/**
 * @desc   get all task related to a project given weekNumber and projectID
 * @route  GET /api/v2/timesheet/task/
 * @access Private
 * @role   Project Manager
 */

export const getTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, weekNumber, year } = req.query;

    // const date = getDateOfISOWeek(weekNumber, year);

    const data = await TaskSchema.find({
      $and: [
        { projectId: mongoose.Types.ObjectId(projectId) },
        { startWeek: { $lte: weekNumber } },
        { year },
        { endWeek: { $gte: weekNumber } },
      ],
    }).lean();

    res.status(200).json({
      success: true,
      message: 'All task data has been fetched',
      data,
    });
  },
);

/**
 * @desc   get all task related to a project
 * @route  GET /api/v2/timesheet/tasks/
 * @access Private
 * @role   Project Manager
 */

export const getAllTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;

    // const date = getDateOfISOWeek(weekNumber, year);

    const data = await TaskSchema.find({
      $and: [{ projectId: mongoose.Types.ObjectId(projectId) }],
    }).lean();

    res.status(200).json({
      success: true,
      message: 'All task data has been fetched',
      data,
    });
  },
);

/**
 * @desc   Create a Timesheet
 * @route  POST /api/v2/timesheet
 * @access Private
 * @role   Employee
 */
export const createTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, employeeId } = req.query;

    const { tasks } = req.body;

    let areAllTimesheetValid: RespObje = { valid: true, message: null };

    for (let task of tasks) {
      areAllTimesheetValid = await checkIfTimesheetIsValid(task);
      if (areAllTimesheetValid.valid === false) break;
    }

    if (!areAllTimesheetValid.valid)
      return next(new ErrorResponse(areAllTimesheetValid.message, 400));

    await TimeSheet.create({
      ...req.body,
      projectId: mongoose.Types.ObjectId(projectId),
      employeeId: mongoose.Types.ObjectId(employeeId),
    });

    res.status(201).json({
      success: true,
      message: 'Timesheet created',
    });
  },
);

/**
 * @desc   get all timesheet related to a employee
 * @route  GET /api/v2/timesheet/
 * @access Private
 * @role   Project Manager
 */

export const getTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;

    const timeSheetData = await TimeSheet.find({
      employeeId: mongoose.Types.ObjectId(employeeId),
    }).lean();

    res.status(200).json({
      success: true,
      message: 'All timesheets have been fetched for the employee',
      data: timeSheetData,
    });
  },
);

export const getTimesheetForProjectAndEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectManager, employeeId } = req.params;
  },
);

/**
 * @desc   Update a timesheet
 * @route  PUT /api/v2/timesheet/
 * @access Private
 * @role   Project Manager
 */

// put submit or approved
export const updateTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { timesheetId } = req.params;

    const { tasks, status } = req.body;

    let areAllTimesheetValid: RespObje = { valid: true, message: null };

    for (const task of tasks) {
      areAllTimesheetValid = await checkIfTimesheetIsValid(task);
      if (!areAllTimesheetValid.valid) break;
    }

    if (!areAllTimesheetValid.valid)
      return next(new ErrorResponse(areAllTimesheetValid.message, 400));

    if (status === ApprovalStatus.APPROVED) {
      await TimeSheet.findByIdAndUpdate(timesheetId, {
        approvalStatus: ApprovalStatus.APPROVED,
      });
    } else {
      const didUpdate = await TimeSheet.findByIdAndUpdate(timesheetId, {
        ...req.body,
        approvalStatus: ApprovalStatus.AMENDED,
      });

      if (didUpdate === null)
        return next(
          new ErrorResponse(`Timesheet with the given ID does not exist`, 400),
        );
    }

    res.status(200).json({
      success: true,
      message: 'Timesheet updated',
    });
  },
);

// /**
//  * @desc   Approve a timesheet
//  * @route  PATCH /api/v2/timesheet/
//  * @access Private
//  * @role   Project Manager
//  */

// export const approveTimesheet = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { timesheetId, id } = req.params;

//     const doesTimesheetExist = await TimeSheet.findById(timesheetId);

//     if (doesTimesheetExist === null)
//       return next(
//         new ErrorResponse(`Timesheet with the given ID does not exist`, 400),
//       );

//     doesTimesheetExist.approvalId = id;
//     doesTimesheetExist.approvalStatus = ApprovalStatus.APPROVED;

//     await doesTimesheetExist.save();

//     res.status(200).json({
//       success: true,
//       message: 'Timesheet approved',
//     });
//   },
// );
