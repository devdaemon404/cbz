import React, { useEffect, useState } from 'react';
import { OPToast } from 'src/utils/op-toast';
import { OPHttpClient } from 'src/utils/op-http-client';
import VAManageUserContext, {
  vaManageUserContextDefault,
} from './va-mu-context';
import { VAApiService } from 'src/apis/vendor-admin/va-api-service';
import {
  ComplianceDocumentsType,
  ManageUserType,
} from 'src/types/vendor-admin/demand';
import { VAManageUserApiService } from 'src/apis/vendor-admin/va-manage-user-api-service';

const VAManageUserState = (props) => {
  // API URLs
  const v1URL = 'https://test.app.cloudsbuzz.in/';

  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Vendor Admin Manage User',
  });

  const clientId = props.clientId;
  const vendorId = props.userId;

  const apiService = new VAManageUserApiService(httpClientV1, vendorId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<string>('');
  const [initialModalValues, setInitialModalValues] = useState(
    vaManageUserContextDefault.initialModalValues,
  );

  const [manageUserData, setManageUserData] = useState<ManageUserType[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const handleModal = async (open: boolean, mode?: string) => {
    setInitialModalValues(vaManageUserContextDefault.initialModalValues);
    if (mode) {
      await setModalMode(mode);
    }
    await setOpenModal(open);
  };

  const getManageUserData = async () => {
    setIsLoading(true);
    const response = await apiService.fetchManageUserData(vendorId);
    if (response) {
      setManageUserData(response);
    }
    setIsLoading(false);
  };

  const submitUpdateUser = async (values) => {
    setIsLoading(true);
    await apiService.updateUser(vendorId, currentUserId, values);
    await getManageUserData();
    setIsLoading(false);
  };

  const submitAddUser = async (values) => {
    setIsLoading(true);
    await apiService.submitUser(vendorId, values);
    await getManageUserData();
    setIsLoading(false);
  };

  const handleEdit = async (userId) => {
    setCurrentUserId(userId);
    const selectedData = manageUserData.find((data) => data.id === userId);
    if (selectedData) {
      let role = selectedData.roles[0].role;
      let selectedRole = 'SELECT';
      if (role === 'RECRUITER_MANAGER') {
        selectedRole = 'RM';
      } else if (role === 'HR_MANAGER') {
        selectedRole = 'HR';
      } else if (role === 'ACCOUNTANT') {
        selectedRole = 'ACC';
      } else if (role === 'RECRUITER') {
        selectedRole = 'RC';
      }
      setInitialModalValues({
        ...initialModalValues,
        username: selectedData.username,
        firstname: selectedData.firstname,
        lastname: selectedData.lastname,
        email: selectedData.email,
        mobile: selectedData.mobile,
        role: selectedRole,
      });
    }
  };

  const deleteUser = async (userId) => {
    setIsLoading(true);
    console.log('User with id ', userId, ' deleted');
    await apiService.deleteUser(vendorId, userId);
    await getManageUserData();
    setIsLoading(false);
  };

  const toggleActive = async (userId) => {
    setIsLoading(true);
    console.log('User with id ', userId, ' deleted');
    await apiService.toggleActiveUser(vendorId, userId);
    await getManageUserData();
    setIsLoading(false);
  };

  const handleStatusChange = async (value, userId) => {
    if (value === 'INACTIVE') {
      await toggleActive(userId);
      await getManageUserData();
    }
  };

  useEffect(() => {
    getManageUserData();
  }, []);

  return (
    <VAManageUserContext.Provider
      value={{
        openModal,
        modalMode,
        handleEdit,
        isLoading,
        initialModalValues,
        manageUserData,
        handleModal,
        handleStatusChange,
        submitUpdateUser,
        submitAddUser,
        deleteUser,
      }}>
      {props.children}
    </VAManageUserContext.Provider>
  );
};

export default VAManageUserState;
