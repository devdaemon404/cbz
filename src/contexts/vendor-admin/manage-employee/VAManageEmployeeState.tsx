import React, { useEffect, useState } from 'react';
import moment from 'moment';
import validator from 'validator';
import { OPToast } from 'src/utils/op-toast';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import { OPHttpClient } from 'src/utils/op-http-client';

import VAManageUserContext, {
  vaManageEmployeeContextDefault,
} from './va-me-context';

import {
  ComplianceDocumentsType,
  ManageEmployeeSingle,
} from 'src/types/vendor-admin/demand';
import {
  VAManageEmployeeApiService,
  VAManageEmployeeApiService2,
} from 'src/apis/vendor-admin/va-manage-employee-api-service';

const VAManageEmployeeState = (props) => {
  // API URLs
  const v1URL = 'https://test.app.cloudsbuzz.in/';

  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Vendor Admin Manage Employee',
  });

  const v2URL = `${process.env.V2_API_URL}`;

  const httpClientV2 = OPHttpClient.init(v2URL, {
    action: 'Vendor Admin Manage Employee',
  });

  const clientId = props.clientId;
  const vendorId = props.userId;

  const apiService = new VAManageEmployeeApiService(httpClientV1, vendorId);
  const apiService2 = new VAManageEmployeeApiService2(httpClientV2, vendorId);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<string>('');
  const [modalState, setModalState] = useState(
    vaManageEmployeeContextDefault.modalState,
  );

  const [employeeData, setEmployeeData] = useState<ManageEmployeeSingle[]>([]);

  const handleModal = async (open: boolean, mode?: string) => {
    if (open) {
      console.log('Open Modal');
    } else {
      setModalState(vaManageEmployeeContextDefault.modalState);
    }

    if (mode) {
      await setModalMode(mode);
    }
    await setOpenModal(open);
  };

  const getEmployeeData = async () => {
    setIsLoading(true);
    const response = await apiService.fetchManageEmployeeData(vendorId);

    if (response) {
      setEmployeeData(response);
    }
    setIsLoading(false);
  };

  const handleChange = async (value, name) => {
    console.log(value);
    console.log('valid phone nuymber: ');
    switch (name) {
      case 'contact': {
        if (validator.isMobilePhone(value, 'en-IN')) {
          setModalState({
            ...modalState,
            [name]: { value, error: '' },
          });
        } else {
          setModalState({
            ...modalState,
            [name]: { value, error: 'Enter valid mobile number' },
          });
        }
        break;
      }
      default: {
        if (value.trim() === '') {
          setModalState({
            ...modalState,
            [name]: { value: '', error: 'Cannot be empty' },
          });
        } else {
          setModalState({
            ...modalState,
            [name]: { value, error: '' },
          });
        }
      }
    }
  };

  const submitAddUser = async (e) => {
    e.preventDefault();
    alert('Yes');
  };

  const initiateOnboarding = (profileId) => {
    apiService2.initiateOnboarding({ profileId });
  };

  const getLoginCred = async (profileId, username) => {
    await apiService2.getLoginCred1(profileId);
    await apiService.getLoginCred2({ profile_id: profileId, username });
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  return (
    <VAManageUserContext.Provider
      value={{
        openModal,
        modalMode,
        isLoading,
        employeeData,
        handleModal,
        submitAddUser,
        modalState,
        handleChange,
        initiateOnboarding,
        getLoginCred,
      }}>
      {props.children}
    </VAManageUserContext.Provider>
  );
};

export default VAManageEmployeeState;
