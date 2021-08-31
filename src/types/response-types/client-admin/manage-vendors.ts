import ResponseBaseV1 from '../response-base-v1';

export interface Datum {
  id: string;
  name: string;
  created: string;
  updated: string;
  enabled?: boolean;
  deleted?: boolean;
  email: string;
  mobile: string;
  client_id: string;
  vendor_admin_user_id: string;
  admins_first_name: string;
  admins_last_name: string;
  admins_mobile: string;
  admins_email: string;
  admins_username: string;
  role?: string;
}

export type API_DATA_TYPE_CALL = {
  data: Datum[];
  success: boolean;
  records: number;
} & ResponseBaseV1;

export type API_DATA_TYPE = Datum[];
export type Model = 'new' | 'edit';

export type errorType = {
  email: string;
  admins_first_name: string;
  admins_username: string;
  admins_last_name: string;
  name: string;
  role: string;
  mobile: string;
};
export interface CAManageVendorsDefaultType {
  modelOpen: boolean;
  setModelOpen: (index: boolean) => void;
  modalType: Model;
  setModalType: (index: Model) => void;
  selectedRowData: contactInfoDataType;
  setSelectedRowData: (index: contactInfoDataType) => void;
  userName: string;
  clientId: string;
  API_DATA: API_DATA_TYPE;
  id: string;
  dataOfContactInfo: contactInfoDataType;
  setdataOfContactInfo: (index: contactInfoDataType) => void;
  handleAPICall: () => any;
  activeStep: number;
  setActiveStep: (index: number) => void;
  toggleVendorState: (index: string, index2: string) => void;
}

export type contactInfoDataType = {
  id: string;
  email: string;
  admins_username: string;
  admins_first_name: string;
  admins_last_name: string;
  name: string;
  role: string;
  created: string;
  enabled: boolean;
  deleted: boolean;
  mobile: string;
  client_id: string;
  vendor_admin_user_id: string;
  admins_mobile: string;
  admins_email: string;
};
