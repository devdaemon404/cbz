import { DemandDataType, ProfileDataType } from '../project-manager/demand';
import ResponseBaseV1 from '../response-types/response-base-v1';

export type RoundDataType = {
  round: number;
  selectedSlotId: string;
  interview_mode: string;
  round_description: string;
  times: [
    {
      id: string;
      raw: {
        time: {
          from: number;
          to: number;
        };
        date: string;
        zone: string;
        zone_name: string;
      };
      from: string;
      to: string;
    },
  ];
  notes: string;
  status?: string;
};

export type VAProfileDataType = {
  id: string;
  created: string;
  name: string;
  firstname: string;
  lastname: string;
  location: string;
  experience: number;
  email: string;
  mobile: string;
  profile_file_id: string;
  profile_file_name: string;
  profile_file_content_type: string;
  profile_file_type: string;
  profile_status: string;
  profileStatus?: string;
};

export type ProfileDetailsDataType = {
  interview_slots: any;
  interview_rounds: any;
  interviewSlotsArr: RoundDataType[];
  interviewRoundsArr: [
    {
      times: [
        {
          id: string;
          raw: {
            time: {
              from: number;
              to: number;
            };
          };
        },
      ];
      round: number;
      slot_id: string;
      status?: string;
    },
  ];
  profileStatus?: string;
  rate?: number;
} & ProfileDataType;

export type ComplianceDocumentsType = {
  client_id: string;
  created: string;
  document_name: string;
  document_status: string;
  document_type_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  id: string;
  updated: string;
  vendor_id: string;
};

export type FreezeSlotRequestType = {
  profileId: string;
  roundNumber: number;
  slotId: string;
  roundDescription: string;
};

export type ManageUserType = {
  created: string;
  deleted: boolean;
  email: string;
  enabled: boolean;
  firstname: string;
  id: string;
  lastname: string;
  mobile: string;
  resetThePasswordRequired: boolean;
  roles: ManageUserRoleType[];
  updated: string;
  username: string;
};

export type ManageUserRoleType = {
  id: string;
  internal: boolean;
  created: string;
  role: string;
  updated: string;
};

export interface UserMetadata {
  deleted: boolean;
  enabled: boolean;
  resetThePasswordRequired: boolean;
  user_id: string;
}

export interface ManageEmployeeSingle {
  id: string;
  shared: boolean;
  created: string;
  updated: string;
  firstname: string;
  lastname: string;
  location: string;
  experience: number;
  email: string;
  mobile: string;
  currentCTC?: string;
  expectedCTC: string;
  rate: string;
  profileStatus: string;
  slotRejectionRaised: boolean;
  notice_period: number;
  holding_offer_package: string;
  doj: string;
  rate_currency: string;
  profile_file_id: string;
  profile_file_name: string;
  profile_file_content_type: string;
  profile_file_type: string;
  vendor_id: string;
  demand_id: string;
  profile_name: string;
  request_id: number;
  recruiter_user_id: string;
  user_metadata: UserMetadata;
}

export interface ManageEmployeeType {
  data: ManageEmployeeSingle[];
  code: number;
  time: string;
  success: boolean;
  records: number;
  'correlation-id': string;
}
