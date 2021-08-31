import ResponseBaseV1 from '../response-base-v1';

export interface Role {
  id: string;
  role: string;
  created: string;
  updated: string;
  internal: boolean;
}

export interface ProjectManagerUser {
  id: string;
  email: string;
  mobile: string;
  created: string;
  updated: string;
  deleted: boolean;
  enabled: boolean;
  resetThePasswordRequired: boolean;
  username: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  client_id: string;
}

export interface VpUser {
  id: string;
  email: string;
  mobile: string;
  created: string;
  updated: string;
  deleted: boolean;
  enabled: boolean;
  resetThePasswordRequired: boolean;
  username: string;
  firstname: string;
  lastname: string;
  department_name: string;
  roles: Role[];
  client_id: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created: string;
  updated: string;
  deleted: boolean;
  enabled: boolean;
  resetThePasswordRequired: boolean;
  username: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  client_id: string;
}

export interface Client {
  id: string;
  clientName: string;
  adminUser: AdminUser;
  created: string;
  updated: string;
  mobile: string;
  email: string;
  enabled: boolean;
  deleted: boolean;
}

export interface Datum {
  id: string;
  projectName: string;
  created: string;
  updated: string;
  startDate: string;
  endDate: string;
  deleted: boolean;
  enabled: boolean;
  numeric_id: number;
  project_manager_user: ProjectManagerUser;
  vp_user: VpUser;
  client: Client;
}

export type API_DATA_TYPE = Datum[];

//

export type SelectedDataType = {} | Datum;
export type modal = 'edit' | 'new';

export interface caProjectsContextType {
  modelOpen: boolean;
  setModelOpen: (index: boolean) => void;
  modalType: string;
  setModalType: (index: modal) => void;
  selectedRowData: SelectedDataType;
  setSelectedRowData: (index: SelectedDataType) => void;
  API_DATA: API_DATA_TYPE;
  userName: string;
  clientId: string;
  id: string;
  modalData: Datum | any;
  setModalData: (index: any) => void;
  addUpdateApiCall: () => any;
  addNewProjectData: () => any;
  updateProject: () => any;
  setFindPM: (value: any) => void;
  findPM: any;
}

export const DefaultRole = [
  { id: '', role: '', created: '', updated: '', internal: false },
];

export type API_DATA_TYPE_CALL = ResponseBaseV1 & {
  data: API_DATA_TYPE;
  success: boolean;
  records: number;
};

export const defaultAPIDATA: API_DATA_TYPE = [
  {
    id: '',
    projectName: '',
    created: '',
    updated: '',
    startDate: '',
    endDate: '',
    deleted: false,
    enabled: false,
    numeric_id: 0,
    project_manager_user: {
      id: '',
      email: '',
      mobile: '',
      created: '',
      updated: '',
      deleted: false,
      enabled: false,
      resetThePasswordRequired: false,
      username: '',
      firstname: '',
      lastname: '',
      roles: DefaultRole,
      client_id: '',
    },
    vp_user: {
      id: '',
      email: '',
      mobile: '',
      created: '',
      updated: '',
      deleted: false,
      enabled: false,
      resetThePasswordRequired: false,
      username: '',
      firstname: '',
      lastname: '',
      department_name: '',
      roles: DefaultRole,
      client_id: '',
    },
    client: {
      id: '',
      clientName: '',
      adminUser: {
        id: '',
        email: '',
        created: '',
        updated: '',
        deleted: false,
        enabled: false,
        resetThePasswordRequired: false,
        username: '',
        firstname: '',
        lastname: '',
        roles: DefaultRole,
        client_id: '',
      },
      created: '',
      updated: '',
      mobile: '',
      email: '',
      enabled: false,
      deleted: false,
    },
  },
];
