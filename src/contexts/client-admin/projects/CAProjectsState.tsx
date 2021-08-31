import React, { ReactElement, useEffect, useState } from 'react';
import CAProjectsContext from './ca-projects-context';
import { CAApiService } from '../../../apis/client-admin/ca-projects-api-service';
import { OPHttpClient } from '../../../utils/op-http-client';
import { Constants } from '../../../utils/constants';
import {
  API_DATA_TYPE,
  defaultAPIDATA,
  modal,
} from 'src/types/response-types/client-admin/projects';
import OPLoader from 'src/components/common/OPLoader';

const CAProjectsState = ({ children, userName, clientId, id }) => {
  // API initialization
  const v1URL = 'https://test.app.cloudsbuzz.in/apis/v1/'; //Default URL
  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Client Admin Projects API Service',
  });
  const _apiServiceV1 = new CAApiService(httpClientV1, clientId, id);

  // UseState Hooks
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false); //Works as useEffect for reloading the pages
  const [modelOpen, setModelOpen] = useState(false);
  const [API_DATA, setAPI_DATA] = React.useState<API_DATA_TYPE>(defaultAPIDATA);
  const [modalType, setModalType] = React.useState<modal>('new');
  const [selectedRowData, setSelectedRowData] = React.useState({
    projectName: '',
    startDate: '',
    endDate: '',
    id: '',
  });
  const [modalData, setModalData] = React.useState<any>({
    projectName: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    console.log('RESULT OF PM VC', getPMList());
  }, []);

  const getPMList = async () => {
    setIsLoading(true);
    const res = await _apiServiceV1.findPMVC();
    setIsLoading(false);

    await setFindPM(res);
    return res;
  };

  // API CALLS
  const addUpdateApiCall = () => {
    return;
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    const data = await _apiServiceV1.fetchAllProjects();

    setIsLoading(false);
    setAPI_DATA(data);
    return;
  };

  // internal functionalities
  useEffect(() => {
    // console.log(modelOpen, selectedRowData);

    if (modalType === 'new') {
      setModalData({});
    } else if (modalType === 'edit') {
      setModalData({
        project_name: selectedRowData?.projectName,
        startDate: selectedRowData?.startDate,
        endDate: selectedRowData?.endDate,
      });
    }
  }, [modelOpen, modalType]);
  const [findPM, setFindPM] = React.useState([]);

  useEffect(() => {
    // console.log(modalData);
  }, [modalData]);

  useEffect(() => {
    fetchProjects();
  }, [reload]);

  const addNewProjectData = async () => {
    let start = new Date();
    let end = new Date();
    if (modalData.startDate) start = modalData.startDate;
    if (modalData.endDate) end = modalData.endDate;
    let data = {
      ...modalData,
      startDate: start,
      endDate: end,
      project_name: modalData.projectName,
    };
    setIsLoading(true);

    await _apiServiceV1.addNewProject(data);
    setIsLoading(false);

    setReload(!reload);
    return;
  };

  const updateProject = async () => {
    let data = { ...modalData };
    console.log(data);
    setIsLoading(true);

    await _apiServiceV1.updateProject(data, selectedRowData.id);
    setIsLoading(false);

    setReload(!reload);
  };

  return (
    <CAProjectsContext.Provider
      value={{
        modelOpen,
        setModelOpen,
        addUpdateApiCall,
        modalType,
        setModalType,
        selectedRowData,
        // @ts-ignore
        setSelectedRowData,
        API_DATA,
        userName,
        clientId,
        id,
        modalData,
        setModalData,
        addNewProjectData,
        updateProject,
        findPM,
        setFindPM,
      }}>
      <OPLoader isLoading={isLoading} />

      {children}
    </CAProjectsContext.Provider>
  );
};
export default CAProjectsState;
