import { createContext, Dispatch, SetStateAction } from 'react';
import formInitialValues from 'src/components/vendor-admin/manage-user/FormModel/formInitialValues';
import { ManageUserType } from 'src/types/vendor-admin/demand';

type VAManageUserContextDataType = {
  isLoading: boolean;
  openModal: boolean;
  modalMode: string;
  manageUserData: ManageUserType[];
  deleteUser: (userId: any) => Promise<void>;
  submitAddUser: (e: any) => Promise<void>;
  submitUpdateUser: (e: any) => Promise<void>;
  handleEdit: (userId: any) => Promise<void>;
  handleModal: (open: boolean, mode?: string | undefined) => Promise<void>;
  initialModalValues: {};
  handleStatusChange: (value: any, userId: any) => Promise<void>;
};

export const vaManageUserContextDefault: VAManageUserContextDataType = {
  isLoading: false,
  openModal: false,
  modalMode: '',
  manageUserData: [],
  deleteUser: () => Promise.resolve(),
  handleStatusChange: () => Promise.resolve(),
  handleModal: (open: boolean, mode?: string | undefined) => Promise.resolve(),
  submitAddUser: (e) => Promise.resolve(),
  submitUpdateUser: (e) => Promise.resolve(),
  handleEdit: (userId) => Promise.resolve(),
  initialModalValues: formInitialValues,
};

const VAManageUserContext = createContext<VAManageUserContextDataType>(
  vaManageUserContextDefault,
);

export default VAManageUserContext;
