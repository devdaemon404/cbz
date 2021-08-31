import ResponseBaseV1 from 'src/types/response-types/response-base-v1';

export interface Role {
  id?: string;
  internal?: boolean;
  created?: string;
  updated?: string;
  role?: string;
}

export type Datum = {
  id: string;
  email: string;
  created: string;
  updated: string;
  deleted: boolean;
  enabled: boolean;
  resetThePasswordRequired: boolean;
  username: string;
  name?: string;
  mobile?: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  role?: string;
  department_name?: string;
  count?: number;
};

export type API_DATA_TYPE = {
  data: Datum[];

  success: boolean;
  records: number;
} & ResponseBaseV1;

export type modal = 'edit' | 'new';

export type modalDataType = {
  firstName: string;
  username: string;

  lastName: string;
  department_name: string;
  role?: string;
  mobile: string;
  email: string;
};

export type SelectedDataType =
  | {
      id: string;
      email: string;
      username: string;
      firstname: string;
      lastname: string;
      name: string;
      role: string;
      created: string;
      enabled: boolean;
      deleted: boolean;
      mobile: string;
      department_name: string;
    }
  | Datum;
