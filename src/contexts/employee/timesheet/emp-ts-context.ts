import { createContext, Dispatch, SetStateAction } from 'react';
import { EmployeeDetailsType } from 'src/types/employee/onboarding';
import { NotificationType } from 'src/types/project-manager/demand';
import {
  DefaultTaskType,
  TaskType,
  TimeSheetDataType,
  TimesheetTaskType,
} from 'src/types/project-manager/timesheet';

type EMPTimesheetContextDataType = {
  isLoading: boolean;
  loading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  employeeDetails: EmployeeDetailsType;
  timesheetId: string | undefined;
  timesheetList: TimeSheetDataType[];
  allNotifications: NotificationType[];
  getAllNotifications: () => Promise<void>;
  notificationRead: (id: any, userId: any) => Promise<void>;
  fetchAllTimesheet: (projectId: string) => Promise<void>;
  fetchAllTasks: (projectId: string) => Promise<void>;
  setSelectedWeekData: React.Dispatch<
    React.SetStateAction<{
      weekNumber: number;
      month: string;
      year: string;
      weekDates: string[];
      weekDisplay: string[];
    }>
  >;
  selectedWeekData: {
    weekNumber: number;
    month: string;
    year: string;
    weekDates: string[];
    weekDisplay: string[];
  };
  handleSaveOrApprove: (
    newStatus: string,
    action: string,
    suggestion?: string,
  ) => Promise<void>;
  handleAdjust: (tasks: TimesheetTaskType[]) => Promise<void>;
  handleSubmit: (tasks: DefaultTaskType[]) => Promise<void>;
  projectId: string | undefined;
  allTasks: TaskType[];
  downloadTimesheet: (timesheetArr: any) => Promise<void>;
};

export const empTimesheetContextDefault: EMPTimesheetContextDataType = {
  isLoading: false,
  employeeDetails: {
    employee_id: '',
    profile: {
      email: '',
      doj: '',
      firstname: '',
      lastname: '',
    },
    project: {
      project_manager_user: {
        firstname: '',
        lastname: '',
        email: '',
      },
    },
    user: {
      roles: [
        {
          role_name: '',
        },
      ],
    },
  },
  loading: false,
  setIsLoading: () => false,
  timesheetId: '',
  timesheetList: [],
  allNotifications: [],
  getAllNotifications: () => Promise.resolve(),
  notificationRead: (id: any, userId: any) => Promise.resolve(),
  fetchAllTimesheet: (projectId: string) => Promise.resolve(),
  fetchAllTasks: (projectId: string) => Promise.resolve(),
  setSelectedWeekData: () => {},
  selectedWeekData: {
    weekNumber: 0,
    month: '',
    year: '',
    weekDates: [''],
    weekDisplay: [''],
  },
  handleSaveOrApprove: () => Promise.resolve(),
  handleAdjust: () => Promise.resolve(),
  handleSubmit: () => Promise.resolve(),
  projectId: '',
  allTasks: [],
  downloadTimesheet: (timesheetArr: any) => Promise.resolve(),
};

const EMPTimesheetContext = createContext<EMPTimesheetContextDataType>(
  empTimesheetContextDefault,
);

export default EMPTimesheetContext;
