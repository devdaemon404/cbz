import { createContext } from 'react';
import {
  CAManageVendorsDefaultType,
  contactInfoDataType,
  errorType,
} from 'src/types/response-types/client-admin/manage-vendors';

export const defaultAPIDATA = [
  {
    id: '',
    name: '',
    created: '',
    updated: '',
    enabled: false,
    deleted: false,
    email: '',
    mobile: '',
    client_id: '',
    vendor_admin_user_id: '',
    admins_first_name: '',
    admins_last_name: '',
    admins_mobile: '',
    admins_email: '',
    admins_username: '',
    role: '',
  },
];

export const contactInfoDataDefault: contactInfoDataType = {
  id: '',
  email: '',
  admins_username: '',
  admins_first_name: '',
  admins_last_name: '',
  name: '',
  role: '',
  created: '',
  enabled: false,
  deleted: false,
  mobile: '',
  client_id: '',
  vendor_admin_user_id: '',
  admins_mobile: '',
  admins_email: '',
};

export const errorDefault: errorType = {
  email: '',
  admins_first_name: '',
  admins_username: '',
  admins_last_name: '',
  name: '',
  role: '',
  mobile: '',
};

export const CAManageVendorsDefault: CAManageVendorsDefaultType = {
  modelOpen: false,
  setModelOpen: () => null,
  modalType: 'new',
  setModalType: () => null,
  selectedRowData: contactInfoDataDefault,
  setSelectedRowData: () => null,
  userName: '',
  clientId: '',
  API_DATA: defaultAPIDATA,
  id: '',
  dataOfContactInfo: contactInfoDataDefault,
  setdataOfContactInfo: () => null,
  handleAPICall: () => null,
  activeStep: 0,
  setActiveStep: () => null,

  toggleVendorState: () => null,
};

const CAManageVendorsContext = createContext(CAManageVendorsDefault);

export default CAManageVendorsContext;
