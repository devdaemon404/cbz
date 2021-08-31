import { createContext, Dispatch, SetStateAction } from 'react';
import { ManageEmployeeSingle } from 'src/types/vendor-admin/demand';

type VAManageEmployeeContextDataType = {
  isLoading: boolean;
  openModal: boolean;
  modalMode: string;
  employeeData: ManageEmployeeSingle[];
  submitAddUser: (e: any) => Promise<void>;
  initiateOnboarding: (profileId: any) => void;
  getLoginCred: (e: any, c: any) => void;
  handleChange: (value: any, name: any) => Promise<void>;
  handleModal: (open: boolean, mode?: string | undefined) => Promise<void>;
  modalState: {
    username: {
      value: string;
      error: string;
    };
    firstname: {
      value: string;
      error: string;
    };

    lastname: {
      value: string;
      error: string;
    };
    email: {
      value: string;
      error: string;
    };
    role: {
      value: string;
      error: string;
    };
    contact: {
      value: string;
      error: string;
    };
  };
};

export const vaManageEmployeeContextDefault: VAManageEmployeeContextDataType = {
  isLoading: false,
  openModal: false,
  modalMode: '',
  employeeData: [],
  getLoginCred: (profileId: any, username: string) => null,
  initiateOnboarding: (profileId: any) => null,
  handleModal: (open: boolean, mode?: string | undefined) => Promise.resolve(),
  submitAddUser: (e) => Promise.resolve(),
  handleChange: (value: any, name: any) => Promise.resolve(),
  modalState: {
    username: {
      value: '',
      error: '',
    },
    firstname: {
      value: '',
      error: '',
    },

    lastname: {
      value: '',
      error: '',
    },
    email: {
      value: '',
      error: '',
    },
    role: {
      value: 'SELECT',
      error: '',
    },
    contact: {
      value: '',
      error: '',
    },
  },
};

const VAManageUserContext = createContext<VAManageEmployeeContextDataType>(
  vaManageEmployeeContextDefault,
);

export default VAManageUserContext;
