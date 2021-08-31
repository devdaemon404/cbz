import { createContext } from 'react';
import {
  caProjectsContextType,
  defaultAPIDATA,
  DefaultRole,
} from 'src/types/response-types/client-admin/projects';

//
export const caProjectsContextDefault: caProjectsContextType = {
  modelOpen: false,
  setModelOpen: () => null,
  modalType: 'new',
  modalData: {},
  setModalData: () => null,
  addUpdateApiCall: () => null,
  setModalType: () => null,
  selectedRowData: {},
  setSelectedRowData: () => null,
  API_DATA: defaultAPIDATA,
  userName: '',
  clientId: '',
  id: '',
  addNewProjectData: () => null,
  updateProject: () => null,
  findPM: {},
  setFindPM: (e) => null,
};

const CAProjectsContext = createContext<caProjectsContextType>(
  caProjectsContextDefault,
);

export default CAProjectsContext;
