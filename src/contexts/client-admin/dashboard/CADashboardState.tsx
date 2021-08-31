import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { OPToast } from 'src/utils/op-toast';
import { OPHttpClient } from 'src/utils/op-http-client';
import { useRouter } from 'next/router';

import { DashboardApiService } from 'src/apis/common/dashboard-api-service';
import CADashboardContext from './ca-dashboard-context';
import { NotificationType } from 'src/types/project-manager/demand';

const CADashboardState = (props) => {
  // API URLs
  const router = useRouter();
  const v1URL = 'https://test.app.cloudsbuzz.in/';
  const v2URL = `${process.env.V2_API_URL}/api/v2`;

  const httpClient = OPHttpClient.init(v1URL, {
    action: 'Dashboard Notification',
  });

  const clientId = props.clientId;
  const userId = props.userId;

  const apiService = new DashboardApiService(httpClient, clientId, userId);

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
    const res = await apiService.getDashboardData();
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
        pathname: '/app/client-admin/interview',
        query: { profileId: profileId, rejectReason: rejectReason },
      });
    }
  };

  return (
    <CADashboardContext.Provider
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
    </CADashboardContext.Provider>
  );
};

export default CADashboardState;
