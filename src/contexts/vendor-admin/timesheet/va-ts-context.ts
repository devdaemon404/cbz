import { createContext, Dispatch, SetStateAction } from 'react';
import {
  EmployeeType,
  TimesheetTaskType,
  VATimeSheetDataType,
  TaskType,
} from 'src/types/project-manager/timesheet';

type VATimesheetContextDataType = {
  isLoading: boolean;
  loading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;

  employeeList: EmployeeType[];
  allTasks: TaskType[];
  vaTimesheetList: VATimeSheetDataType[];
  downloadTimesheet: (timesheetId: any) => Promise<void>;
  fetchAllTimesheet: (projectId: string, employeeId: string) => Promise<void>;
  fetchAllTasks: (projectId: string) => Promise<void>;
  setSelectedVAWeekData: React.Dispatch<
    React.SetStateAction<{
      weekNumber: number;
      month: string;
      year: string;
      weekDates: string[];
      weekDisplay: string[];
    }>
  >;
  empId: String;
  selectedVAWeekData: {
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
  handleNewTaskChange: (value: any, name: any, index: any) => void;
  handleAdjust: (tasks: TimesheetTaskType[]) => Promise<void>;
  handleSubmit: (tasks: TimesheetTaskType[]) => Promise<void>;
  fetchAllVATimesheet: (vendorId: string) => Promise<void>;
  setEmpId: React.Dispatch<React.SetStateAction<String>>;
};

export const vaTimesheetContextDefault: VATimesheetContextDataType = {
  isLoading: false,
  loading: false,
  setIsLoading: () => false,

  employeeList: [],
  allTasks: [],
  vaTimesheetList: [],
  downloadTimesheet: () => Promise.resolve(),
  fetchAllTimesheet: () => Promise.resolve(),
  fetchAllTasks: () => Promise.resolve(),
  setSelectedVAWeekData: () => {},
  selectedVAWeekData: {
    weekNumber: 0,
    month: '',
    year: '',
    weekDates: [''],
    weekDisplay: [''],
  },
  empId: '',
  handleSaveOrApprove: () => Promise.resolve(),
  handleNewTaskChange: () => null,
  handleAdjust: () => Promise.resolve(),
  handleSubmit: () => Promise.resolve(),
  fetchAllVATimesheet: () => Promise.resolve(),
  setEmpId: () => '',
};

const VATimesheetContext = createContext<VATimesheetContextDataType>(
  vaTimesheetContextDefault,
);

export default VATimesheetContext;
