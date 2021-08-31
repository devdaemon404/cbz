import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { OPToast } from 'src/utils/op-toast';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import { OPHttpClient } from 'src/utils/op-http-client';
import { PMTimesheetApiService } from 'src/apis/project-manager/pm-timesheet-api-service';
import { EMPTimesheetApiService } from 'src/apis/employee/emp-timesheet-api-service';
import {
  addTaskDefaultData,
  AddTaskType,
  EmployeeType,
  ProjectType,
  TimeSheetDataType,
  VATimeSheetDataType,
  TaskType,
} from 'src/types/project-manager/timesheet';
import VATimesheetContext from './va-ts-context';

const VATimesheetState = (props) => {
  // API URLs
  const v1URL = 'https://test.app.cloudsbuzz.in/apis/v1/';
  const v2URL = `${process.env.V2_API_URL}/api/v2`;

  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Project Manager Timesheet Management',
  });
  const httpClientV2 = OPHttpClient.init(v2URL, {
    action: 'Project Manager Timesheet Management',
  });

  // For calling V1 API
  const _apiServiceV1 = new PMTimesheetApiService(httpClientV1);
  // For calling V2 API
  const _apiServiceV2 = new PMTimesheetApiService(httpClientV2);
  // For employee API
  const _empApiServiceV2 = new EMPTimesheetApiService(httpClientV2);

  const projectId = '5fed744c2187ce7aae6cd86b';
  const clientId = props.clientId;
  const userId = props.userId;
  // let empId = '5ff740287cf66c42cc7f852c';
  const [empId, setEmpId] = useState<String>('');

  _apiServiceV1.setClientId(clientId);
  _apiServiceV1.setUserId(userId);
  _apiServiceV1.setProjectId(projectId);
  // Employee
  _empApiServiceV2.setProjectId(projectId);
  _empApiServiceV2.setEmpId(empId as string);

  // console.log('EMPLOYEE ID', empId);

  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType>({
    id: '123',
    projectName: '',
    numeric_id: 0,
    startDate: '',
    endDate: '',
  });

  const getProjects = async (clientId, userId) => {
    _apiServiceV1.setClientId(clientId);
    _apiServiceV1.setUserId(userId);
    const res = await _apiServiceV1.fetchAllProjects();
    if (res) setAllProjects([...res]);
  };

  // Instantiate an API Service
  // For Loading Indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * State for creating a task ***************************************************************************************************
   */
  const [taskState, setTaskState] = useState<AddTaskType[]>([
    addTaskDefaultData,
  ]);

  /**
   * Create a task
   *
   */
  const addNewTask = () => {
    setTaskState([...taskState, addTaskDefaultData]);
  };

  const deleteCurrentTask = (index) => {
    const tempTasks = taskState.filter((task, id) => id !== index);
    setTaskState(tempTasks);
  };

  const createTask = async () => {
    setIsLoading(true);
    taskState.map((task) => {
      if (task.taskName.trim().length === 0) {
        OPToast.show('There is no description.');
        setIsLoading(false);
        return;
      }
    });
    _apiServiceV2.setProjectId(projectId);
    const res = await _apiServiceV2.createTasks([...taskState]);
    setTaskState([addTaskDefaultData]);
    setIsLoading(false);
    return res;
  };

  /**
   * State for approving and showing timesheet ***********************************************************************************
   */

  //Get All Employee under particular project.
  const [employeeList, setEmployeeList] = useState<EmployeeType[]>([]);
  // All the timesheet for the employee for current year
  const [timesheetList, setTimesheetList] = useState<TimeSheetDataType[]>([]);
  const [vaTimesheetList, setVATimesheetList] = useState<VATimeSheetDataType[]>(
    [],
  );

  const [timesheetId, setTimesheetId] = useState<string>();
  // All the task for the current project
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);

  // const [displayTasks, setDisplayTasks] = useState<any[]>([]);
  const [selectedVAWeekData, setSelectedVAWeekData] = useState(
    getWeekData(new Date(), 7),
  );

  // Selected Week Data
  const { weekNumber, year } = selectedVAWeekData;

  // const [isEditable, setIsEditable] = useState<boolean>(false);

  // Get all employees
  const getEmployeeList = async (userId) => {
    setIsLoading(true);
    _apiServiceV1.setUserId(userId);
    const res = await _apiServiceV1.fetchAllEmployees();
    if (res) setEmployeeList([...res]);
    setIsLoading(false);
  };
  const getVAEmployeeList = async () => {
    _apiServiceV1.setVendorId(userId);
    const res = await _apiServiceV1.fetchAllVAEmployees();
    if (res) setEmployeeList([...res]);
  };

  // Ftech all tasks for the current project.
  const fetchAllTasks = async (projectId: string) => {
    setIsLoading(true);
    _apiServiceV2.setProjectId(projectId);

    // const _projectId = selectedProject.id;
    const data = { weekNumber, year };
    const res = await _apiServiceV2.fetchAllTasks(data);
    if (res) {
      // @ts-ignore
      setAllTasks(res);
    }
    setIsLoading(false);
  };
  // Fetch all timesheets
  const fetchAllTimesheet = async (projectId: string, employeeId: string) => {
    setIsLoading(true);
    // setTimesheetList([]);
    _apiServiceV2.setProjectId(projectId);
    _apiServiceV2.setEmpId(employeeId);
    setEmpId(employeeId);
    const data = { weekNumber, year };
    const res = await _apiServiceV2.fetchAllTimeSheet(data);
    // console.table(res);
    if (res) {
      setTimesheetId(res._id);
      setTimesheetList([...res.data]);
    } else {
      setTimesheetList([]);
    }
    setIsLoading(false);
  };

  // change status of timesheet and ajust new version only for employee side
  const handleSaveOrApprove = async (newStatus, action, suggestion) => {
    setIsLoading(true);
    let body;
    if (action === 'amd') {
      body = {
        suggestion,
        newStatus,
        action,
      };
    } else {
      body = {
        newStatus,
        action,
      };
    }
    console.log('BODY', JSON.stringify(body), 'TIMESHEETID', timesheetId);
    _apiServiceV2.setTimesheetId(timesheetId as string);
    await _apiServiceV2.updatePmTimeSheetStatus(body);
    // fetchAllTimesheet(empId as string);
    setIsLoading(false);
  };

  // update a timesheet
  const handleAdjust = async (tasks) => {
    setIsLoading(true);
    const body = {
      tasks,
      weekNumber,
      year,
    };
    console.log('BODY', JSON.stringify(body), 'TIMESHEETID', timesheetId);
    _apiServiceV2.setTimesheetId(timesheetId as string);
    await _apiServiceV2.updateEmployeeTimeSheet(body);
    // fetchAllTimesheet(empId as string);
    setIsLoading(false);
  };

  // create a timesheet
  const handleSubmit = async (tasks) => {
    setIsLoading(true);
    const employeeId = empId;
    const body = {
      tasks,
      weekNumber,
      year,
      projectId,
      employeeId,
    };
    console.log('BODY', JSON.stringify(body), 'TIMESHEETID', timesheetId);
    await _empApiServiceV2.createTimeSheet(body);
    // fetchAllTimesheet(empId as string);
    setIsLoading(false);
  };

  /**
   *  TO REMOVE HARD CODED INITIAL PROJECT.
   */
  const setInitialProject = () => {
    const project = allProjects.find((project) => project.id === projectId);
    if (project) setSelectedProject(project);
  };

  const getEmployeesAndProjects = async (clientId, userId) => {
    setLoading(true);
    await getProjects(clientId, userId);
    await setInitialProject();
    await getEmployeeList(userId);
    setLoading(false);
  };

  // Employee Id : 5ff740287cf66c42cc7f852c
  // Client Id : 5f896ed0e5daed54edb656de
  // User Id : 5f896f9ee5daed54edb656e0
  // Project Id: 5fed744c2187ce7aae6cd86b

  const fetchAllVATimesheet = async (vendorId) => {
    setIsLoading(true);
    _apiServiceV2.setVendorId(vendorId);
    const res = await _apiServiceV2.fetchAllVATimesheet({ weekNumber, year });
    if (res) setVATimesheetList(res);
    // await getProjects('5f896ed0e5daed54edb656de', '5f896f9ee5daed54edb656e0');
    // await setInitialProject();
    // await getVAEmployeeList();
    setIsLoading(false);
  };

  const downloadTimesheet = async (timesheetArr) => {
    console.log(timesheetArr);
    const body = {
      timesheetArr,
    };
    setIsLoading(true);
    const res = await _apiServiceV2.downloadTimesheet(body);
    if (res) {
      console.log('Successfully Downloaded');
    }
    setIsLoading(false);
  };
  const fetchTasksAndTimehseets = async () => {
    // await fetchAllTasks();
    // if (empId !== '') await fetchAllTimesheet(empId as string);
  };

  const handleNewTaskChange = (value, name, index) => {
    const newTaskState: AddTaskType[] = taskState.map((task, id) => {
      if (id === index) {
        if (name === 'taskName' || name === 'taskDesc')
          return {
            ...task,
            [name]: value,
            projectId: '5fed744c2187ce7aae6cd86b',
          };
        if (name === 'startDate')
          return {
            ...task,
            [name]: moment(value).format('YYYY-MM-DD'),
            year: moment(value).year().toString(),
            startWeek: moment(value).week(),
          };
        if (name === 'endDate')
          return {
            ...task,
            [name]: moment(value).format('YYYY-MM-DD'),
            endWeek: moment(value).week(),
          };
      }
      return task;
    });
    setTaskState(newTaskState);
  };

  useEffect(() => {
    fetchAllVATimesheet(userId);
  }, [weekNumber, year]);

  // useEffect(() => {
  // if (clientId || userId !== undefined)
  //   getEmployeesAndProjects(clientId, userId);
  //   fetchAllVATimesheet(userId);
  // }, []);

  return (
    <VATimesheetContext.Provider
      value={{
        isLoading,
        empId,
        loading,
        setIsLoading,
        downloadTimesheet,
        employeeList,
        vaTimesheetList,
        allTasks,
        fetchAllTimesheet,
        fetchAllTasks,
        setSelectedVAWeekData,
        selectedVAWeekData,
        handleSaveOrApprove,
        handleNewTaskChange,
        handleAdjust,
        handleSubmit,
        fetchAllVATimesheet,
        setEmpId,
      }}>
      {props.children}
    </VATimesheetContext.Provider>
  );
};

export default VATimesheetState;
