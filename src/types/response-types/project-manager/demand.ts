import ResponseBaseV1 from '../response-base-v1';
import ResponseBaseV2 from '../response-base-v2';

import {
  DemandDataType,
  DemandSkillDataType,
  InterviewRoundInformationType,
  InterviewSlotInformationType,
  ProfileDataType,
  NotificationType,
  RecruitmentDataType,
  VendorDataType,
  VendorDemandDataType,
  DashboardData,
} from '../../project-manager/demand';
import {
  EmployeeType,
  ProjectType,
  TaskType,
  TimeSheetDataType,
  TimesheetType,
  VATimeSheetDataType,
  VATimesheetType,
} from 'src/types/project-manager/timesheet';
import {
  ProfileDetailsDataType,
  VAProfileDataType,
} from 'src/types/vendor-admin/demand';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';

export type FetchDemandResponseType = {
  data: DemandDataType[];
} & ResponseBaseV1;

export type FetchVendorDemandResponseType = {
  data: VendorDemandDataType[];
} & ResponseBaseV1;

export type FetchDemandDataResponseType = {
  data: DemandDataType;
} & ResponseBaseV1;

export type CreateDemandRequestType = {
  id?: string;
  name: string;
  profile_name: string;
  hours_per_week: number;
  quantity: number;
  expense: string;
  po_number: string;
  duration: number;
  startDate: string;
  endDate: string;
  job_description: string;
  jd_file_name?: string;
  skills: DemandSkillDataType;
  location: string;
  additional_info?: {
    request_id: string;
    email_enabled?: boolean;
    travel_expense_allowance?: string;
    additional_supplier_info?: string;
    justification?: string;
    shift?: string;
    background_check_required?: boolean;
    employment_type?: string;
  };
  status: string;
};

export interface AdditionalInfoType {
  email_enabled: boolean;
  team_member_info_access: boolean;
  travel_expense_allowance: string;
  additional_supplier_info: string;
  justification: string;
  shift: string;
  background_check_required: boolean;
  employment_type: string;
}

export type FetchDemandDetailsResponseType = {
  data: DemandDataType;
} & ResponseBaseV1;

export type FetchDemandProfilesResponseType = {
  data: {
    profiles: ProfileDataType[];
    metaData: {
      recruitment: RecruitmentDataType;
    }[];
  };
} & ResponseBaseV1;

export type FetchInterviewProfilesResponseType = {
  data: ProfileDataType[];
} & ResponseBaseV1;

export type FetchVendorInterviewProfilesResponseType = {
  data: VAProfileDataType[];
} & ResponseBaseV1;

export type FetchVAProfileResponseType = {
  data: ProfileDetailsDataType;
};

export type FetchProfileDetailsResponseType = {
  data: {
    interview_slots: InterviewSlotInformationType[];
    interview_rounds: InterviewRoundInformationType[];
  };
};

export type FetchAllNotificationResponseType = {
  data: NotificationType[];
} & ResponseBaseV1;

export type ProfileDataTypeResponseType = {
  data: ProfileDataType;
} & ResponseBaseV1;

export type DashboardResponseType = {
  data: DashboardData;
} & ResponseBaseV1;

export type BookInterviewSlotsRequestType = {
  slots: InterviewSlotInformationType[];
  notes: string;
  interview_mode: string;
  round_description: string;
};

// export type FetchAllEmployeesResponseType = {
//   data: {
//     mockEmployees: EmployeeDataType[];
//   };
// } & ResponseBaseV2;

export type FetchAllTimeSheetResponseType = {
  timesheetData: TimesheetType;
} & ResponseBaseV2;

export type FetchAllVATimeSheetResponseType = {
  data: VATimeSheetDataType[];
} & ResponseBaseV2;

export type FetchAllTasksResponseType = {
  data: TaskType[];
} & ResponseBaseV2;

export type FetchAllProjectResponseType = {
  data: ProjectType[];
} & ResponseBaseV2;

export type FetchAllEmployeeResponseType = {
  data: EmployeeType[];
} & ResponseBaseV2;

// Work order response types

export type FetchWorkOrderResponseType = {
  data: WorkOrderDataType;
} & ResponseBaseV2;

export type FetchAllWorkOrderResponseType = {
  allWorkOrderData: WorkOrderDataType[];
} & ResponseBaseV2;

export type FetchAllVAWorkOrderResponseType = {
  workOrderData: WorkOrderDataType[];
} & ResponseBaseV2;
