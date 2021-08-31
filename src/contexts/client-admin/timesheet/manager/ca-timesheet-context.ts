import { createContext, Dispatch, SetStateAction } from 'react';
import {
  EmployeeType,
  ProjectType,
  TaskType,
  TimeSheetDataType,
  TimesheetTaskType,
  AddTaskType,
  VATimesheetType,
  VATimeSheetDataType,
} from '../../../../types/project-manager/timesheet';

type CATimesheetContextDataType = {
  taskState: AddTaskType[];
  createTask: () => Promise<void | boolean | null | undefined>;
  selectedProject: ProjectType;
  setSelectedProject: Dispatch<SetStateAction<ProjectType>>;
  isLoading: boolean;
  loading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  getProjects: (clientId, userId) => Promise<void>;
  allProjects: ProjectType[];
  addNewTask: () => void;
  deleteCurrentTask: (index: any) => void;
  currentEmployeeData: EmployeeType | undefined;
  setTaskState: Dispatch<SetStateAction<AddTaskType[]>>;
  employeeList: EmployeeType[];
  allTasks: TaskType[];
  timesheetList: TimeSheetDataType[];
  vaTimesheetList: VATimeSheetDataType[];
  downloadTimesheet: (timesheetId: any) => Promise<void>;
  fetchAllTimesheet: (employeeId: string) => Promise<void>;
  fetchAllTasks: () => Promise<void>;
  fetchTasksAndTimehseets: () => Promise<void>;
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
  handleNewTaskChange: (value: any, name: any, index: any) => void;
  handleAdjust: (tasks: TimesheetTaskType[]) => Promise<void>;
  // fetchAllVATimesheet: (vendorId: string) => Promise<void>;
  setEmpId: React.Dispatch<React.SetStateAction<String>>;
};

export const caTimesheetContextDefault: CATimesheetContextDataType = {
  createTask: () => Promise.resolve(false),
  isLoading: false,
  loading: false,
  setIsLoading: () => false,
  selectedProject: {
    id: '',
    projectName: '',
    numeric_id: 0,
  },
  setSelectedProject: () => {},
  currentEmployeeData: undefined,
  allProjects: [],
  getProjects: () => Promise.resolve(),
  addNewTask: () => null,
  deleteCurrentTask: () => null,
  taskState: [],
  setTaskState: () => [],
  employeeList: [],
  allTasks: [],
  timesheetList: [],
  vaTimesheetList: [],
  downloadTimesheet: () => Promise.resolve(),
  fetchAllTimesheet: () => Promise.resolve(),
  fetchAllTasks: () => Promise.resolve(),
  setSelectedWeekData: () => {},
  fetchTasksAndTimehseets: () => Promise.resolve(),
  selectedWeekData: {
    weekNumber: 0,
    month: '',
    year: '',
    weekDates: [''],
    weekDisplay: [''],
  },
  handleSaveOrApprove: () => Promise.resolve(),
  handleNewTaskChange: () => null,
  handleAdjust: () => Promise.resolve(),
  // fetchAllVATimesheet: () => Promise.resolve(),
  setEmpId: () => '',
};

const CATimesheetContext = createContext<CATimesheetContextDataType>(
  caTimesheetContextDefault,
);

export default CATimesheetContext;
