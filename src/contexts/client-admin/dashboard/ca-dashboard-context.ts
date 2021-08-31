import { createContext, Dispatch, SetStateAction } from 'react';
import {
  ComplianceType,
  VendorComplianceType,
  VendorDocumentType,
} from 'src/types/client-admin/compliance';
import { NotificationType } from 'src/types/project-manager/demand';
import { ComplianceDocumentsType } from 'src/types/vendor-admin/demand';

type CADashboardContextDataType = {
  isLoading: boolean;
  sendNotification: (event: any) => Promise<boolean>;
  notificationRead: (id: any, userId: any) => Promise<void>;
  getAllNotifications: () => Promise<void>;
  allNotifications: NotificationType[];
  redirectFromNotification: (
    type: any,
    id: any,
    user_id: any,
    read: any,
    profileId: any,
    rejectReason?: any,
  ) => Promise<void>;
  getDashboardData: () => Promise<any>;
};

export const caDashboardContextDefault: CADashboardContextDataType = {
  isLoading: false,
  sendNotification: (event: any) => Promise.resolve(false),
  getAllNotifications: () => Promise.resolve(),
  allNotifications: [],
  redirectFromNotification: () => Promise.resolve(),
  notificationRead: (id: any, userId: any) => Promise.resolve(),
  getDashboardData: () => Promise.resolve({}),
};

const CADashboardContext = createContext<CADashboardContextDataType>(
  caDashboardContextDefault,
);

export default CADashboardContext;
