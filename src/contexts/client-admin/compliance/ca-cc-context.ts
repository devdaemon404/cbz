import { createContext, Dispatch, SetStateAction } from 'react';
import {
  ComplianceType,
  VendorComplianceType,
  VendorDocumentType,
} from 'src/types/client-admin/compliance';
import { ComplianceDocumentsType } from 'src/types/vendor-admin/demand';

type CAComplianceContextDataType = {
  isLoading: boolean;
  initialFormValues: {};
  selectedDate: Date;
  handleDateChange: (date: any) => void;
  allCompliance: ComplianceType[];
  addCompliance: (values: any) => Promise<void>;
  editMode: boolean;
  handleEdit: (data: any) => Promise<void>;
  updateCompliance: (values: any) => Promise<void>;
  resetForm: () => Promise<void>;
  handleDelete: (id: any) => Promise<void>;
  getPrevMonthDocs: () => Promise<void>;
  currentVendors: VendorComplianceType[];
  currentTableStatus: string;
  handleTableStatusChange: (value: any) => void;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allVendorDocuments: VendorDocumentType[];
  getAllVendorDocuments: (vendorId: any) => Promise<void>;
  // monthYear: { month: number; year: number; date: Date };
  currentMonth: string;
  currentYear: string;
  handleMonthChange: (month: any) => void;
  handleYearChange: (year: any) => void;
  handleDocumentRequest: (document_type: any, vendorId: any) => Promise<void>;
  handleDocumentApprove: (document_id: any, vendorId: any) => Promise<void>;
  downloadFile: (
    document_type: any,
    vendorId: any,
    filename: any,
  ) => Promise<void>;
};

export const caComplianceContextDefault: CAComplianceContextDataType = {
  isLoading: false,
  initialFormValues: {
    document_type: '',
    document_name: '',
  },
  selectedDate: new Date(),
  handleDateChange: (date: any) => null,
  allCompliance: [],
  addCompliance: (values: any) => Promise.resolve(),
  editMode: false,
  handleEdit: (data: any) => Promise.resolve(),
  updateCompliance: (values: any) => Promise.resolve(),
  resetForm: () => Promise.resolve(),
  handleDelete: (id: any) => Promise.resolve(),
  getPrevMonthDocs: () => Promise.resolve(),
  currentVendors: [],
  currentTableStatus: 'PENDING',
  handleTableStatusChange: (value: any) => null,
  modalOpen: false,
  setModalOpen: () => null,
  allVendorDocuments: [],
  getAllVendorDocuments: (vendorId: any) => Promise.resolve(),
  // monthYear: {
  //   month: new Date().getMonth(),
  //   year: new Date().getFullYear(),
  //   date: new Date(),
  // },
  currentMonth: (new Date().getMonth() + 1).toString(),
  currentYear: new Date().getFullYear().toString(),
  handleMonthChange: (month: any) => null,
  handleYearChange: (year: any) => null,
  handleDocumentRequest: (document_type: any, vendorId: any) =>
    Promise.resolve(),
  handleDocumentApprove: (document_id: any, vendorId: any) => Promise.resolve(),
  downloadFile: (document_type: any, vendorId: any, filename: any) =>
    Promise.resolve(),
};

const CAComplianceContext = createContext<CAComplianceContextDataType>(
  caComplianceContextDefault,
);

export default CAComplianceContext;
