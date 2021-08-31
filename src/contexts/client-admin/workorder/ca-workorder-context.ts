import { createContext, Dispatch, SetStateAction } from 'react';
import formInitialValues from 'src/components/client-admin/workorder/create-workorder/FormModel/formInitialValues';
import { CAProfileDataType } from 'src/types/client-admin/workorder';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';

type CAWorkorderContextDataType = {
  isLoading: boolean;
  changeWorkorderStatus: (
    status: any,
    workorderId: any,
    suggestion?: string,
  ) => Promise<void>;
  suggestReason: string;
  downloadFile: (s3Key: any) => Promise<void>;
  setSuggestReason: Dispatch<SetStateAction<string>>;
  selectedVersion: number;
  currentWorkorder: WorkOrderDataType | null | undefined;
  setSelectedVersion: React.Dispatch<React.SetStateAction<number>>;
  handleVersionChange: (value: any) => Promise<void>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  createPageShow: boolean;
  setCreatePageShow: React.Dispatch<React.SetStateAction<boolean>>;
  initialWorkorderFormValues: {};
  fetchProfiles: () => Promise<void>;
  profiles: CAProfileDataType[];
  fetchProfileDetails: (demandId: any, profileId: any) => Promise<void>;
  createWorkorder: (values: any) => Promise<void>;
  role: string;
  amendSuggestion: string;
  setAmendSuggestion: React.Dispatch<React.SetStateAction<string>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  updateWorkorder: (values: any) => Promise<void>;
  setCurrentWorkorderId: React.Dispatch<React.SetStateAction<string>>;
  rejectWorkorder: (note: any) => Promise<void>;
};

export const caWorkorderContextDefault: CAWorkorderContextDataType = {
  isLoading: false,
  changeWorkorderStatus: () => Promise.resolve(),
  downloadFile: () => Promise.resolve(),
  suggestReason: '',
  setSuggestReason: () => '',
  selectedVersion: 0,
  currentWorkorder: null,
  setSelectedVersion: () => 0,
  handleVersionChange: (value: any) => Promise.resolve(),
  openModal: false,
  setOpenModal: () => false,
  createPageShow: false,
  setCreatePageShow: () => false,
  initialWorkorderFormValues: formInitialValues,
  fetchProfiles: () => Promise.resolve(),
  profiles: [],
  fetchProfileDetails: (demandId: any, profileId: any) => Promise.resolve(),
  createWorkorder: (values: any) => Promise.resolve(),
  role: '',
  amendSuggestion: '',
  setAmendSuggestion: () => '',
  editMode: false,
  setEditMode: () => false,
  updateWorkorder: (values: any) => Promise.resolve(),
  setCurrentWorkorderId: () => '',
  rejectWorkorder: (note: any) => Promise.resolve(),
};

const CAWorkorderContext = createContext<CAWorkorderContextDataType>(
  caWorkorderContextDefault,
);

export default CAWorkorderContext;
