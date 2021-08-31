import React, { useEffect, useState } from 'react';
import moment from 'moment';
import validator from 'validator';
import { OPToast } from 'src/utils/op-toast';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import { OPHttpClient } from 'src/utils/op-http-client';

import SAManageClientContext, {
  saManageClientContextDefault,
} from './sa-mc-context';
import { VAApiService } from 'src/apis/vendor-admin/va-api-service';
import {
  ComplianceDocumentsType,
  ManageUserType,
} from 'src/types/vendor-admin/demand';
import { VAManageUserApiService } from 'src/apis/vendor-admin/va-manage-user-api-service';
import { SAManageClientsApiService } from 'src/apis/super-admin/sa-manage-clients-api-service';
import { ManageClientType } from 'src/types/super-admin/manage-clients';

const SAManageClientState = (props) => {
  // API URLs
  const v1URL = 'https://test.app.cloudsbuzz.in/';

  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Vendor Admin Manage User',
  });

  const clientId = props.clientId;
  const vendorId = props.userId;

  const apiService = new SAManageClientsApiService(httpClientV1);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<string>('');
  const [initialModalValues, setInitialModalValues] = useState(
    saManageClientContextDefault.initialModalValues,
  );

  const [manageClientData, setManageClientData] = useState<ManageClientType[]>(
    [],
  );
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showAll, setShowAll] = useState('true');

  const handleShowAllChange = (e) => {
    setShowAll(e.target.value);
  };

  const handleModal = async (open: boolean, mode?: string) => {
    if (mode === 'Create Client') {
      setInitialModalValues(saManageClientContextDefault.initialModalValues);
    }
    if (mode) {
      await setModalMode(mode);
    }
    await setOpenModal(open);
  };

  const getManageClientData = async () => {
    setIsLoading(true);
    let response: ManageClientType[] | null = null;
    if (showAll === 'true') {
      response = await apiService.fetchManageClientData(true);
    } else {
      response = await apiService.fetchManageClientData('');
    }
    if (response) {
      setManageClientData(response);
    }
    setIsLoading(false);
  };

  const submitUpdateClient = async (values) => {
    setIsLoading(true);
    const newValues = { ...values, deleted: false };
    const body = JSON.stringify(newValues);
    await apiService.updateClient(currentUserId, body);
    await getManageClientData();
    setIsLoading(false);
  };

  const submitAddClient = async (values) => {
    setIsLoading(true);
    await apiService.submitClient(values);
    await getManageClientData();
    setIsLoading(false);
  };

  const handleEdit = async (userId) => {
    setIsLoading(true);
    setCurrentUserId(userId);
    console.log('inside handle edit');
    const selectedData = manageClientData.find((data) => data.id === userId);
    console.log('found selectedData', selectedData);
    if (selectedData) {
      setInitialModalValues({
        ...initialModalValues,
        username: selectedData.email,
        firstName: selectedData.adminUser.firstname,
        lastName: selectedData.adminUser.lastname,
        mobile: selectedData.mobile,
        name: selectedData.clientName,
        currency: selectedData.currency ? selectedData.currency : 'INR',
        client_fees: selectedData.client_fees ? selectedData.client_fees : '',
        system_fees: selectedData.system_fees ? selectedData.system_fees : '',
        enabled: selectedData.enabled && !selectedData.deleted,
      });
    }
    setIsLoading(false);
  };

  const deleteClient = async (userId) => {
    setIsLoading(true);
    console.log('User with id ', userId, ' deleted');
    await apiService.deleteClient(userId);
    await getManageClientData();
    setIsLoading(false);
  };

  const toggleActive = async () => {
    await apiService.toggleActive(currentUserId);
  };
  useEffect(() => {
    getManageClientData();
  }, []);

  useEffect(() => {
    getManageClientData();
  }, [showAll]);

  return (
    <SAManageClientContext.Provider
      value={{
        openModal,
        modalMode,
        handleModal,
        isLoading,
        initialModalValues,
        manageClientData,
        submitAddClient,
        handleEdit,
        deleteClient,
        toggleActive,
        submitUpdateClient,
        handleShowAllChange,
        showAll,
      }}>
      {props.children}
    </SAManageClientContext.Provider>
  );
};

export default SAManageClientState;
