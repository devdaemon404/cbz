import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';
import {
  EmployeeType,
  ProjectType,
  TaskType,
  TimesheetType,
  VATimeSheetDataType,
} from '../../types/project-manager/timesheet';
import {
  FetchAllTimeSheetResponseType,
  FetchAllProjectResponseType,
  FetchAllEmployeeResponseType,
  FetchAllTasksResponseType,
  FetchAllVATimeSheetResponseType,
} from '../../types/response-types/project-manager/demand';
import responseBaseV2 from '../../types/response-types/response-base-v2';
import {
  EmployeePropsType,
  FetchEmployeePropsResponseType,
} from 'src/types/employee/onboarding';
import { printPdf } from 'src/utils/timesheetDownload';

export class PMTimesheetApiService {
  private empId;
  private projectId;
  private timesheetId;
  private clientId;
  private userId;
  private vendorId;

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
  public setClientId(clientId: string) {
    this.clientId = clientId;
  }
  public setUserId(userId: string) {
    this.userId = userId;
  }
  public setVendorId(vendorId: string) {
    this.vendorId = vendorId;
  }

  // Get All Projects
  // /apis/v1/project/client/{client_id}/manager/{user_id}

  fetchAllProjects = async (): Promise<ProjectType[] | null> => {
    const res = await this.httpClient.get<FetchAllProjectResponseType>(
      `project/client/${this.clientId}/manager/${this.userId}`,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  // Fetch all Employees with a given project manager (userId)
  // /apis/v1/employee/project/manager/{user_id}

  fetchAllEmployees = async (): Promise<EmployeeType[] | null> => {
    const res = await this.httpClient.get<FetchAllEmployeeResponseType>(
      `employee/project/manager/${this.userId}`,
    );
    // console.log('all employees: ', res);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  fetchAllVAEmployees = async (): Promise<EmployeeType[] | null> => {
    // console.log('vend id api', `${this.vendorId}`);
    const res = await this.httpClient.get<FetchAllEmployeeResponseType>(
      `employee/vendor/${this.vendorId}`,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

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

  // Fetch all vendor timesheets for a week
  // /api/v2/timesheet/vendor?vendorId=5f8972eae5daed54edb656e2&weekNumber=10&year=2021
  fetchAllVATimesheet = async (data): Promise<VATimeSheetDataType[] | null> => {
    const { weekNumber, year } = data;
    const res = await this.httpClient.get<FetchAllVATimeSheetResponseType>(
      `timesheet/vendor?vendorId=${this.vendorId}&weekNumber=${weekNumber}&year=${year}`,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  // Download Timesheets for vendor admin
  downloadTimesheet = async (body): Promise<any | null> => {
    const reqData = JSON.stringify(body);
    console.log('Downlaod request data: ', reqData);
    const res = await this.httpClient.post<any>(
      `${process.env.V2_API_URL}/api/v2/timesheet/gen-pdf`,
      reqData,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    } else {
      printPdf(res.allTimesheetData);
    }
  };

  // Create a Task
  // /api/v2/timesheet/task/{projectId}
  createTasks = async (body) => {
    // console.log('create task state: ', body);
    body = { tasks: body };
    const reqData = JSON.stringify(body);
    const res = await this.httpClient.post<responseBaseV2>(`task`, reqData);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show('Created Task Successfully', {
        variant: ToastVariant.SUCCESS,
      });
    }
  };

  // Get all timesheet for a project
  // /api​/v2​/timesheet​/{employeeId}
  fetchAllTimeSheet = async (data): Promise<TimesheetType | null> => {
    const { weekNumber, year, projectId } = data;
    // const res = await this.httpClient.get<FetchAllTimeSheetResponseType>(
    //   `timesheet/employee?employeeId=${this.empId}&weekNumber=${weekNumber}&year=${year}`,
    // );

    const res = await this.httpClient.get<FetchAllTimeSheetResponseType>(
      `timesheet/employee?projectId=${projectId}&employeeId=${this.empId}&weekNumber=${weekNumber}&year=${year}`,
    );

    // console.log({ res });
    if (isException(res)) {
      // OPToast.show(`No task/timesheet for the current week`, {
      //   variant: ToastVariant.INFO,
      // });
      return null;
    }
    return res.timesheetData;
  };

  // Get all timesheet for a Employee
  // /api​/v2​/timesheet​/{employeeId}
  fetchAllEMPTimeSheet = async (data): Promise<TimesheetType | null> => {
    const { weekNumber, year } = data;
    const res = await this.httpClient.get<FetchAllTimeSheetResponseType>(
      `timesheet/employee?projectId=${this.projectId}&employeeId=${this.empId}&weekNumber=${weekNumber}&year=${year}`,
    );

    // console.log({ res });
    if (isException(res)) {
      // OPToast.show(`No task/timesheet for the current week`, {
      //   variant: ToastVariant.INFO,
      // });
      return null;
    }
    return res.timesheetData;
  };

  // Update a Timesheet
  // /api/v2/timesheet/employee/{timesheetId}
  updateEmployeeTimeSheet = async (body) => {
    const reqData = JSON.stringify(body);
    const res = await this.httpClient.put<responseBaseV2>(
      `timesheet/employee/${this.timesheetId}`,
      reqData,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show('Timesheet Adjusted', {
        variant: ToastVariant.SUCCESS,
      });
    }
  };

  // Update status of a timesheet
  // /api/v2/timesheet/pm/{timesheet}
  updatePmTimeSheetStatus = async (body) => {
    const reqData = JSON.stringify(body);
    const res = await this.httpClient.put<responseBaseV2>(
      `timesheet/pm/${this.timesheetId}`,
      reqData,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      if (body.action === 'amd') {
        OPToast.show('Timesheet Amendment Requested', {
          variant: ToastVariant.SUCCESS,
        });
      } else if (body.action === 'appr') {
        OPToast.show('Timesheet Approved', {
          variant: ToastVariant.SUCCESS,
        });
      } else {
        OPToast.show('Timesheet Unlocked', {
          variant: ToastVariant.SUCCESS,
        });
      }
    }
  };

  // Get Employee Props
  // /apis/v1/employee/{employee_id}
  getEmployeeProps = async (): Promise<EmployeePropsType | null> => {
    const res = await this.httpClient.get<FetchEmployeePropsResponseType>(
      `/employee/${this.empId}`,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  // Send Timesheet Notification
  sendTimesheetNotification = async (event_id, empId) => {
    const body = {
      event_id,
      content: [{ name: 'employee_id', value: empId }],
    };
    console.log('BODY: ', body);

    const res = await this.httpClient.post(
      `/notification/user/${this.userId}`,
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
