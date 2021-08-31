export type ClientDataType = {
  deleted: boolean;
  enabled: boolean;
  _class: string;
  _id: string;
  client_name: string;
  created: string;
  updated: string;
  mobile: string;
  email: string;
  client_metadata: {
    alternatePhoneNumber1: string;
    alternatePhoneNumber2: string;
    billingAddress: {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      country: string;
      pinCode: string;
      townCity: string;
    };
    officeAddress: {};
    officialEmail: string;
    organizationName: string;
    primaryPhoneNumber: string;
  };
};

export type VendorDataType = {
  deleted: boolean;
  enabled: boolean;
  _class: string;
  _id: string;
  vendor_name: string;
  created: string;
  updated: string;
  vendor_metadata: {
    alternatePhoneNumber1: string;
    alternatePhoneNumber2: string;
    billingAddress: {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      country: string;
      pinCode: string;
      townCity: string;
    };
    criticalEmail: string;
    officeAddress: {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      country: string;
      pinCode: string;
      townCity: string;
    };
    officialEmail: string;
    organizationName: string;
    primaryPhoneNumber: string;
  };
  email: string;
  mobile: string;
};

export type WorkOrderData = {
  version: number;
  changes?: [];
  requestedResource: string;
  allowExpenses: boolean;
  id: string;
  posTitle: string;
  posId: string;
  posReportsTo: string;
  jobType: string;
  rateCard: string;
  currency: string;
  contractedFee: string;
  rateType: string;
  assignmentDesc: string;
  startDate: string;
  duration: string;
  endDate: string;
  officialEmail: string;
  estimatedTotalSpend: string;
  estimatedRemainingBudget: string;
  cvLink: string;
  client: ClientDataType;
  vendor: VendorDataType;
  demand: string;
  profile: string;
};

export type WorkOrderDataType = {
  _id: string;
  data: WorkOrderData;
  status: string;
  currentRole: string;
  suggestions: [
    {
      _id: string;
      id: string;
      suggestion: string;
    },
  ];
  __v: number;
};
