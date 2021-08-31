export interface Role {
  id: string;
  role: string;
  created: Date;
  updated: Date;
  internal: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  mobile: string;
  created: Date;
  updated: Date;
  deleted: boolean;
  enabled: boolean;
  resetThePasswordRequired: boolean;
  username: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  client_id: string;
}

export interface ManageClientType {
  id: string;
  clientName: string;
  adminUser: AdminUser;
  created: Date;
  updated: Date;
  mobile: string;
  email: string;
  enabled: boolean;
  deleted: boolean;
  system_fees: string;
  client_fees: string;
  currency: string;
}
