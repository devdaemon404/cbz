import { createContext } from 'react';
import {
  API_DATA_TYPE,
  Datum,
  modal,
  modalDataType,
  SelectedDataType,
} from 'src/types/response-types/client-admin/manage-users';

export interface caManageUsersContextType {
  modelOpen: boolean;
  deleteUserConfirmation: boolean;
  deleteUserConfirmed: () => void;
  setDeleteUserConfirmation: (index: boolean) => void;
  setModelOpen: (index: boolean) => void;
  modalType: string;
  setModalType: (index: modal) => void;
  selectedRowData: SelectedDataType;
  setSelectedRowData: (index: SelectedDataType) => void;
  API_DATA: Datum[];
  userName: string;
  clientId: string;
  id: string;
  modalData: modalDataType;
  setModalData: (index: modalDataType) => void;
  toggleVendorState: (index: string) => void;
  reload: boolean;
  setReload: (index: boolean) => void;
  openAreYouSure: boolean;
  setopenAreYouSure: (index: boolean) => void;
  addUpdateApiCall: () => void;
  deleteUser: (index: string) => void;
  role: string;
}

export const defaultModalData = {
  firstName: '',
  lastName: '',
  username: '',
  department_name: '',
  role: '',
  mobile: '',
  email: '',
};

export const defaultSelectedRowData = {
  id: '',
  email: '',
  username: '',
  firstname: '',
  lastname: '',
  name: '',
  role: '',
  created: '',
  enabled: false,
  deleted: false,
  mobile: '',
  department_name: '',
};

export const caManageUsersContextDefault: caManageUsersContextType = {
  modelOpen: false,
  reload: false,
  deleteUserConfirmation: false,
  openAreYouSure: false,
  modalType: 'new',
  modalData: defaultModalData,
  selectedRowData: defaultSelectedRowData,
  API_DATA: [
    {
      id: '',
      email: '',
      created: '',
      updated: '',
      deleted: false,
      enabled: true,
      resetThePasswordRequired: false,
      username: '',
      firstname: '',
      lastname: '',
      roles: [
        {
          id: '',
          internal: true,
          created: '',
          updated: '',
          role: '',
        },
      ],
    },
  ],

  userName: '',
  clientId: '',
  id: '',

  setReload: () => null,
  deleteUser: () => null,
  setSelectedRowData: () => null,
  addUpdateApiCall: () => null,
  setModelOpen: () => null,
  setopenAreYouSure: () => null,
  setModalData: () => null,
  toggleVendorState: () => null,
  setModalType: () => null,
  deleteUserConfirmed: () => null,
  setDeleteUserConfirmation: () => null,
  role: '',
};

const CAManageUsersContext = createContext<caManageUsersContextType>(
  caManageUsersContextDefault,
);

export default CAManageUsersContext;
