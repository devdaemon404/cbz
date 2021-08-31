import React, { useEffect, useState } from 'react';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import { OPHttpClient } from 'src/utils/op-http-client';
import { PMTimesheetApiService } from 'src/apis/project-manager/pm-timesheet-api-service';
import { EMPTimesheetApiService } from 'src/apis/employee/emp-timesheet-api-service';
import {
  TaskType,
  TimeSheetDataType,
  TimesheetType,
} from 'src/types/project-manager/timesheet';
import EMPTimesheetContext, {
  empTimesheetContextDefault,
} from './emp-ts-context';
import { NotificationType } from 'src/types/project-manager/demand';
import { EmployeeDetailsType } from 'src/types/employee/onboarding';

const EMPTimesheetState = (props) => {
  const { empId, userId } = props;

  console.log({ userId });
  // API URLs
  const v1URL = `${process.env.V1_API_URL}/apis/v1`;
  // console.log(process.env.V2_API_URL);
  const v2URL = `${process.env.V2_API_URL}/api/v2`;

  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Employee Timesheet Management',
  });
  const httpClientV2 = OPHttpClient.init(v2URL, {
    action: 'Employee Timesheet Management',
  });

  // For calling V1 API
  const _apiServiceV1 = new PMTimesheetApiService(httpClientV1);
  // For calling V2 API
  const _apiServiceV2 = new PMTimesheetApiService(httpClientV2);
  // For employee V2 API
  const _empApiServiceV2 = new EMPTimesheetApiService(httpClientV2);
  // For employee V1 API
  const _empApiServiceV1 = new EMPTimesheetApiService(httpClientV1);

  _apiServiceV2.setEmpId(empId);
  _apiServiceV1.setUserId(userId);
  // Instantiate an API Service
  // For Loading Indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Employee and project state
  const [employeeId, setEmployeeId] = useState<string>(empId);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetailsType>(
    empTimesheetContextDefault.employeeDetails,
  );
  const [projectId, setProjectId] = useState<string>();

  // All the timesheet for the employee for current year
  const [timesheetList, setTimesheetList] = useState<TimeSheetDataType[]>([]);

  const [timesheetId, setTimesheetId] = useState<string>();

  // All the task for the current project
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);

  // const [displayTasks, setDisplayTasks] = useState<any[]>([]);
  const [selectedWeekData, setSelectedWeekData] = useState(
    getWeekData(new Date(), 7),
  );

  // Selected Week Data
  const { weekNumber, year } = selectedWeekData;
  const [allNotifications, setAllNotifications] = useState<NotificationType[]>(
    [],
  );

  // Ftech all tasks for the current project.
  const fetchAllTasks = async (projectId: string) => {
    setIsLoading(true);
    if (projectId) _apiServiceV2.setProjectId(projectId);
    const data = { weekNumber, year };
    const res = await _apiServiceV2.fetchAllTasks(data);
    if (res) {
      // @ts-ignore
      setAllTasks(res);
    }
    setIsLoading(false);
  };
  // Fetch all timesheets
  const fetchAllTimesheet = async (projectId: string) => {
    setIsLoading(true);
    if (projectId) _apiServiceV2.setProjectId(projectId);
    const data = { weekNumber, year };
    const res = await _apiServiceV2.fetchAllEMPTimeSheet(data);
    if (res) {
      setTimesheetId(res._id);
      setTimesheetList([...res.data]);
    } else {
      setTimesheetList([]);
      setTimesheetId(undefined);
    }
    setIsLoading(false);
  };

  // change status of timesheet and ajust new version only for employee side
  const handleSaveOrApprove = async (newStatus, action, suggestion) => {
    setIsLoading(true);
    if (projectId) _apiServiceV2.setProjectId(projectId);

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
    await _empApiServiceV1.sendTimesheetNotification(
      'TIME_SHEET_REJECTED',
      empId,
      userId,
    );
    if (projectId) fetchAllTimesheet(projectId);
    setIsLoading(false);
  };

  // update a timesheet
  const handleAdjust = async (tasks) => {
    setIsLoading(true);
    if (projectId) _apiServiceV2.setProjectId(projectId);
    const body = {
      tasks,
      weekNumber,
      year,
    };
    console.log('BODY', JSON.stringify(body), 'TIMESHEETID', timesheetId);
    _apiServiceV2.setTimesheetId(timesheetId as string);
    await _apiServiceV2.updateEmployeeTimeSheet(body);
    await _empApiServiceV1.sendTimesheetNotification(
      'TIME_SHEET_ADJUST',
      empId,
      userId,
    );
    if (projectId) fetchAllTimesheet(projectId);
    setIsLoading(false);
  };

  // create a timesheet
  const handleSubmit = async (tasks) => {
    setIsLoading(true);
    if (projectId) _apiServiceV2.setProjectId(projectId);

    const body = {
      tasks,
      weekNumber,
      year,
      projectId,
      employeeId,
    };
    console.log('BODY', JSON.stringify(body), 'TIMESHEETID', timesheetId);
    await _empApiServiceV2.createTimeSheet(body);
    if (projectId) fetchAllTimesheet(projectId);
    setIsLoading(false);
  };

  // Employee Props
  const getEmployeeProps = async () => {
    setIsLoading(true);
    setLoading(true);
    _apiServiceV1.setEmpId(employeeId);
    const res = await _apiServiceV1.getEmployeeProps();
    setProjectId(res?.project.id);
    setIsLoading(false);
    setLoading(false);
  };

  const fetchTasksAndTimehseets = async () => {
    if (projectId) await fetchAllTasks(projectId);
    if (projectId) await fetchAllTimesheet(projectId);
  };

  const getAllNotifications = async () => {
    setIsLoading(true);
    console.log('fetching all notiftaion');
    const res = await _empApiServiceV1.getAllNotifications(userId);
    if (res) await setAllNotifications(res);
    console.log('fetched notifcations: ', res);
    setIsLoading(false);
  };

  const notificationRead = async (id, userId) => {
    setIsLoading(true);
    const res = await _empApiServiceV1.notificationRead(id, userId);
    await getAllNotifications();
    setIsLoading(false);
  };

  const getEmployeeDetails = async () => {
    setIsLoading(true);
    const res: any = await _empApiServiceV1.getEmployeeDetails(empId);
    console.log('Employee Details', res);
    if (res) {
      setEmployeeDetails(res);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (projectId !== undefined) fetchTasksAndTimehseets();
  }, [weekNumber, year]);

  useEffect(() => {
    setIsLoading(true);
    setLoading(true);
    getEmployeeProps();
    getEmployeeDetails();
    setIsLoading(false);
    setLoading(false);
  }, []);

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

  // console.log(employeeId, projectId);

  return (
    <EMPTimesheetContext.Provider
      value={{
        isLoading,
        loading,
        employeeDetails,
        timesheetId,
        allNotifications,
        getAllNotifications,
        notificationRead,
        setIsLoading,
        fetchAllTimesheet,
        fetchAllTasks,
        setSelectedWeekData,
        selectedWeekData,
        handleSaveOrApprove,
        handleAdjust,
        handleSubmit,
        timesheetList,
        projectId,
        downloadTimesheet,
        allTasks,
      }}>
      {props.children}
    </EMPTimesheetContext.Provider>
  );
};

export default EMPTimesheetState;
