import moment from 'moment';

export type DemandDataType = {
  id?: string;
  name: string;
  quantity?: number;
  startDate?: string;
  endDate?: string;
  duration?: number;
  expense?: string;
  skills: DemandSkillDataType;
  created?: string;
  updated?: string;
  enabled?: boolean;
  deleted?: boolean;
  location?: string;
  profile_name?: string;
  jd_file_name?: string;
  hours_per_week?: number;
  po_number?: string;
  job_description?: string;
  request_id?: string;
  client_id?: string;
  user_id?: string;
  project_id?: string;
  project_name?: string;
  project_generated_id?: number;
  user_first_name?: string;
  user_last_name?: string;
  summary?: {
    assignments?: boolean;
    request_type?: string;
    sub_status?: string;
    labor_category?: string;
    procurement_manager_user_id?: string;
    procurement_type?: string;
  };
  additional_info?: {
    request_id?: number | string;
    email_enabled?: boolean;
    travel_expense_allowance?: string;
    additional_supplier_info?: string;
    justification?: string;
    shift?: string;
    location?: string;
    background_check_required?: boolean;
    employment_type?: string;
    employmentType?: string;
    backgroundCheckRequired?: boolean;
    emailEnabled?: boolean;
  };
  vendor_ids?: string[];
  status?: string;
};

export type VendorDemandDataType = {
  demand: {
    id: string;
    name: string;
    quantity: number;
    startDate: string;
    duration: number;
    expense: number;
    skills: DemandSkillDataType;
    created: string;
    updated: string;
    enabled: boolean;
    deleted: boolean;
    profile_name: string;
    jd_file_name?: string;
    hours_per_week: number;
    po_number: string;
    job_description: string;
    client_id: string;
    user_id: string;
    project_id?: string;
    project_name?: string;
    project_generated_id?: number;
    user_first_name: string;
    user_last_name: string;
    request_id: number;
    summary: {
      assignments: boolean;
      request_type: string;
      sub_status: string;
      labor_category: string;
      procurement_manager_user_id: string;
      procurement_type: string;
    };
    additional_info: {
      email_enabled: boolean;
      travel_expense_allowance: string;
      additional_supplier_info: string;
      justification: string;
      shift: string;
      background_check_required: boolean;
      employment_type: string;
    };
    vendor_ids: string[];
    status: string;
  };
  recruitment_id: string;
};

export type VendorDataType = {
  primary_skills: string[];
  secondary_skills: string[];
  relevant_experience: number;
  total_experience: number;
  additional_skills: string[];
};

export type DemandSkillDataType = {
  primary_skills: string[];
  secondary_skills: string[];
  relevant_experience: number;
  total_experience: number;
  additional_skills: string[];
};

export type DefaultValidationType = {
  fieldName: string;
  helperText: string;
  error: boolean;
};

export type ValidationType = {
  demand_name: DefaultValidationType;
  profile_name: DefaultValidationType;
  quantity: DefaultValidationType;
  location: DefaultValidationType;
  expense: DefaultValidationType;
  duration: DefaultValidationType;
  hours_per_week: DefaultValidationType;
  po_number: DefaultValidationType;
  total_experience: DefaultValidationType;
  relevant_experience: DefaultValidationType;
  job_description: DefaultValidationType;
};

/**
id    "5fc489ef11452044ce34b352"
shared    true
created    "2020-11-30T11:28:07.281+05:30"
updated    "2020-12-24T10:18:20.707+05:30"
name    "sekhar30"
location    "hyderabad"
experience    2
email    "sekhar300@mailinator.com"
mobile    "7654656650"
currentCTC    "100000"
expectedCTC    "200000"
rate    "40",
recruiterFirstName    "raja"
recruiterLastName    "sekahr"
profileStatus    "INTERVIEW_FAILURE_DROPPED"
profileSubStatus    "NOT_INTERESTED"
notice_period    10
holding_offer_package    "250000"
rate_currency    "INR"
profile_file_id    "5fc489ef11452044ce34b34c"
profile_file_name    "Left Align.pdf"
profile_file_content_type    "application/pdf"
profile_file_type    "DB"
recruiter_user_id    "5f8972eae5daed54edb656e3

*/

export type VAProfileDataType = {
  created: string;
  doj: string;
  email: string;
  experience: number;
  firstname: string;
  id: string;
  lastname: string;
  location: string;
  mobile: string;
  profile_file_content_type: string;
  profile_file_id: string;
  profile_file_name: string;
  profile_file_type: string;
  profile_status: string;
  recruiter_user_id: string;
  shared: boolean;
  slotRejectionRaised: boolean;
  updated: string;
  holding_offer_package: string;
  notice_period?: string;
  currentCTC?: string;
  rateCard?: string;
  rate_currency?: string;
  interview_date_time?: string;
};

export type DashboardData = {
  profiles: number;
  demands: number;
  contractors: number;
};

export type ProfileDataType = {
  id: string;
  shared: boolean;
  created: string;
  updated: string;
  name: string;
  firstname: string;
  lastname: string;
  location: string;
  experience: number;
  email: string;
  mobile: string;
  currentCTC?: string;
  expectedCTC: string;
  rateCard: string;
  notes?: ProfileNoteDataType[];
  rate_currency: string;
  profile_file_id: string;
  profile_file_name: string;
  profile_file_content_type: string;
  profile_sub_status: string;
  profile_file_type: string;
  notice_period: number;
  holding_offer_package: string;
  profile_status: string;
  vendor_id: string;
  profileStatus?: string;
  vendor_name: string;
  recruitment_id: string;
  demand_id: string;
  demand_name: string;
  slotRejectionRaised: boolean;
  recruiter_user_id: string;
};

export type ProfileNoteDataType = {
  note: string;
  time: string;
  status_from: string;
  status_to: string;
  vendor_only_viewable: boolean;
};

export type RecruitmentDataType = {
  id: string;
  created: string;
  updated: string;
  clientViewable: boolean;
  vendorName: string;
  recruitment_manager_user_id: string;
  demand_id: string;
  demand_name: string;
  client_name: string;
  vendor_id: string;
};

// moment(slot.from).ti

export type InterviewSlotInformationType = {
  times: { raw: InterviewSlotType }[];
  round: number;
  notes: string;
  interview_mode: string;
  round_description: string;
  status: string;
  selectedSlotId: string;
};

export type InterviewRoundInformationType = {
  time: { id: string; raw: InterviewSlotType };
  round: number;
  status: string;
  interview_mode: string;
  round_description: string;
};

export type InterviewSlotType = {
  id: string;
  time: {
    from: number;
    to: number;
  };
  date: string;
  zone: string;
  zone_name: string;
};

export type InterviewRoundType = {
  slots: InterviewSlotType[];
  notes: string;
  interview_mode: string;
  round_description: string;
};

export type NotificationType = {
  id: string;
  email: string;
  subject: string;
  description: string;
  read: boolean;
  contentParams: [{ name: string; value: string }];
  created: string;
  updated: string;
  debugNote: string;
  requester_user_id: string;
  user_id: string;
  event_type: string;
  send_email: boolean;
  notification_status: string;
};

export const interviewRoundTypeDefaultValue: InterviewRoundType = {
  slots: [
    {
      time: {
        from: 15,
        to: 30,
      },
      id: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      zone: 'GMT+05:30',
      zone_name: 'Asia/Kolkata',
    },
    {
      time: {
        from: 15,
        to: 30,
      },
      id: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      zone: 'GMT+05:30',
      zone_name: 'Asia/Kolkata',
    },
    {
      time: {
        from: 15,
        to: 30,
      },
      id: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      zone: 'GMT+05:30',
      zone_name: 'Asia/Kolkata',
    },
  ],

  notes: '',
  interview_mode: '',
  round_description: 'tech',
};
