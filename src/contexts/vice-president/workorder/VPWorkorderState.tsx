import React, { useEffect, useState } from 'react';
import VPWorkorderContext from './vp-workorder-context';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import { OPHttpClient } from 'src/utils/op-http-client';
import { PMWorkOrderApiService } from 'src/apis/project-manager/pm-workorder-api-service';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';
import { VAWorkOrderApiService } from 'src/apis/vendor-admin/va-workorder-api-service';
import { useRouter } from 'next/router';

const VPWorkorderState = (props) => {
  const router = useRouter();
  // API URLs
  const URL = `${process.env.V2_API_URL}/`;
  const V1URL = `${process.env.V1_API_URL}/`;
  console.log(V1URL);

  const httpClient = OPHttpClient.init(URL, {
    action: 'Vendor Admin Workorder Management',
  });
  const httpClientV1 = OPHttpClient.init(V1URL, {
    action: 'Vendor Admin Workorder Management',
  });

  const apiService = new VAWorkOrderApiService(httpClient);
  const apiServiceV1 = new VAWorkOrderApiService(httpClientV1);

  const userId = props.userId;
  const workorderId = props.workorderId;

  apiService.setUserId(userId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestReason, setSuggestReason] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<number>(0);
  const [
    currentWorkorder,
    setCurrentWorkorder,
  ] = useState<WorkOrderDataType | null>();

  const [workorder, setWorkorder] = useState<WorkOrderDataType | null>();

  const changeWorkorderStatus = async (status, workorderId, suggestReason) => {
    interface Data {
      status: string;
      role: string;
      suggestion?: string;
    }
    if (status === 'AMEND' && suggestReason.trim().length === 0) {
      OPToast.show(`Reason cannot be empty.`, {
        variant: ToastVariant.ERROR,
      });
      return;
    }
    setIsLoading(true);
    const data: Data = {
      status,
      role: 'VICE_PRESIDENT',
    };
    if (suggestReason && suggestReason.trim().length > 0) {
      data.suggestion = suggestReason;
    }
    apiService.setUserId(userId);
    await apiService.WorkOrderStatus(data, workorderId);
    setSuggestReason('');
    await router.push(`/app/vice-president/work-orders`);
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
  }, [currentWorkorder]);

  useEffect(() => {
    if (workorderId) getWorkOrder();
  }, []);

  return (
    <VPWorkorderContext.Provider
      value={{
        downloadFile,
        isLoading,
        selectedVersion,
        setSelectedVersion,
        handleVersionChange,
        currentWorkorder,
        changeWorkorderStatus,
        suggestReason,
        setSuggestReason,
      }}>
      {props.children}
    </VPWorkorderContext.Provider>
  );
};

export default VPWorkorderState;
