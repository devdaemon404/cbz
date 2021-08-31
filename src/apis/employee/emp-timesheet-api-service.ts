import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';
import {
  TimeSheetDataType,
  TaskType,
  TimesheetType,
} from '../../types/project-manager/timesheet';
import {
  FetchAllTimeSheetResponseType,
  FetchAllTasksResponseType,
  FetchAllNotificationResponseType,
} from '../../types/response-types/project-manager/demand';
import responseBaseV2 from 'src/types/response-types/response-base-v2';
import ResponseBaseV1 from 'src/types/response-types/response-base-v1';
import {
  EmployeeDetailsType,
  EmployeePropsType,
  FetchEmployeeDetailsResponseType,
  FetchEmployeePropsResponseType,
} from 'src/types/employee/onboarding';
import { NotificationType } from 'src/types/project-manager/demand';

export class EMPTimesheetApiService {
  private empId;
  private projectId;
  private timesheetId;
  private userId;
  constructor(private httpClient: HttpClient) {}

  public setEmpId(empId: string) {
    this.empId = empId;
  }
  public setProjectId(projectId: string) {
    this.projectId = projectId;
  }
  public setTimesheetId(timesheetId: string) {
    this.timesheetId = timesheetId;
  }
  public setUserId(userId: string) {
    this.userId = userId;
  }

  // Fetch all Tasks for a given Project Id
  // /api/v2/timesheet/task/{projectId}
  fetchAllTasks = async (data): Promise<TaskType[] | null> => {
    const { weekNumber, year } = data;
    const res = await this.httpClient.get<FetchAllTasksResponseType>(
      `task?weekNumber=${weekNumber}&projectId=${this.projectId}&year=${year}`,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  // Get all timesheet for an employee (employeeId)
  // /api​/v2​/timesheet​/{employeeId}
  fetchAllTimeSheet = async (data): Promise<TimesheetType | null> => {
    const { weekNumber, year } = data;
    const res = await this.httpClient.get<FetchAllTimeSheetResponseType>(
      `timesheet/employee?employeeId=${this.empId}&weekNumber=${weekNumber}&year=${year}`,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.timesheetData;
  };

  // Create a Timesheet - ProjectId and EmployeeId
  // /api/v2/timesheet/
  createTimeSheet = async (body) => {
    const reqData = JSON.stringify(body);
    console.log(reqData);
    const res = await this.httpClient.post<responseBaseV2>(
      `/timesheet`,
      reqData,
    );
    if (isException(res)) {
      console.log({ res });
      OPToast.show(`Employee doesn't Exist`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show('Created Timesheet Successfully', {
        variant: ToastVariant.SUCCESS,
      });
    }
  };

  // Update a Timesheet
  // /api/v2/timesheet/{timesheetId}
  updateTimeSheet = async (body) => {
    const reqData = JSON.stringify(body);
    const res = await this.httpClient.post<responseBaseV2>(
      `/timesheet/${this.timesheetId}`,
      reqData,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show('Updated Timesheet Successfully', {
        variant: ToastVariant.SUCCESS,
      });
    }
  };

  getAllNotifications = async (userId): Promise<NotificationType[] | null> => {
    console.log('inside api call', userId);
    const res = await this.httpClient.get<FetchAllNotificationResponseType>(
      `/notification/user/${userId}/all`,
    );
    console.log('from server', res);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      // console.log('MESSAGE', res.message);
      return null;
    }
    return res.data;
  };

  notificationRead = async (id, userId) => {
    const res = await this.httpClient.post(
      `/notification/user/${userId}/acknowledge/${id}`,
      {},
    );
    // if (isException(res)) {
    //   OPToast.show(`${res.message}`, {
    //     variant: ToastVariant.ERROR,
    //   });
    // }
  };

  getEmployeeDetails = async (userId): Promise<EmployeeDetailsType | null> => {
    const res: any = await this.httpClient.get<
      FetchEmployeeDetailsResponseType
    >(`/employee/${userId}`);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  // Send Timesheet Notification
  sendTimesheetNotification = async (event_id, empId, userId) => {
    console.log({ empId });
    const body = {
      event_id,
      content: [{ name: 'employee_id', value: empId }],
    };
    console.log('BODY: ', body);

    const res = await this.httpClient.post(
      `/notification/user/${userId}`,
      body,
    );

    if (isException(res)) {
      // console.log(res);
      OPToast.show(`Error sending notification ${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Notification sent!', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };
}
