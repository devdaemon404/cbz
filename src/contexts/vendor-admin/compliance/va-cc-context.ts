import { createContext, Dispatch, SetStateAction } from 'react';
import { ComplianceDocumentsType } from 'src/types/vendor-admin/demand';

type VAComplianceContextDataType = {
  isLoading: boolean;
  handleDateChange: (date: any) => void;
  monthYear: { month: number; year: number; date: Date };
  documents: ComplianceDocumentsType[];
  currentDocumentType: string;
  handleDocumentTypeChange: (value: any) => void;
  handleFileUpload: (files: any) => void;
  submitDocumentUpload: () => Promise<void>;
  documentTypes: string[];
  file: any;
  clearForm: () => void;
  downloadDocument: (docType: any) => Promise<void>;
};

export const vaComplianceContextDefault: VAComplianceContextDataType = {
  isLoading: false,
  handleDateChange: (date: any) => null,
  monthYear: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    date: new Date(),
  },
  documents: [],
  file: [],
  currentDocumentType: '',
  handleDocumentTypeChange: (value: any) => null,
  handleFileUpload: (files: any) => null,
  submitDocumentUpload: () => Promise.resolve(),
  documentTypes: [],
  clearForm: () => null,
  downloadDocument: (docType: any) => Promise.resolve(),
};

const VAComplianceContext = createContext<VAComplianceContextDataType>(
  vaComplianceContextDefault,
);

export default VAComplianceContext;
