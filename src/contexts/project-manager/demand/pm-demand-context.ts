import { promises } from 'fs';
import moment from 'moment';
import React, { createContext, Dispatch, SetStateAction } from 'react';
import { CreateDemandRequestType } from 'src/types/response-types/project-manager/demand';
import {
  DemandDataType,
  ProfileDataType,
  ValidationType,
} from '../../../types/project-manager/demand';

export interface PMDemandContextDataType {
  /**
   * All interfaces for Demand info state and funtions
   *
   *
   */

  demandInfo: CreateDemandRequestType;
  demands: DemandDataType[];
  handleDateChange: (date: any, name: string) => void;
  // demandsForProject: DemandDataType[];
  profiles: ProfileDataType[];
  getAllProfilesForDemand: (demandId: string) => Promise<void>;
  updateDemandStatus: (id: string, status: string | unknown) => void;
  updateProfileStatus: (
    profile: ProfileDataType,
    status: string,
    demandId: string,
  ) => void;
  getDemandsForProject: (projectId: any) => Promise<void>;
  getDemandData: (demandId: any) => Promise<void>;
  currentDemand: DemandDataType;
  handleDemandInfoChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  handleDemandFormSubmission: () => Promise<void>;
  deleteDemand: (demandId: string) => Promise<void>;

  /**
   * All interfaces for Demand skills state and functions
   *
   *
   */

  validation: ValidationType;
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
  editDemandOnSubmit: (demandId: string, file: File) => void;
  clearDemandFields: () => void;
  checkData: () => boolean;
}

export const PMDemandContextDefault: PMDemandContextDataType = {
  /**
   *  Default Values for Demand Information
   *
   *
   */

  // ---> Insert all relevant states below

  demands: [],
  // demandsForProject: [],
  profiles: [],
  getDemandsForProject: () => Promise.resolve(),
  getDemandData: (demandId: any) => Promise.resolve(),
  currentDemand: {
    id: '',
    name: '',
    quantity: 0,
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    location: '',
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
    //@ts-ignore
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
    status: 'OPEN',
  },
  handleDateChange: () => null,
  demandInfo: {
    name: '',
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    quantity: 0,
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    duration: 0,
    location: '',
    expense: '0',
    skills: {
      primary_skills: [],
      secondary_skills: [],
      additional_skills: ['xxx'],
      relevant_experience: 0,
      total_experience: 0,
    },
    profile_name: ' ',
    status: 'OPEN',
    hours_per_week: 0,
    po_number: ' ',
    job_description: ' ',
    jd_file_name: ' ',
  },
  disabled: false,
  isLoading: false,

  // ---> Insert all relevant functions below
  handleDemandInfoChange: () => null,
  updateDemandStatus: () => null,
  handleDemandFormSubmission: async () => undefined,
  getAllProfilesForDemand: async () => undefined,
  updateProfileStatus: async () => undefined,
  deleteDemand: async () => Promise.resolve(),

  /**
   * Default Values for Demand Skills
   */
  validation: {
    demand_name: { fieldName: '', helperText: '', error: false },
    profile_name: { fieldName: '', helperText: '', error: false },
    quantity: { fieldName: '', helperText: '', error: false },
    location: { fieldName: '', helperText: '', error: false },
    expense: { fieldName: '', helperText: '', error: false },
    duration: { fieldName: '', helperText: '', error: false },
    hours_per_week: { fieldName: '', helperText: '', error: false },
    po_number: { fieldName: '', helperText: '', error: false },
    total_experience: { fieldName: '', helperText: '', error: false },
    relevant_experience: { fieldName: '', helperText: '', error: false },
    job_description: { fieldName: '', helperText: '', error: false },
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
  handleFileOnChange: () => null,
  setEditableDemand: () => null,
  editDemandOnSubmit: () => null,
  clearDemandFields: () => null,
  checkData: () => false,
};

const PMDemandContext = createContext<PMDemandContextDataType>(
  PMDemandContextDefault,
);

export default PMDemandContext;
