import React, { ReactElement, useEffect, useState } from 'react';
import CAManageVendorsContext, {
  contactInfoDataDefault,
} from './ca-manage-vendors-context';
import {
  API_DATA_TYPE,
  contactInfoDataType,
  Datum,
  Model,
} from 'src/types/response-types/client-admin/manage-vendors';
import { CAApiService } from '../../../apis/client-admin/ca-manage-vendors-api-service';
import { OPHttpClient } from '../../../utils/op-http-client';
import { Constants } from '../../../utils/constants';
import OPLoader from 'src/components/common/OPLoader';

const CAManageVendorsState = ({ children, userName, clientId, id, role }) => {
  // initializing class
  const [reload, setReload] = useState(false);
  const v1URL = 'https://test.app.cloudsbuzz.in/apis/v1/';
  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Client Admin Manage Vendor API Service',
  });
  const _apiServiceV1 = new CAApiService(httpClientV1, clientId, id);

  // Default API DATA

  let defaultData: API_DATA_TYPE = [
    {
      id: '607aebcba1c966159c65cd18',
      name: 'Jatin',
      created: '2021-04-17T19:38:11.798+05:30',
      updated: '2021-04-17T19:38:11.822+05:30',
      enabled: true,
      deleted: false,
      email: 'jp@mailinator.com',
      mobile: '7655678434',
      client_id: '607a9582a1c966159c65ccfe',
      vendor_admin_user_id: '607aebcba1c966159c65cd19',
      admins_first_name: 'Jatin',
      admins_last_name: 'Peralta',
      admins_mobile: '7655678434',
      admins_email: 'jp@mailinator.com',
      admins_username: 'jp',
    },
    {
      id: '609141f8654d7c67ff0a7cfa',
      name: 'Roy Kumar Shetty',
      created: '2021-05-04T18:15:44.55+05:30',
      updated: '2021-05-04T18:15:44.586+05:30',
      enabled: true,
      deleted: false,
      email: 'EmailisRequikred@Gnam.com',
      mobile: '9234567890',
      client_id: '607a9582a1c966159c65ccfe',
      vendor_admin_user_id: '609141f8654d7c67ff0a7cfb',
      admins_first_name: 'NewVendor',
      admins_last_name: 'Kumar',
      admins_mobile: '9234567890',
      admins_email: 'EmailisRequikred@Gnam.com',
      admins_username: 'roykumar',
    },
  ];

  const [API_DATA, setAPI_DATA] = React.useState<API_DATA_TYPE>(defaultData);
  const [isLoading, setIsLoading] = React.useState(false);
  // States
  const [modelOpen, setModelOpen] = React.useState(false);
  const [dataOfContactInfo, setdataOfContactInfo] = React.useState<
    contactInfoDataType
  >(contactInfoDataDefault);
  const [modalType, setModalType] = React.useState<Model>('new');
  const [selectedRowData, setSelectedRowData] = React.useState<
    contactInfoDataType
  >(contactInfoDataDefault);
  const [activeStep, setActiveStep] = React.useState(0);

  // UseEffect functions
  useEffect(() => {
    setdataOfContactInfo(selectedRowData);
  }, [modalType, modelOpen]);

  useEffect(() => {
    fetchVendors();
  }, [reload]);

  // Functions to be called and shared

  const handleAPICall = async () => {
    let apiCallData = {
      email: dataOfContactInfo.admins_email,
      mobile: dataOfContactInfo.mobile,
      deleted: dataOfContactInfo.deleted,
      enabled: dataOfContactInfo.enabled,
      username: dataOfContactInfo.admins_username,
      firstname: dataOfContactInfo.admins_first_name,
      lastname: dataOfContactInfo.admins_last_name,
      vendor_name: dataOfContactInfo.name,
    };
    if (modalType === 'new') {
      console.log('CALL ADD VENDOR API', dataOfContactInfo);
      setIsLoading(true);

      await _apiServiceV1.addVendors(dataOfContactInfo.id, apiCallData);
      setIsLoading(false);

      setReload(!reload);
    } else if (modalType === 'edit') {
      console.log('CALL UPDATE API', JSON.stringify(dataOfContactInfo));
      setIsLoading(true);

      await _apiServiceV1.updateVendors(dataOfContactInfo.id, apiCallData);
      setIsLoading(false);

      setReload(!reload);
    }
    setModelOpen(false);
    return;
  };

  // internal functions

  const fetchVendors = async () => {
    setIsLoading(true);

    let refreshedData = await _apiServiceV1.fetchAllUsersManageVendorsPage();
    setIsLoading(false);

    setAPI_DATA(refreshedData);
  };

  const toggleVendorState = async (id, action) => {
    setIsLoading(true);

    await _apiServiceV1.deleteInactivate(id, action);
    setReload(!reload);
    setIsLoading(false);
  };

  return (
    <CAManageVendorsContext.Provider
      value={{
        modelOpen,
        setModelOpen,
        modalType,
        setModalType,
        selectedRowData,
        setSelectedRowData,
        // @ts-ignore
        API_DATA,
        userName,
        clientId,
        id,
        //@ts-ignore
        role,
        dataOfContactInfo,
        setdataOfContactInfo,
        handleAPICall,
        activeStep,
        setActiveStep,
        toggleVendorState,
      }}>
      <OPLoader isLoading={isLoading} />
      {children}
    </CAManageVendorsContext.Provider>
  );
};
export default CAManageVendorsState;
