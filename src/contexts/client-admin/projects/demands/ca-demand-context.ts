import { promises } from 'fs';
import moment from 'moment';
import React, { createContext, Dispatch, SetStateAction } from 'react';
import formInitialValues from 'src/components/client-admin/demands/FormModel/formInitialValues';
import { CreateDemandRequestType } from 'src/types/response-types/project-manager/demand';
import {
  DemandDataType,
  ProfileDataType,
  ValidationType,
} from '../../../../types/project-manager/demand';

interface PmListType {
  id: string;
  name: string;
}

// demands,
//         getDemandsForProject,
//         // demandsForProject,
//         getDemandData,
//         currentDemand,
//         handleDateChange,
//         profiles,
//         demandInfo,
//         validation,
//         disabled,
//         file,
//         fileName,
//         loading,
//         success,
//         editDemandModalOpened,
//         setEditDemandModalOpened,
//         isLoading,
//         setDemandInfo,
//         updateDemandStatus,
//         handleFileOnChange,
//         handleDemandInfoChange,
//         handleSkillsOnChange,
//         handleExperienceChange,
//         handleDemandFormSubmission,
//         setEditableDemand,
//         editDemandOnSubmit,
//         getAllProfilesForDemand,
//         clearDemandFields,
//         updateProfileStatus,
//         deleteDemand,
//         checkData,
//         initialModalValues,
export interface CADemandContextDataType {
  /**
   * All interfaces for Demand info state and funtions
   *
   *
   */
  // activeStep: number;
  // setActiveStep: (e: any) => void;
  // PMLIST: PmListType[];
  setDemandInfo: (demandInfo: any) => void;
  editDemandModalOpened: boolean;
  setEditDemandModalOpened: (d: any) => void;
  // clientId: string;
  demandInfo: CreateDemandRequestType;
  demands: DemandDataType[];
  handleDateChange: (date: any) => void;
  // handleAdditionalDateChange: (date: any) => void;
  // demandsForProject: DemandDataType[];
  profiles: ProfileDataType[];
  getAllProfilesForDemand: (demandId: string) => Promise<void>;
  updateDemandStatus: (id: string, status: string | unknown) => void;
  updateProfileStatus: (
    profile: ProfileDataType,
    status: string,
    demandId: string,
  ) => void;
  getDemandsForProject: () => Promise<void>;
  getDemandData: (demandId: any) => Promise<void>;
  currentDemand: DemandDataType;
  handleDemandInfoChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  handleDemandFormSubmission: (values: any) => Promise<void>;
  deleteDemand: (demandId: string) => Promise<void>;

  /**
   * All interfaces for Demand skills state and functions
   *
   *
   */

  validation: ValidationType & any;
  disabled: boolean;

  // file data types
  file: File | null;
  fileName: string;
  loading: boolean;
  success: boolean;
  isLoading: boolean;
  handleSkillsOnChange: (_skills: string[], level: number) => void;
  handleExperienceChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  handleFileOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setEditableDemand: (demand: CreateDemandRequestType) => void;
  editDemandOnSubmit: (values: any) => void;
  clearDemandFields: () => void;
  checkData: () => boolean;
  initialModalValues: {};
  setInitialModalValues: React.Dispatch<React.SetStateAction<{}>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleDemandShare: (demandId: string, vendor_ids: string[]) => Promise<void>;
  shareSuccess: boolean;
  addRequestIdToDemand: (demandId: string) => Promise<void>;
  sendAdditionalData: (values: any) => Promise<void>;
}

export const CADemandContextDefault: CADemandContextDataType = {
  /**
   *  Default Values for Demand Information
   *
   *
   */

  // ---> Insert all relevant states below

  initialModalValues: formInitialValues,
  demands: [],
  setDemandInfo: () => null,
  // demandsForProject: [],
  profiles: [],
  // PMLIST: [{ id: '', name: '' }],
  getDemandsForProject: () => Promise.resolve(),
  getDemandData: (demandId: any) => Promise.resolve(),
  currentDemand: {
    id: '',
    name: '',
    quantity: 0,
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    duration: 0,
    expense: '0',
    skills: {
      primary_skills: [],
      secondary_skills: [],
      additional_skills: [],
      relevant_experience: 0,
      total_experience: 0,
    },
    created: '',
    updated: '',
    enabled: false,
    deleted: false,
    client_id: '',
    user_id: '',
    user_first_name: '',
    user_last_name: '',
    project_generated_id: 0,
    project_id: '',
    project_name: '',
    // @ts-ignore
    request_id: 0,
    profile_name: '',
    hours_per_week: 0,
    po_number: '',
    job_description: '',
    jd_file_name: '',
    summary: {
      assignments: false,
      request_type: '',
      sub_status: '',
      labor_category: '',
      procurement_manager_user_id: '',
      procurement_type: '',
    },
    additional_info: {
      email_enabled: false,
      travel_expense_allowance: '',
      additional_supplier_info: '',
      justification: '',
      shift: '',
      background_check_required: false,
      employment_type: '',
    },
    vendor_ids: [''],
    status: '',
  },
  // handleAdditionalDateChange: () => null,

  handleDateChange: () => null,
  demandInfo: {
    name: '',
    quantity: 0,
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    duration: 0,
    expense: '0',
    skills: {
      primary_skills: [],
      secondary_skills: [],
      additional_skills: [],
      relevant_experience: 0,
      total_experience: 0,
    },
    additional_info: {
      email_enabled: true,
      // @ts-ignore
      team_member_info_access: true,
      travel_expense_allowance: '',
      additional_supplier_info: '',
      justification: '',
      shift: '',
      background_check_required: true,
      employment_type: 'FULL_TIME',
    },
    profile_name: '',
    hours_per_week: 0,
    po_number: '',
    job_description: '',
    jd_file_name: '',
  },
  disabled: false,
  isLoading: false,

  // ---> Insert all relevant functions below
  handleDemandInfoChange: () => null,
  // handleAdditionalInfoChange: () => null,
  updateDemandStatus: () => null,
  handleDemandFormSubmission: async (values: any) => undefined,
  getAllProfilesForDemand: async () => undefined,
  updateProfileStatus: async () => undefined,
  deleteDemand: async () => Promise.resolve(),

  /**
   * Default Values for Demand Skills
   */
  validation: {
    demand_name: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    quantity: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    duration: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    hours_per_week: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    job_description: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    po_number: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    total_experience: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    relevant_experience: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    email_enabled: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },

    request_id: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    status: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    location: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    shift: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
    background_check_required: {
      fieldName: 'This field cannot be empty',
      helperText: '',
      error: false,
    },
    employment_type: {
      fieldName: '',
      helperText: 'This field cannot be empty',
      error: false,
    },
  },

  handleSkillsOnChange: () => null,
  handleExperienceChange: () => null,

  /**
   * Default Values for System Access
   *
   *
   */
  file: null,
  fileName: 'File Upload',
  loading: false,
  success: false,
  editDemandModalOpened: false,
  setEditDemandModalOpened: () => null,
  // clientId: '',
  handleFileOnChange: () => null,
  setEditableDemand: () => null,
  editDemandOnSubmit: (values: any) => null,
  clearDemandFields: () => null,
  checkData: () => false,
  setInitialModalValues: () => {},
  editMode: false,
  setEditMode: () => false,
  handleDemandShare: (demandId: string, vendor_ids: string[]) =>
    Promise.resolve(),
  shareSuccess: false,
  addRequestIdToDemand: (demandId: string) => Promise.resolve(),
  sendAdditionalData: (values: any) => Promise.resolve(),
};

const CADemandContext = createContext<CADemandContextDataType>(
  CADemandContextDefault,
);

export default CADemandContext;
