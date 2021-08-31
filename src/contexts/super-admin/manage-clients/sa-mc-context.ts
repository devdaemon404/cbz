import { createContext, Dispatch, SetStateAction } from 'react';
import formInitialValues from 'src/components/super-admin/manage-clients/FormModel/formInitialValues';
import { ManageClientType } from 'src/types/super-admin/manage-clients';
import { ManageUserType } from 'src/types/vendor-admin/demand';

type SAManageClientContextDataType = {
  isLoading: boolean;
  openModal: boolean;
  modalMode: string;
  manageClientData: ManageClientType[];
  submitAddClient: (e: any) => Promise<void>;
  handleEdit: (userId: any) => Promise<void>;
  deleteClient: (userId: any) => Promise<void>;
  submitUpdateClient: (e: any) => Promise<void>;
  handleModal: (open: boolean, mode?: string | undefined) => Promise<void>;
  initialModalValues: {};
  handleShowAllChange: (value: any) => void;
  toggleActive: () => Promise<void>;
  showAll: string;
};

export const saManageClientContextDefault: SAManageClientContextDataType = {
  isLoading: false,
  openModal: false,
  modalMode: '',
  manageClientData: [],
  submitAddClient: (e) => Promise.resolve(),
  deleteClient: () => Promise.resolve(),
  handleModal: (open: boolean, mode?: string | undefined) => Promise.resolve(),
  submitUpdateClient: (e) => Promise.resolve(),
  handleEdit: (userId) => Promise.resolve(),
  initialModalValues: formInitialValues,
  handleShowAllChange: (value: any) => null,
  toggleActive: () => Promise.resolve(),
  showAll: 'true',
};

const SAManageClientContext = createContext<SAManageClientContextDataType>(
  saManageClientContextDefault,
);

export default SAManageClientContext;
