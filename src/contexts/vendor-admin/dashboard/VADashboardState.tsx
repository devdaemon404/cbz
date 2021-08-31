import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { OPToast } from 'src/utils/op-toast';
import { OPHttpClient } from 'src/utils/op-http-client';
import { useRouter } from 'next/router';

import { DashboardApiService } from 'src/apis/common/dashboard-api-service';
import VADashboardContext from './va-dashboard-context';
import { NotificationType } from 'src/types/project-manager/demand';

const VADashboardState = (props) => {
  // API URLs
  const router = useRouter();
  const v1URL = 'https://test.app.cloudsbuzz.in/';
  const v2URL = `${process.env.V2_API_URL}/api/v2`;

  const httpClient = OPHttpClient.init(v1URL, {
    action: 'Dashboard Notification',
  });

  const vendorId = props.vendorId;
  const userId = props.userId;

  const apiService = new DashboardApiService(httpClient, vendorId, userId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allNotifications, setAllNotifications] = useState<NotificationType[]>(
    [],
  );

  const sendNotification = async (event): Promise<boolean> => {
    setIsLoading(true);
    const res = await apiService.sendNotification(event);
    setIsLoading(false);
    return res;
  };

  const getAllNotifications = async () => {
    setIsLoading(true);
    const res = await apiService.getAllNotifications(userId);
    if (res) await setAllNotifications(res);
    setIsLoading(false);
  };

  const notificationRead = async (id, userId) => {
    setIsLoading(true);
    await apiService.notificationRead(id, userId);
    setIsLoading(false);
  };

  const getDashboardData = async () => {
    setIsLoading(true);
    const res = await apiService.getVendorDashboardData();
    setIsLoading(false);
    return res;
  };

  const redirectFromNotification = async (
    type,
    id,
    user_id,
    read,
    profileId,
    rejectReason,
  ) => {
    if (!read) {
      await notificationRead(id, user_id);
    }
    if (type == 'INTERVIEW') {
      // await router.push(`/app/project-manager/interview`);
      await router.push({
        pathname: '/app/vendor-admin/va-interview',
        query: { profileId: profileId, rejectReason: rejectReason },
      });
    }
  };

  return (
    <VADashboardContext.Provider
      value={{
        isLoading,
        sendNotification,
        getAllNotifications,
        redirectFromNotification,
        allNotifications,
        notificationRead,
        getDashboardData,
      }}>
      {props.children}
    </VADashboardContext.Provider>
  );
};

export default VADashboardState;
