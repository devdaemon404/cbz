import React, { useEffect, useState } from 'react';
import {
  modal,
  modalDataType,
  SelectedDataType,
} from 'src/types/response-types/client-admin/manage-users';
import CAManageUsersContext, {
  caManageUsersContextDefault,
  defaultModalData,
  defaultSelectedRowData,
} from './ca-manage-users-context';
import { OPHttpClient } from '../../../utils/op-http-client';
import { CAApiService } from 'src/apis/client-admin/ca-manage-users-api-service';
import Vendor from 'server/models/Vendor';
import OPLoader from 'src/components/common/OPLoader';

const CAManageUsersState = ({ children, userName, clientId, id, role }) => {
  // API Related initalizations
  const [reload, setReload] = useState(false);

  const v1URL = 'https://test.app.cloudsbuzz.in/apis/v1/';

  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Client Admin Manage User API Service',
  });

  const _apiServiceV1 = new CAApiService(httpClientV1, clientId, id);

  const [isLoading, setIsLoading] = React.useState(false);
  // Get Vendors List
  const getData = async () => {
    setIsLoading(true);
    const RowData = await _apiServiceV1.fetchAllUsersManageUserPage();
    setIsLoading(false);
    setAPI_DATA(RowData);
  };

  // States and Other functions
  const [modelOpen, setModelOpen] = useState(false);
  const [openAreYouSure, setopenAreYouSure] = React.useState<boolean>(false);
  const [deleteUserConfirmation, setDeleteUserConfirmation] = React.useState(
    false,
  );
  const [modalType, setModalType] = React.useState<modal>('new');
  const [selectedRowData, setSelectedRowData] = React.useState<
    SelectedDataType
  >(defaultSelectedRowData);
  const [modalData, setModalData] = React.useState<modalDataType>(
    defaultModalData,
  );
  const [API_DATA, setAPI_DATA] = React.useState(
    caManageUsersContextDefault.API_DATA,
  );

  const deleteUserConfirmed = () => {
    setDeleteUserConfirmation(false);
    return null;
  };

  // Function to togggle the VENDOR STATE AND GET THE LIST OF ALL VENDORS AGAIN
  const toggleVendorState = async (vendorId) => {
    setIsLoading(true);
    await _apiServiceV1.toggleUserState(vendorId);
    setIsLoading(false);

    setReload(!reload);
    return null;
  };

  // Function to call api to delete a particular user

  const deleteUser = async (vendorId) => {
    setIsLoading(true);

    await _apiServiceV1.deleteUser(vendorId);
    setIsLoading(false);

    setReload(!reload);
    return;
  };

  // Function to update or add a new user
  const addUpdateApiCall = async () => {
    if (modalType === 'edit') {
      // Call Update function
      await _apiServiceV1.updateUser(modalData, selectedRowData.id);
      setReload(!reload);
      return;
    } else if (modalType === 'new') {
      let code: string = '';
      if (modalData.role === 'CLIENT_ADMIN') {
        code = 'CM';
      } else if (modalData.role === 'PROJECT_MANAGER') {
        code = 'PM';
      } else if (modalData.role === 'VICE_PRESIDENT') {
        code = 'VP';
      }
      // Call New User Add function
      await _apiServiceV1.addNewUser(modalData, code);
      setReload(!reload);
      return;
    }
  };

  useEffect(() => {
    getData();
  }, [reload]);

  return (
    <CAManageUsersContext.Provider
      value={{
        // @ts-ignore
        role,
        modelOpen,
        modalType,
        selectedRowData,
        userName,
        clientId,
        id,
        deleteUserConfirmation,
        modalData,
        openAreYouSure,
        API_DATA,
        reload,
        setReload,
        setModalData,
        deleteUserConfirmed,
        setSelectedRowData,
        setModalType,
        toggleVendorState,
        deleteUser,
        setModelOpen,
        setDeleteUserConfirmation,
        setopenAreYouSure,
        addUpdateApiCall,
      }}>
      <OPLoader isLoading={isLoading} />
      {children}
    </CAManageUsersContext.Provider>
  );
};
export default CAManageUsersState;
