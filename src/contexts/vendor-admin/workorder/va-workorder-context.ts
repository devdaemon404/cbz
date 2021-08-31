import { createContext, Dispatch, SetStateAction } from 'react';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';

type VAWorkorderContextDataType = {
  isLoading: boolean;
  changeWorkorderStatus: (
    status: any,
    workorderId: any,
    suggestion?: string,
  ) => Promise<void>;
  suggestReason: string;
  downloadFile: (s3Key: any) => Promise<void>;
  setSuggestReason: Dispatch<SetStateAction<string>>;
  selectedVersion: number;
  currentWorkorder: WorkOrderDataType | null | undefined;
  setSelectedVersion: React.Dispatch<React.SetStateAction<number>>;
  handleVersionChange: (value: any) => Promise<void>;
};

export const vaWorkorderContextDefault: VAWorkorderContextDataType = {
  isLoading: false,
  changeWorkorderStatus: () => Promise.resolve(),
  downloadFile: () => Promise.resolve(),
  suggestReason: '',
  setSuggestReason: () => '',
  selectedVersion: 0,
  currentWorkorder: null,
  setSelectedVersion: () => 0,
  handleVersionChange: (value: any) => Promise.resolve(),
};

const VAWorkorderContext = createContext<VAWorkorderContextDataType>(
  vaWorkorderContextDefault,
);

export default VAWorkorderContext;
