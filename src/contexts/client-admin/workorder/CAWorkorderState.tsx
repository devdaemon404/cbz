import React, { useEffect, useState } from 'react';
import CAWorkorderContext, {
  caWorkorderContextDefault,
} from './ca-workorder-context';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import { OPHttpClient } from 'src/utils/op-http-client';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';
import {
  CAProfileDataType,
  CAProfileDetailsDataType,
} from 'src/types/client-admin/workorder';
import { CAWorkOrderApiService } from 'src/apis/client-admin/ca-workorder-api-service';
import moment from 'moment';

const CAWorkorderState = (props) => {
  // API URLs
  const URL = `${process.env.V2_API_URL}/`;
  const V1URL = `${process.env.V1_API_URL}/`;
  // console.log(V1URL);

  const httpClient = OPHttpClient.init(URL, {
    action: 'Client Admin Workorder Management',
  });
  const httpClientV1 = OPHttpClient.init(V1URL, {
    action: 'Client Admin Workorder Management',
  });

  const apiService = new CAWorkOrderApiService(httpClient);
  const apiServiceV1 = new CAWorkOrderApiService(httpClientV1);

  const userId = props.userId;
  const workorderId = props.workorderId;
  const role = props.role;

  apiService.setUserId(userId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [createPageShow, setCreatePageShow] = useState<boolean>(false);
  const [suggestReason, setSuggestReason] = useState<string>('');
  const [amendSuggestion, setAmendSuggestion] = useState<string>('');

  const [selectedVersion, setSelectedVersion] = useState<number>(0);
  const [
    currentWorkorder,
    setCurrentWorkorder,
  ] = useState<WorkOrderDataType | null>();
  const [initialWorkorderFormValues, setInitialWorkorderFormValues] = useState(
    caWorkorderContextDefault.initialWorkorderFormValues,
  );

  const [currentDemandId, setCurrentDemandId] = useState<string>('');
  const [currentWorkorderId, setCurrentWorkorderId] = useState<string>('');
  const [currentVendorId, setCurrentVendorId] = useState<string>('');
  const [currentProfileId, setCurrentProfileId] = useState<string>('');

  const [profiles, setProfiles] = useState<CAProfileDataType[]>([]);

  const [workorder, setWorkorder] = useState<WorkOrderDataType | null>();

  const [editMode, setEditMode] = useState<boolean>(false);

  const changeWorkorderStatus = async (
    status,
    workorderId,
    suggestion = '',
  ) => {
    interface Data {
      status: string;
      role: string;
      suggestion?: string;
    }
    if (status === 'AMEND' && suggestion.trim().length === 0) {
      OPToast.show(`Reason cannot be empty.`, {
        variant: ToastVariant.ERROR,
      });
      return;
    }
    setIsLoading(true);
    const data: Data = {
      status,
      role: 'VENDOR_ADMIN',
    };
    if (suggestion.trim().length > 0) {
      data.suggestion = suggestion;
    }
    apiService.setUserId(userId);
    await apiService.WorkOrderStatus(data, workorderId);
    setSuggestReason('');
    setIsLoading(false);
  };

  const createWorkorder = async (values) => {
    setIsLoading(true);
    apiService.setClientId(props.clientId);
    const data = values;
    await apiService.createWorkorder(
      data,
      currentProfileId,
      currentDemandId,
      currentVendorId,
    );
    setIsLoading(false);
  };

  const rejectWorkorder = async (note) => {
    setIsLoading(true);
    apiService.rejectWorkorder(currentProfileId, {
      profileRecruitmentId: '',
      status: 'DROPPED',
      note,
    });
    setIsLoading(false);
  };

  const updateWorkorder = async (values) => {
    setIsLoading(true);
    apiService.updateWorkorder(values, currentWorkorderId);
    setIsLoading(false);
  };

  const fetchProfiles = async () => {
    setIsLoading(true);
    apiServiceV1.setClientId(props.clientId);
    const res = await apiServiceV1.fetchProfiles();
    if (res) {
      setProfiles(res);
    }
    setIsLoading(false);
  };

  const fetchProfileDetails = async (demandId, profileId) => {
    setIsLoading(true);
    const tempProfile = profiles.filter((p) => p.id === profileId);
    const currentProfile = tempProfile.length > 0 ? tempProfile[0] : undefined;
    const res = await apiServiceV1.fetchProfileDetails(demandId);
    let profileDetails: CAProfileDetailsDataType | null = null;
    if (res) {
      profileDetails = res;
    }
    if (currentProfile && profileDetails) {
      await setCurrentDemandId(currentProfile.demand_id);
      await setCurrentProfileId(currentProfile.id);
      await setCurrentVendorId(currentProfile.vendor_id);
      console.log('initialkdjaslkdjflaksjdf', initialWorkorderFormValues);
      await setInitialWorkorderFormValues({
        ...initialWorkorderFormValues,
        requestedResource: `${currentProfile.firstname} ${currentProfile.lastname}`,
        officialEmail: '',
        workId: '',
        posId: currentProfile.request_id,
        posReportsTo: `${profileDetails.user_first_name} ${profileDetails.user_last_name}`,
        posTitle: profileDetails.name,
        rateType: '',
        currency: currentProfile.rate_currency,
        startDate: new Date(profileDetails.startDate),
        endDate: new Date(profileDetails.startDate).setMonth(
          new Date(profileDetails.startDate).getMonth() +
            profileDetails.duration,
        ),
        // duration: monthDiff,
        jobType: profileDetails.additional_info.employment_type,
        contractedFee: '',
        estimatedTotalSpend: '',
        estimatedRemainingBudget: '',
        allowExpenses: '',
        cvLink: currentProfile.profile_file_id,
      });
    }
    setIsLoading(false);
  };

  const setEditInitialValues = async () => {
    setIsLoading(true);
    console.log(
      'Inside editring:',
      currentWorkorder,
      currentWorkorder?.data.startDate,
      currentWorkorder?.data.endDate,
    );
    if (currentWorkorder) {
      await setInitialWorkorderFormValues({
        ...initialWorkorderFormValues,
        ...currentWorkorder.data,
        // @ts-ignore
        startDate: new Date(
          currentWorkorder.data.startDate.split('-').reverse().join('-'),
        ),
        endDate: new Date(
          currentWorkorder.data.endDate.split('-').reverse().join('-'),
        ),
        officialEmail: currentWorkorder.data.officialEmail,
        rateType: currentWorkorder.data.rateType,
      });
    }
    setIsLoading(false);
  };

  const downloadFile = async (profileId) => {
    setIsLoading(true);
    const res = await apiServiceV1.awsDownloadFile(profileId);
    console.log('URL: ', res);
    setIsLoading(false);
  };

  const getWorkOrder = async () => {
    setIsLoading(true);
    const workorder = await apiService.fetchWorkOrder(workorderId);
    if (workorder && workorder.data) {
      await setWorkorder({ ...workorder });
      // @ts-ignore
      if (workorder.data.changes.length > 0) {
        // @ts-ignore
        await setSelectedVersion(workorder.data.changes.length);
      } else {
        await setCurrentWorkorder(workorder);
      }
    }
    setIsLoading(false);
  };

  const getCurrentWorkOrder = async (id) => {
    setIsLoading(true);
    const workorder: any = await apiService.fetchWorkOrder(id);
    let latestWO = { ...workorder.data };
    // @ts-ignore
    for (const change of workorder.data?.changes) {
      // @ts-ignore
      console.log('Changes: ', change);
      latestWO = { ...latestWO, ...change };
    }
    console.log('****DDD*****', latestWO);
    setCurrentWorkorder({
      ...workorder,
      data: {
        ...workorder.data,
        // @ts-ignore
        ...latestWO,
      },
    });
    setIsLoading(false);
  };

  const handleVersionChange = async (value) => {
    setSelectedVersion(value);
  };

  const changeCurrentWorkorder = async () => {
    setIsLoading(true);

    if (workorder && selectedVersion != 0) {
      let latestWO = { ...workorder.data };
      // @ts-ignore
      for (const change of workorder.data?.changes.slice(0, selectedVersion)) {
        // @ts-ignore
        latestWO = { ...latestWO, ...change };
      }
      console.log(latestWO);
      setCurrentWorkorder({
        ...workorder,
        data: {
          ...workorder.data,
          // @ts-ignore
          ...latestWO,
        },
      });
    }
    if (selectedVersion === 0) {
      setCurrentWorkorder(workorder);
    }
    console.log('Workorder Changed');
    setIsLoading(false);
  };

  useEffect(() => {
    changeCurrentWorkorder();
  }, [selectedVersion]);

  useEffect(() => {
    console.log('Current', currentWorkorder);
    if (currentWorkorderId) {
      console.log('insidijhijeditinitialvalues');
      setEditInitialValues();
    }
  }, [currentWorkorder]);

  useEffect(() => {
    if (currentWorkorderId) {
      console.log('workorderjk', currentWorkorderId);
      getCurrentWorkOrder(currentWorkorderId);
    }
  }, [currentWorkorderId]);

  const openEditForm = async () => {
    setIsLoading(true);
    await setCreatePageShow(true);
    await setEditMode(true);
    // await setCurrentWorkorderId('');
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentWorkorderId) openEditForm();
    console.log('Form values', initialWorkorderFormValues, currentWorkorder);
  }, [initialWorkorderFormValues]);

  useEffect(() => {
    if (workorderId) getWorkOrder();
  }, []);

  useEffect(() => {
    console.log('profileId ', currentProfileId);
  }, [currentProfileId]);

  return (
    <CAWorkorderContext.Provider
      value={{
        downloadFile,
        isLoading,
        openModal,
        setOpenModal,
        selectedVersion,
        setSelectedVersion,
        handleVersionChange,
        currentWorkorder,
        changeWorkorderStatus,
        suggestReason,
        setSuggestReason,
        createPageShow,
        setCreatePageShow,
        initialWorkorderFormValues,
        fetchProfiles,
        profiles,
        fetchProfileDetails,
        createWorkorder,
        role,
        amendSuggestion,
        setAmendSuggestion,
        editMode,
        setEditMode,
        updateWorkorder,
        setCurrentWorkorderId,
        rejectWorkorder,
      }}>
      {props.children}
    </CAWorkorderContext.Provider>
  );
};

export default CAWorkorderState;
