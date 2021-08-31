export interface CAProfileDataType {
  id: string;
  shared: boolean;
  created: Date;
  updated: Date;
  firstname: string;
  lastname: string;
  location: string;
  experience: number;
  email: string;
  mobile: string;
  currentCTC?: string;
  rate: string;
  profileStatus: string;
  slotRejectionRaised: boolean;
  notice_period: number;
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
}

export interface Skills {
  primary_skills: string[];
  secondary_skills: string[];
  relevant_experience: number;
  total_experience: number;
  additional_skills: string[];
}

export interface Summary {
  assignments: boolean;
  procurement_manager_user_id: string;
}

export interface AdditionalInfo {
  email_enabled: boolean;
  background_check_required: boolean;
  employment_type: string;
}

export interface CAProfileDetailsDataType {
  id: string;
  name: string;
  quantity: number;
  startDate: string;
  duration: number;
  expense: string;
  skills: Skills;
  created: Date;
  updated: Date;
  enabled: boolean;
  deleted: boolean;
  profile_name: string;
  hours_per_week: number;
  po_number: string;
  jd_file_id: string;
  jd_file_name: string;
  jd_file_content_type: string;
  jd_file_type: string;
  job_description: string;
  client_id: string;
  project_id: string;
  project_name: string;
  project_generated_id: number;
  users_id: string;
  user_first_name: string;
  user_last_name: string;
  request_id: number;
  summary: Summary;
  additional_info: AdditionalInfo;
  vendor_ids: string[];
  status: string;
}
