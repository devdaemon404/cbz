import { createContext } from 'react';
import {
  DemandDataType,
  VAProfileDataType,
  VendorDemandDataType,
} from '../../../types/project-manager/demand';

import formInitialValues from 'src/components/vendor-admin/demand/profile-modal/FormModel/formInitialValues';

type VADemandContextDataType = {
  demands: VendorDemandDataType[];
  profiles: VAProfileDataType[];
  openModal: boolean;
  modalMode: string;
  modalState: {};
  handleModal: (open: boolean, mode?: string | undefined) => Promise<void>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  demandData: DemandDataType;
  file: File | null;
  initialModalValues: {};
  fileName: string;
  loading: boolean;
  addProfile: (profile: any) => Promise<void>;
  success: boolean;
  currentProfile: VAProfileDataType | undefined;
  isLoading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEdit: (id: any) => Promise<void>;
  shareProfiles: (profiles: any) => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
  checkRecruitment: (demandId: any) => Promise<void>;
};

export const vaDemandContextDefault: VADemandContextDataType = {
  demands: [],
  profiles: [],
  openModal: false,
  currentProfile: undefined,
  modalMode: '',
  setOpenModal: () => false,
  handleModal: (open: boolean, mode?: string | undefined) => Promise.resolve(),
  modalState: {},
  initialModalValues: formInitialValues,
  demandData: {
    name: '',
    profile_name: '',
    quantity: 0,
    startDate: '',
    duration: 0,
    hours_per_week: 0,
    po_number: '',
    vendor_ids: [''],
    user_first_name: '',
    user_last_name: '',
    expense: '0',
    job_description: '',
    status: '',
    //@ts-ignore
    request_id: 0,
    skills: {
      primary_skills: [''],
      secondary_skills: [''],
      relevant_experience: 0,
      additional_skills: [''],
      total_experience: 0,
    },
    additional_info: {
      additional_supplier_info: '',
      email_enabled: false,
      shift: '',
      background_check_required: false,
      employment_type: '',
      justification: '',
      travel_expense_allowance: '',
    },
  },
  file: null,
  fileName: 'File Upload',
  loading: false,
  success: false,
  isLoading: false,
  handleFileChange: () => null,
  addProfile: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
  shareProfiles: (profiles: any) => Promise.resolve(),
  handleEdit: (id: any) => Promise.resolve(),
  checkRecruitment: (demandId: any) => Promise.resolve(),
};

const VADemandContext = createContext<VADemandContextDataType>(
  vaDemandContextDefault,
);

export default VADemandContext;
