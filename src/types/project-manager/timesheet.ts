import moment from 'moment';

export type DayType = {
  hrs?: number;
  comments?: string;
  date?: string;
  active?: number;
  day?: string;
};

export type WeekType = {
  Sun: DayType;
  Mon: DayType;
  Tue: DayType;
  Wed: DayType;
  Thu: DayType;
  Fri: DayType;
  Sat: DayType;
};

export type TimesheetTaskType = {
  taskId: string;
  taskName: string;
  weekData: WeekType;
};

export type DefaultTaskType = {
  taskName: string;
  weekData: WeekType;
};

export enum ApprovalStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  AMENDED = 'AMENDED',
}

export type DisplayTimesheetTaskType = {
  timesheetId: string;
  taskId: string;
  taskName: string;
  week: WeekType;
  startDate: Date;
  endDate: Date;
  approvalStatus: string | undefined;
};

export type TimesheetType = {
  _id: string;
  data: TimeSheetDataType[];
};

export type VATimesheetType = {
  _id: string;
  data: VATimeSheetDataType[];
};

export type TimeSheetDataType = {
  tasks: TimesheetTaskType[];
  _id: string | undefined;
  suggestion?: string;
  status: string;
  weekNumber: number;
  year: string;
  projectId?: string;
  employeeId?: string;
  id: string;
};

export type VAEmpTimeSheetDataType = {
  tasks: TimesheetTaskType[];
  _id: string;
  suggestion?: string;
  status: string;
  id: string;
};

export type VATimeSheetDataType = {
  _id: string;
  weekNumber: number;
  year: string;
  data: VAEmpTimeSheetDataType[];
  profileId: ProfileIdType;
  vendorId: string;
  clientId: string;
  projectId: string;
  employeeId: string;
};

export type ProfileIdType = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
};

export type TaskType = {
  _id: string;
  startDate: string;
  endDate: string;
  startWeek: number;
  endWeek: number;
  year: string;
  taskName: string;
  taskDesc: string;
  projectId: string;
  weekNumbers: number[];
};

export type AddTaskType = {
  taskName: string;
  startDate: string;
  endDate: string;
  startWeek: number;
  endWeek: number;
  taskDesc: string;
  projectId: string;
  year: string;
};

/**
 *  getAllTaskWeekNumber( projectId, tasks);
 *  state
 *  if(projectId === currentProjectId);
 *
 */

export type TaskWeekNumber = {
  task: TimesheetTaskType;
  taskDetails: TaskType;
  weekNumber: number[];
};

export type WeekPickerDataType = {
  weekDisplay?: string[];
  weekDates?: string[];
  weekNumber?: number;
  month?: string;
  year?: string;
};

export type ProjectType = {
  id: string;
  projectName: string;
  numeric_id: number;
  startDate?: string;
  endDate?: string;
};

export type EmployeeType = {
  id?: string;
  employee_id?: number;
  user?: {
    username?: string;
  };
  project?: {
    id?: string;
  };
  profile?: {
    firstname: string;
    lastname: string;
    doj: string;
    email: string;
    experience: number;
    location: string;
    mobile: string;
  };
};

// State for the UI

export const defaultDayData: DayType = {
  hrs: 0,
  comments: '',
  date: '',
  active: 0,
  day: '',
};

export const defaultWeekData: WeekType = {
  Sun: defaultDayData,
  Mon: defaultDayData,
  Tue: defaultDayData,
  Wed: defaultDayData,
  Thu: defaultDayData,
  Fri: defaultDayData,
  Sat: defaultDayData,
};

export const defaultTimesheetTaskData: TimesheetTaskType = {
  taskId: '',
  weekData: defaultWeekData,
  taskName: '',
};

export const addTaskDefaultData: AddTaskType = {
  taskName: '',
  startDate: moment(new Date()).format('YYYY-MM-DD'),
  endDate: moment(new Date()).format('YYYY-MM-DD'),
  endWeek: moment(new Date()).week(),
  startWeek: moment(new Date()).week(),
  taskDesc: '',
  year: moment(new Date()).year().toString(),
  projectId: '',
};
