import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';
// import {
//   EmployeeDataType,
//   TimeSheetDataType,
// } from 'src/types/project-manager/timesheet';
// import {
//   FetchAllTimeSheetResponseType,
//   FetchAllEmployeeResponseType,
// } from 'src/types/response-types/project-manager/demand';

export class VATimesheetApiService {
  private empId;
  constructor(private httpClient: HttpClient, public projectId: string) {}
  public setEmpId(empId: string) {
    this.empId = empId;
  }

  // Fetch all employees
  // fetchAllEmployees = async (): Promise<EmployeeDataType[] | null> => {
  //   const res = await this.httpClient.get<FetchAllEmployeesResponseType>(
  //     `/employee/all`,
  //   );
  //   if (isException(res)) {
  //     OPToast.show('Error fetching Employee details', {
  //       variant: ToastVariant.ERROR,
  //     });
  //     return null;
  //   }
  //   return res.data.mockEmployees;
  // };

  // Get all timesheet for an employee (empId) under a particular project (projectID)
  // fetchAllTimeSheet = async (): Promise<TimeSheetDataType[] | null> => {
  //   const res = await this.httpClient.get<FecthAllTimeSheetResponseType>(
  //     `/timesheet/pm/emp-timesheet?projectId=${this.projectId}&employeeId=${this.empId}`,
  //   );
  //   if (isException(res)) {
  //     OPToast.show(`${res.message}`, {
  //       variant: ToastVariant.ERROR,
  //     });
  //     return null;
  //   }
  //   return res.data.timesheets;
  // };
}
