import ResponseBaseV1 from '../response-types/response-base-v1';

/**
 * Interface for AcademicInfo
 */
export interface AcademicInfoType {
  qualification: string;
  schoolCollegeName: string;
  specialization: string;
  yearOfPassing: string;
  percentage: string;
}

export interface FamilyInfoType {
  familyMemberName: string;
  relationship:string; 
  familyMemberDob:string; 
  bloodGroup:string; 
  occupation:string; 
}

/**
 *  1. For the workHistory skill tab form fields
 */
export interface SkillType {
  expert: string[];
  intermediate: string[];
  beginner: string[];
}

/**
 * 2. For the workHistory work tab form fields
 */

export interface WorkHistoryType {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

/**
 * Contact Information
 */
export interface ContactInformationType {
  fullName: string;
  emailAddress: string;
  permanentAddress: string;
  phoneNumber: string;
}

/**
 * Interface for Documents
 */
export interface DocumentDataType {
  // The key with which the document is identified
  documentKey: string;
  // The label shown to the user
  label: string;
  // The list of files stored for the document requested
  files: File[];
  // The S3 File keys for the said documents
  s3FileKeys: string[];
}

/**
 * Type for employee props
 *
 */

export type EmployeePropsType = {
  project: {
    id: string;
  };
  employee_id: Number;
};

export type FetchEmployeePropsResponseType = {
  data: EmployeePropsType;
};

export type Role = {
  role_name: string;
};

export type EmployeeDetailsType = {
  employee_id: string;
  profile: {
    email: string;
    doj: string;
    firstname: string;
    lastname: string;
  };
  project: {
    project_manager_user: {
      firstname: string;
      lastname: string;
      email: string;
    };
  };
  user: {
    roles: Role[];
  };
};

export type FetchEmployeeDetailsResponseType = {
  data: EmployeeDetailsType;
} & ResponseBaseV1;
