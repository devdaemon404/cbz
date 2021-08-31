import { createContext, Dispatch, SetStateAction } from 'react';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';

type MGRWorkorderContextDataType = {
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

export const mgrWorkorderContextDefault: MGRWorkorderContextDataType = {
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

const MGRWorkorderContext = createContext<MGRWorkorderContextDataType>(
  mgrWorkorderContextDefault,
);

export default MGRWorkorderContext;
