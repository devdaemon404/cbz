import mongoose from 'mongoose';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import moment from 'moment';

import TimeSheet, { Status } from '../models/TimeSheet';
import EmployeeSchema from '../models/Employees';
import Profile from '../models/Profile';
import Project from '../models/Project';
import Vendor from '../models/Vendor';
import Client from '../models/Client';
import { getNextSequenceValue } from '../models/Counter';
import User from '../models/User';

// const validateTasks = async (task) => {
//   const isTaskPresent = await TaskSchema.exists({ _id: task.taskId });
//   return isTaskPresent;
// };

const validateTimesheet = async ({
  weekNumber,
  year,
  employeeId,
  projectId,
}) => {
  const isTimesheetValid = await TimeSheet.exists({
    weekNumber,
    year,
    employeeId,
    projectId,
  });
  return !isTimesheetValid;
};

const isYearInvalid = (year) => {
  const checkYear = Number(year);

  return isNaN(checkYear);
};

export const createTimesheet = asyncHandler(async (req, res, next) => {
  const { tasks, employeeId, weekNumber, year, projectId } = req.body;

  if (isYearInvalid(year))
    return next(new ErrorResponse('The year provided is invalid', 400));

  const isDataValid = { success: true, errMessage: '' };

  isDataValid.success = await validateTimesheet({
    weekNumber,
    year,
    employeeId,
    projectId,
  });

  if (!isDataValid.success) {
    isDataValid.errMessage = `Timesheet for week ${weekNumber} and year ${year} already exists`;
  }

  if (!isDataValid.success)
    return next(new ErrorResponse(isDataValid.errMessage, 400));

  const empData = await EmployeeSchema.findById(employeeId).lean();

  if (empData === null)
    return next(
      new ErrorResponse('Employee with the given Id does not exists', 400),
    );

  const profiledata = empData.profile.toJSON();
  const vendorData = empData.vendor.toJSON();
  /* console.log(vendorData, empData.clientId); */
  const id = `${employeeId.slice(
    employeeId.length - 4,
  )}-${weekNumber}-${year}-1`;

  const startDate = moment().year(year).week(weekNumber).day('Sunday').toDate();
  const endDate = moment().year(year).week(weekNumber).day('Saturday').toDate();
  await TimeSheet.create({
    data: [{ tasks, id }],
    weekNumber,
    year,
    profileId: profiledata['$id'],
    vendorId: vendorData['$id'],
    clientId: empData.clientId,
    projectId,
    employeeId,
    startDate,
    endDate,
  });

  res.status(201).json({
    success: true,
    message: 'Timesheet created',
  });
});

export const getCountForProject = asyncHandler(async (req, res, next) => {
  const { projectArr, tStatus } = req.body;

  for (let i = 0; i < projectArr.length; i++) {
    projectArr[i] = mongoose.Types.ObjectId(projectArr[i]);
  }

  const data = await TimeSheet.aggregate([
    { $match: { _id: { $in: projectArr } } },
    { $project: { $id: 1, data: { $arrayElemAt: ['$data', -1] } } },
    { $match: { 'data.status': tStatus } },
  ]);

  if (!data.length)
    return next(
      new ErrorResponse(
        "Timesheets with the given projectId's and status does not exists",
        400,
      ),
    );

  res.status(200).json({
    success: true,
    message: 'All timesheets data has been fetched',
    count: data.length,
  });
});

export const getAllTimesheetsForProject = asyncHandler(
  async (req, res, next) => {
    const { projectId, weekNumber, year } = req.query;

    const timesheetData = await TimeSheet.findOne({
      $and: [{ projectId }, { weekNumber }, { year: `${year}` }],
    }).lean();

    res.status(200).json({
      success: true,
      message: 'All timesheets data has been fetched',
      timesheetData,
    });
  },
);

export const getTimesheetForProjectAndEmployee = asyncHandler(
  async (req, res, next) => {
    const { projectId, weekNumber, year, employeeId } = req.query;

    const timesheetData = await TimeSheet.findOne({
      $and: [
        { projectId },
        { weekNumber },
        { year: `${year}` },
        { employeeId },
      ],
    }).lean();

    res.status(200).json({
      success: true,
      message: 'All timesheets data has been fetched',
      timesheetData,
    });
  },
);

export const getAllTimesheetsForEmployee = asyncHandler(
  async (req, res, next) => {
    const { employeeId, weekNumber, year } = req.query;

    const timesheetData = await TimeSheet.findOne({
      $and: [{ employeeId }, { weekNumber }, { year: `${year}` }],
    }).lean();

    res.status(200).json({
      success: true,
      message: 'All timesheets data has been fetched',
      timesheetData,
    });
  },
);

export const getCountForEmployee = asyncHandler(async (req, res, next) => {
  const { employeeArr, tStatus } = req.body;

  for (let i = 0; i < employeeArr.length; i++) {
    employeeArr[i] = mongoose.Types.ObjectId(employeeArr[i]);
  }

  const data = await TimeSheet.aggregate([
    { $match: { employeeId: { $in: employeeArr } } },
    { $project: { $id: 1, data: { $arrayElemAt: ['$data', -1] } } },
    { $match: { 'data.status': tStatus } },
  ]);

  res.status(200).json({
    success: true,
    message: 'All timesheets data has been fetched',
    count: data.length,
  });
});

export const updateTimesheet = asyncHandler(async (req, res, next) => {
  const { suggestion, action } = req.body;
  const { timesheetId } = req.params;

  let timeSheetData = await TimeSheet.findById(timesheetId);

  if (!timeSheetData)
    return next(
      new ErrorResponse('Timesheets with the given data does not exists', 400),
    );

  // amd stands for amend dont change this.
  // appr stands for approved
  // adj stands for adjust
  if (action.toLowerCase() === 'appr') {
    timeSheetData.data[timeSheetData.data.length - 1].status = Status.APPROVED;
    timeSheetData['lastApproved'] = Date.now();
  } else if (action.toLowerCase() === 'amd') {
    timeSheetData.data[timeSheetData.data.length - 1].status = Status.REJECTED;
    timeSheetData.data[timeSheetData.data.length - 1].suggestion = suggestion;
  } else {
    const lastVerId = new String(timeSheetData.employeeId);

    const id = `${lastVerId.slice(lastVerId.length - 4)}-${
      timeSheetData.weekNumber
    }-${timeSheetData.year}-${timeSheetData.data.length + 1}`;

    timeSheetData.data[timeSheetData.data.length - 1].status = Status.REJECTED;

    timeSheetData.data[timeSheetData.data.length - 1].suggestion =
      'Timesheet adjusted by employee';

    const newVer = {
      status: Status.SUBMITTED,
      tasks: timeSheetData.data[timeSheetData.data.length - 1].tasks,
      id,
      updatedAt: Date.now(),
    };

    timeSheetData.data = [...timeSheetData.data, newVer];
  }

  await timeSheetData.save();
  res.status(200).json({
    success: true,
    message: 'Timesheet data updated',
  });
});

export const updateTimesheetData = asyncHandler(async (req, res, next) => {
  const { timesheetId } = req.params;
  const { tasks, weekNumber, year } = req.body;

  const timesheetData = await TimeSheet.findById(timesheetId);

  if (!timesheetData)
    return next(new ErrorResponse(`No timesheet with the provided id`, 400));

  timesheetData.data[timesheetData.data.length - 1].tasks = tasks;
  timesheetData.weekNumber = weekNumber;
  timesheetData.year = year;

  await timesheetData.save();

  res.status(200).json({
    success: true,
    message: 'Timesheet updated',
  });
});

export const updateStatusToApproval = asyncHandler(async (req, res, next) => {
  const date = new Date();
  const weekNumber = moment(date).week();

  let queryWeek = weekNumber - 1;
  let queryYear = date.getFullYear();
  if (weekNumber === -1) {
    queryWeek = moment(`${date.getFullYear() - 1}-12-31`).week();
    queryYear = queryYear - 1;
  }

  const data = await TimeSheet.aggregate([
    { $match: { year: `${queryYear}` } },
    { $match: { weekNumber: queryWeek } },
    { $project: { $id: 1, data: { $arrayElemAt: ['$data', -1] } } },
    { $match: { 'data.status': Status.SUBMITTED } },
  ]);

  for (const t of data) {
    await TimeSheet.updateOne(
      { 'data._id': t.data._id, _id: t._id },
      {
        $set: {
          'data.$.status': Status.APPROVED,
        },
      },
    );
  }
  res.status(200).json({
    success: true,
    message: 'All timesheets updated',
  });
});

const getWeeksForMonth = (year, month) => {
  const firstDayOfMonth = moment(`${year}-${month}`, 'YYYY-MM-DD');
  let weekIndices = [];

  const currentDay = moment(firstDayOfMonth, 'YYYY-MM-DD');
  // @ts-ignore
  weekIndices.push(currentDay.isoWeek());

  while (currentDay.month() === firstDayOfMonth.month()) {
    currentDay.add(1, 'weeks');
    // @ts-ignore
    weekIndices.push(currentDay.isoWeek());
  }

  return weekIndices;
};

export const updateStatusToPosted = asyncHandler(async (req, res, next) => {
  const date = new Date();
  const weeksArr = getWeeksForMonth(date.getFullYear(), date.getMonth() + 1);

  const data = await TimeSheet.aggregate([
    { $match: { weekNumber: { $in: weeksArr } } },
    { $project: { $id: 1, data: { $arrayElemAt: ['$data', -1] } } },
    { $match: { 'data.status': Status.APPROVED } },
  ]);

  for (const t of data) {
    await TimeSheet.updateOne(
      { 'data._id': t.data._id, _id: t._id },
      {
        $set: {
          'data.$.status': Status.POSTED,
        },
      },
    );
  }
  res.status(200).json({
    success: true,
    message: 'All timesheets updated',
  });
});

const getHrs = (weekData) => {
  let hrs = 0;
  const dayArr = Object.keys(weekData);
  dayArr.forEach((d) => {
    hrs += weekData[d].hrs;
  });
  return hrs;
};

export const getTimesheetForProfile = asyncHandler(async (req, res, next) => {
  const { month, profileId, tStatus, year } = req.query;

  // @ts-ignore
  if (!tStatus in Status)
    return next(new ErrorResponse(`Status not valid`, 400));

  const weeksArr = getWeeksForMonth(year, Number(month) + 1);

  const timesheetData = await TimeSheet.aggregate([
    { $match: { profileId: mongoose.Types.ObjectId(profileId) } },
    { $match: { year: `${year}` } },
    { $match: { weekNumber: { $in: weeksArr } } },
    {
      $project: {
        $id: 1,
        year: 1,
        weekNumber: 1,
        profileId: 1,
        employeeId: 1,
        projectId: 1,
        data: { $arrayElemAt: ['$data', -1] },
      },
    },
    { $match: { 'data.status': tStatus } },
  ]);

  let hrs = 0;
  timesheetData.forEach((d) => {
    d.data.tasks.forEach((w) => {
      hrs += getHrs(w.weekData);
    });
  });

  const promiseArr = [
    Profile.populate(timesheetData, { path: 'profileId' }),
    EmployeeSchema.populate(timesheetData, { path: 'employeeId' }),
    Project.populate(timesheetData, { path: 'projectId' }),
  ];

  await Promise.all(promiseArr);

  res.status(200).json({
    success: true,
    message: 'All timesheets fetched',
    data: timesheetData,
    hrs,
  });
});

export const getTimesheetForProfileForWeek = asyncHandler(
  async (req, res, next) => {
    const { weekNumber, profileId, tStatus, year } = req.query;

    // @ts-ignore
    if (!tStatus in Status)
      return next(new ErrorResponse(`Status not valid`, 400));

    let timesheetData = await TimeSheet.aggregate([
      { $match: { profileId: mongoose.Types.ObjectId(profileId) } },
      { $match: { year: `${year}` } },
      { $match: { weekNumber: Number(weekNumber) } },
      {
        $project: {
          $id: 1,
          year: 1,
          weekNumber: 1,
          profileId: 1,
          employeeId: 1,
          projectId: 1,
          data: { $arrayElemAt: ['$data', -1] },
        },
      },
      { $match: { 'data.status': tStatus } },
    ]);

    if (!timesheetData.length)
      return next(
        new ErrorResponse(
          `No timesheet data found for week ${weekNumber}`,
          400,
        ),
      );

    timesheetData = timesheetData[0];

    let hrs = 0;
    timesheetData.data.tasks.forEach((w) => {
      hrs += getHrs(w.weekData);
    });

    const promiseArr = [
      Profile.populate(timesheetData, { path: 'profileId' }),
      EmployeeSchema.populate(timesheetData, { path: 'employeeId' }),
      Project.populate(timesheetData, { path: 'projectId' }),
    ];

    await Promise.all(promiseArr);

    res.status(200).json({
      success: true,
      message: 'All timesheets fetched',
      timesheetData,
      hrs,
    });
  },
);

export const generatePdf = asyncHandler(async (req, res, next) => {
  const { timesheetArr } = req.body;

  const timesheetData = await TimeSheet.find({ _id: { $in: timesheetArr } })
    .populate('profileId', 'firstname lastname profileName')
    .populate('clientId', 'client_name')
    .populate('vendorId', 'vendor_name')
    .populate('projectId')
    .lean();

  if (!timesheetData.length)
    return next(
      new ErrorResponse(`No timesheet data found for given ids`, 400),
    );

  const allTimesheetData: any = [];

  for (const timesheet of timesheetData) {
    const lastVer = timesheet.data[timesheet.data.length - 1];
    let hrs = 0;
    let weekArr;
    // const allTasksData = {};

    // let projectManagerId: any = JSON.stringify(timesheet.projectId);
    // projectManagerId = JSON.parse(projectManagerId);
    // console.log(projectManagerId.project_manager_user);
    //

    let clientName = 'NA';

    if (timesheet.clientId) {
      clientName = timesheet.clientId['client_name'];
    }

    let vendorName = 'NA';

    if (timesheet.vendorId) {
      vendorName = timesheet.vendorId['vendor_name'];
    }

    let projectId = 'NA';
    let projectManagerData = {};
    let projectName = 'NA';

    if (timesheet.projectId) {
      const projectManagerId = timesheet.projectId.project_manager_user.oid;

      projectManagerData = await User.findById(
        projectManagerId,
        'firstName lastName',
      ).lean();

      projectId = timesheet.projectId['numeric_id'];
      projectName = timesheet.projectId['project_name'];
    }

    const allTasksData = lastVer.tasks[0];
    delete allTasksData.weekData['$init'];
    hrs = getHrs(allTasksData.weekData);

    // lastVer.tasks.forEach((d) => {
    //   delete d.weekData['$init'];
    //   const tasksData: any = [];
    //   weekArr = Object.keys(d.weekData);
    //   weekArr.forEach((w) => {
    //     tasksData.push({
    //       hrs: d.weekData[w].hrs,
    //       date: moment(d.weekData[w].date).format('YYYY-MM-DD'),
    //       comments: d.weekData[w].comments,
    //     });
    //   });
    //   hrs = getHrs(d.weekData);
    //   allTasksData[d.taskName] = { hrs, tasksData };
    // });

    let profileData: any = JSON.stringify(timesheet.profileId);
    profileData = JSON.parse(profileData);

    const data = {
      weekNumber: timesheet.weekNumber,
      clientName,
      vendorName,
      projectName,
      projectId,
      year: timesheet.year,
      status: lastVer.status,
      updateDate: moment(lastVer.updateDate).format('YYYY-MM-DD'),
      hrs,
      name: `${profileData.firstname} ${profileData.lastname}`,
      profileName: profileData.profileName,
      allTasksData,
      id: lastVer.id,
      projectManagerData,
      suggestion: lastVer.suggestion || '',
    };

    let lastAppr: any = new Date(timesheet.lastApproved);

    if (isNaN(lastAppr)) {
      data['lastApproved'] = 'NA';
    } else {
      data['lastApproved'] = moment(lastAppr).format('YYYY-MM-DD');
    }

    allTimesheetData.push(data);
  }

  res.status(200).json({
    message: 'Timesheet data fetched',
    success: true,
    // data,
    allTimesheetData,
  });
});

export const getTimesheetsForVendor = asyncHandler(async (req, res, next) => {
  const { vendorId, weekNumber, year } = req.query;

  if (isYearInvalid(year))
    return next(new ErrorResponse('The year provided is invalid', 400));

  const data = await TimeSheet.find({ vendorId, weekNumber, year }).populate(
    'profileId',
    'firstname lastname email mobile',
  );

  res.status(200).json({
    success: true,
    message: 'All timesheets fetched',
    data,
  });
});

export const getInvoiceData = asyncHandler(async (req, res) => {
  const employeeProfiles = await Profile.find({}).lean();

  const vendors = {};

  for (let employee of employeeProfiles) {
    let vendorId = employee?.vendor?.oid;

    if (vendorId) {
      let profileId = employee._id;

      let vendor = await Vendor.findById(vendorId).lean();
      let clientId = vendor.client.oid;

      let client = await Client.findById(clientId).lean();
      employee.profileId = profileId;

      if (vendorId in vendors) {
        vendors[vendorId]['employees'].push(employee);
      } else {
        vendors[vendorId] = {
          ...vendor,
          client,
          employees: [employee],
        };
      }
    }
  }

  const data: any = [];
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  for (let vendor in vendors) {
    let grandTotal = 0;
    let invoiceNumber = await getNextSequenceValue('invoiceNumber');
    let employees: any = [];

    for (let employee of vendors[vendor].employees) {
      const profileId = employee.profileId;
      const tStatus = 'APPROVED';
      const weeksArr = [6, 7];

      const timesheetData = await TimeSheet.aggregate([
        { $match: { profileId: mongoose.Types.ObjectId(profileId) } },
        { $match: { year: `${year}` } },
        { $match: { weekNumber: { $in: weeksArr } } },
        {
          $project: {
            $id: 1,
            year: 1,
            weekNumber: 1,
            startDate: 1,
            endDate: 1,
            data: { $arrayElemAt: ['$data', -1] },
          },
        },
        { $match: { 'data.status': tStatus } },
      ]);

      let empWeekInfo: any = [];
      let totalHrs = 0;

      timesheetData.forEach((timesheet) => {
        totalHrs = 0;

        timesheet.data.tasks.forEach((w) => {
          totalHrs += getHrs(w.weekData);
        });

        let { startDate, endDate } = timesheet;

        const name = employee.firstname || 'alpha';
        const workOrderRate = Math.floor(Math.random() * 9000) + 1000;

        startDate = `${new Date(startDate).getDate()}/${new Date(
          startDate,
        ).getMonth()}/${new Date(startDate).getFullYear()}`;

        endDate = `${new Date(endDate).getDate()}/${new Date(
          endDate,
        ).getMonth()}/${new Date(endDate).getFullYear()}`;

        let totalAmount = workOrderRate * totalHrs;
        grandTotal += totalAmount;

        let empObj = {
          _id: employee._id,
          name,
          totalHrs,
          workOrderRate,
          totalAmount: totalAmount.toLocaleString('en-IN'),
          startDate,
          endDate,
        };

        empWeekInfo.push(empObj);
      });

      employees = [...employees, ...empWeekInfo];
    }

    data.push({
      employees,
      vendor: vendors[vendor],
      grandTotal: grandTotal.toLocaleString('en-IN'),
      invoiceNumber,
    });
  }
  res.status(200).json({
    success: true,
    message: 'All invoice data fetched',
    data,
  });
});
