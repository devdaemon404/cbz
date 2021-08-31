import React, { useEffect, useState } from 'react';
import MGRTimesheetContext from './mgr-timesheet-context';
import {
  TimeSheetDataType,
  EmployeeType,
  TaskType,
  ProjectType,
  AddTaskType,
  addTaskDefaultData,
  VATimeSheetDataType,
} from '../../../../types/project-manager/timesheet';
import moment from 'moment';
import { OPHttpClient } from '../../../../utils/op-http-client';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import { PMTimesheetApiService } from '../../../../apis/project-manager/pm-timesheet-api-service';
import { EMPTimesheetApiService } from '../../../../apis/employee/emp-timesheet-api-service';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import { clear } from 'winston';

const MGRTimesheetState = (props) => {
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

  const clientId = props.clientId;
  const userId = props.userId;
  const [empId, setEmpId] = useState<String>('');

  const [selectedProject, setSelectedProject] = useState<ProjectType>({
    id: '',
    projectName: '',
    numeric_id: 0,
    startDate: '',
    endDate: '',
  });
  _apiServiceV1.setClientId(clientId);
  _apiServiceV1.setUserId(userId);
  _apiServiceV1.setProjectId(selectedProject.id);
  // Employee
  _empApiServiceV2.setProjectId(selectedProject.id);
  _empApiServiceV2.setEmpId(empId as string);

  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
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
    const tempTasks = taskState.filter((_, id) => id !== index);
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
    _apiServiceV2.setProjectId(selectedProject.id);
    const res = await _apiServiceV2.createTasks([...taskState]);
    setTaskState([addTaskDefaultData]);
    fetchAllTasks();
    setIsLoading(false);
    return res;
  };

  /**
   * State for approving and showing timesheet ***********************************************************************************
   */

  //Get All Employee under particular project.
  const [employeeList, setEmployeeList] = useState<EmployeeType[]>([]);
  const [currentEmployeeData, setCurrentEmployeeData] = useState<
    EmployeeType | undefined
  >();
  const [selectedEmployeeList, setSelectedEmployeeList] = useState<
    EmployeeType[]
  >([]);
  // All the timesheet for the employee for current year
  const [timesheetList, setTimesheetList] = useState<TimeSheetDataType[]>([]);
  const [vaTimesheetList, setVATimesheetList] = useState<VATimeSheetDataType[]>(
    [],
  );

  const [timesheetId, setTimesheetId] = useState<string>();
  // All the task for the current project
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);

  // const [displayTasks, setDisplayTasks] = useState<any[]>([]);
  const [selectedWeekData, setSelectedWeekData] = useState(
    getWeekData(new Date(), 7),
  );

  // Selected Week Data
  const { weekNumber, year } = selectedWeekData;

  // const [isEditable, setIsEditable] = useState<boolean>(false);

  // Get all employees
  const getEmployeeList = async (userId) => {
    setIsLoading(true);
    _apiServiceV1.setUserId(userId);
    const res = await _apiServiceV1.fetchAllEmployees();
    if (res) await setEmployeeList([...res]);
    setIsLoading(false);
  };

  // const getVAEmployeeList = async (vendorId) => {
  //   _apiServiceV1.setVendorId(vendorId);
  //   const res = await _apiServiceV1.fetchAllVAEmployees();
  //   if (res) setEmployeeList([...res]);
  // };

  // Ftech all tasks for the current project.
  const fetchAllTasks = async () => {
    setIsLoading(true);
    // console.log({ selectedProject });
    _apiServiceV2.setProjectId(selectedProject.id);

    const data = { weekNumber, year };
    const res = await _apiServiceV2.fetchAllTasks(data);
    if (res) {
      setAllTasks(res);
    }
    setIsLoading(false);
  };
  // Fetch all timesheets
  const fetchAllTimesheet = async (employeeId: string) => {
    setIsLoading(true);
    // setTimesheetList([]);
    _apiServiceV2.setEmpId(employeeId);
    setEmpId(employeeId);
    const data = { weekNumber, year, projectId: selectedProject.id };
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
    if (action === 'amd') {
      await _apiServiceV1.sendTimesheetNotification(
        'TIME_SHEET_AMEND_REQUEST',
        empId as string,
      );
    } else {
      await _apiServiceV1.sendTimesheetNotification(
        'TIME_SHEET_APPROVED',
        empId as string,
      );
    }
    fetchAllTimesheet(empId as string);
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
    // console.log('BODY', JSON.stringify(body), 'TIMESHEETID', timesheetId);
    _apiServiceV2.setTimesheetId(timesheetId as string);
    await _apiServiceV2.updateEmployeeTimeSheet(body);
    await _apiServiceV1.sendTimesheetNotification(
      'TIME_SHEET_ADJUST',
      empId as string,
    );
    fetchAllTimesheet(empId as string);
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
      projectId: selectedProject.id,
      employeeId,
    };
    // console.log('BODY', JSON.stringify(body), 'TIMESHEETID', timesheetId);
    await _empApiServiceV2.createTimeSheet(body);
    fetchAllTimesheet(empId as string);
    setIsLoading(false);
  };

  /**
   *  TO REMOVE HARD CODED INITIAL PROJECT.
   */
  // const setInitialProject = () => {
  //   const project = allProjects.find(
  //     (project) => project.id === selectedProject.id,
  //   );
  //   if (project) setSelectedProject(project);
  // };

  const getEmployeesAndProjects = async (clientId, userId) => {
    setLoading(true);
    await getProjects(clientId, userId);
    await getEmployeeList(userId);
    setLoading(false);
  };

  const getEmployeeOfSelectedProject = async (userId) => {
    setLoading(true);
    // console.log({ employeeList });
    const newEmployeeList = employeeList.filter((employee) => {
      return employee.project?.id === selectedProject.id;
    });
    setSelectedEmployeeList(newEmployeeList);
    setLoading(false);
  };

  // Employee Id : 5ff740287cf66c42cc7f852c
  // Client Id : 5f896ed0e5daed54edb656de
  // User Id : 5f896f9ee5daed54edb656e0
  // Project Id: 5fed744c2187ce7aae6cd86b

  // const fetchAllVATimesheet = async (vendorId) => {
  //   setIsLoading(true);
  //   _apiServiceV2.setVendorId(vendorId);
  //   const res = await _apiServiceV2.fetchAllVATimesheet({ weekNumber, year });
  //   if (res) setVATimesheetList(res);
  //   await getProjects('5f896ed0e5daed54edb656de', '5f896f9ee5daed54edb656e0');
  //   await setInitialProject();
  //   await getVAEmployeeList(vendorId);

  //   setIsLoading(false);
  // };

  const downloadTimesheet = async (timesheetArr) => {
    // console.log(timesheetArr);
    const body = {
      timesheetArr,
    };
    setIsLoading(true);
    const res = await _apiServiceV2.downloadTimesheet(body);
    if (res) {
      // console.log('Successfully Downloaded');
    }
    setIsLoading(false);
  };

  const fetchTasksAndTimehseets = async () => {
    // await fetchAllTasks();
    if (empId !== '') await fetchAllTimesheet(empId as string);
  };

  const handleNewTaskChange = (value, name, index) => {
    if (selectedProject.id === '123') {
      OPToast.show(`Please Select a Project.`, {
        variant: ToastVariant.ERROR,
      });
      return;
    }
    const newTaskState: AddTaskType[] = taskState.map((task, id) => {
      if (id === index) {
        if (name === 'taskName' || name === 'taskDesc')
          return {
            ...task,
            [name]: value,
            // projectId: '5fed744c2187ce7aae6cd86b',
            projectId: selectedProject.id,
          };
        if (name === 'startDate')
          return {
            ...task,
            [name]: moment(value).format('YYYY-MM-DD'),
            startWeek: moment(value).week(),
          };
        if (name === 'endDate')
          return {
            ...task,
            [name]: moment(value).format('YYYY-MM-DD'),
            year: moment(value).year().toString(),
            endWeek: moment(value).week(),
          };
      }
      return task;
    });
    setTaskState(newTaskState);
  };

  useEffect(() => {
    setIsLoading(true);
    const employee = employeeList.filter(
      (employee) => employee.id === empId,
    )[0];
    setCurrentEmployeeData({ ...employee });
    setIsLoading(false);
  }, [empId]);

  const changeWeekData = async () => {
    setIsLoading(true);
    await setTimesheetList([]);
    await setAllTasks([]);
    // console.log('Selected Week Changed');
    if (selectedProject.id !== '') fetchTasksAndTimehseets();
    setIsLoading(false);
  };

  useEffect(() => {
    changeWeekData();
  }, [weekNumber, year]);

  useEffect(() => {
    // console.log('Initialization');
    if (clientId || userId !== undefined)
      getEmployeesAndProjects(clientId, userId);
  }, []);

  useEffect(() => {
    // console.log('Project or All Employee Changed');
    getEmployeeOfSelectedProject(userId);
  }, [selectedProject, employeeList]);

  return (
    <MGRTimesheetContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        isLoading,
        loading,
        setIsLoading,
        currentEmployeeData,
        getProjects,
        allProjects,
        taskState,
        setTaskState,
        addNewTask,
        deleteCurrentTask,
        downloadTimesheet,
        createTask,
        employeeList: selectedEmployeeList,
        timesheetList,
        vaTimesheetList,
        allTasks,
        fetchAllTimesheet,
        fetchAllTasks,
        setSelectedWeekData,
        selectedWeekData,
        fetchTasksAndTimehseets,
        handleSaveOrApprove,
        handleNewTaskChange,
        handleAdjust,
        handleSubmit,
        // fetchAllVATimesheet,
        setEmpId,
        changeWeekData,
      }}>
      {props.children}
    </MGRTimesheetContext.Provider>
  );
};

export default MGRTimesheetState;
