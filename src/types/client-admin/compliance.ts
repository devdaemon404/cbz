export type ComplianceType = {
  id: string;
  created: Date;
  updated: Date;
  mandatory: boolean;
  deleted: boolean;
  month: number;
  year: number;
  client_id: string;
  document_type: string;
  document_name: string;
};

export type VendorComplianceType = {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  enabled: boolean;
  deleted: boolean;
  email: string;
  mobile: string;
  vendor_admin_user_id: string;
  admins_first_name: string;
  admins_last_name: string;
  admins_mobile: string;
  admins_email: string;
  admins_username: string;
  compliant: boolean;
};

export type VendorDocumentType = {
  id: string;
  created: Date;
  updated: Date;
  client_id: string;
  vendor_id: string;
  document_type_id: string;
  document_type: string;
  document_name: string;
  document_status: string;
  file_path: string;
  file_name: string;
};
