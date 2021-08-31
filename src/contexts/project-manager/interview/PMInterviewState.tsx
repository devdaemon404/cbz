import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import PMInterviewContext from './pm-interview-context';
import {
  InterviewRoundType,
  InterviewSlotInformationType,
  NotificationType,
  ProfileDataType,
} from '../../../types/project-manager/demand';
import { ProjectManagerAPIService } from '../../../apis/project-manager/pm-api-service';
import { MockHTTPClient, OPHttpClient } from '../../../utils/op-http-client';
import { PMInterviewApiService } from '../../../apis/project-manager/pm-interview-api-service';
import PMDemandContext from '../demand/pm-demand-context';
import { OPToast, ToastVariant } from 'src/utils/op-toast';

const PMInterviewState = (props) => {
  // The interview slots in the current profile
  const router = useRouter();
  const clientId = props.clientId;
  const userId = props.userId;
  const [interviewRounds, setInterviewRounds] = useState<
    InterviewSlotInformationType[]
  >([]);
  const { getAllProfilesForDemand } = useContext(PMDemandContext);

  const [apiService, setApiService] = useState<PMInterviewApiService>(
    // @ts-ignore
    new PMInterviewApiService(new MockHTTPClient(), null),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<ProfileDataType[]>([]);
  const [
    currentProfileIdForNotification,
    setCurrentProfileIdForNotification,
  ] = useState<string>('123');
  const [allNotifications, setAllNotifications] = useState<NotificationType[]>(
    [],
  );

  const [interviewDialogOpened, setInterviewDialogOpened] = useState(false);
  const [openFromNotification, setOpenFromNotification] = useState(false);
  const [areYouSureOpen, setAreYouSureOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Fetch slots for a given profile and set it in the state
  const fetchInterviewSlots = async (profile?: any) => {
    // Check if either a profile is provided or an API service already exists
    setIsLoading(true);
    let profileId;
    if (profile) {
      const { id } = profile;
      profileId = id;
    }
    if (!profileId && !apiService) {
      // No profile instantiated
      throw new Error('Profile not specified');
    }
    // Either use an existing profile or a new profile
    let _profileStatus = apiService.profileStatus;
    if (profile) {
      _profileStatus = profile.profile_status || apiService.profileStatus;
    }
    const _profile = profileId || apiService.profileId;
    const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in', {
      action: 'Project Manager Interview Management',
    });
    // Instantiate an API Service
    const _apiService = new PMInterviewApiService(
      httpClient,
      _profile,
      userId,
      _profileStatus,
    );
    setApiService(_apiService);
    setInterviewRounds([]);
    const slots = await _apiService.fetchInterviewRounds();
    setIsLoading(false);

    if (!slots) return;
    setInterviewRounds([...slots]);
  };

  // Book slots for the current profile
  const bookSlots = async (data: InterviewRoundType): Promise<boolean> => {
    setIsLoading(true);
    console.log(typeof apiService);
    const res = await apiService.bookSlots(data);
    if (res) {
      await fetchInterviewSlots();
    }
    setIsLoading(false);
    return res;
  };

  const rejectSlot = async (): Promise<boolean> => {
    setIsLoading(true);
    const res = await apiService.slotRejection();
    if (res) {
      fetchInterview();
    }
    setIsLoading(false);
    return res;
  };

  const fetchInterview = async () => {
    setIsLoading(true);
    const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in/', {
      action: 'Get All Interview Profiles',
    });
    const _apiService = new ProjectManagerAPIService(httpClient);
    _apiService.setUserId(userId);
    const res = await _apiService.fetchAllOnGoingInterviews();
    if (res) setProfiles(res);
    setIsLoading(false);
  };

  // Request for a next round of interviews
  const requestNextRound = async (): Promise<boolean> => {
    setIsLoading(true);
    const res = await apiService.requestNextRound();
    if (res) {
      await fetchInterviewSlots();
    }
    setIsLoading(false);
    return res;
  };

  const updateProfileStatus = async (status) => {
    setIsLoading(true);
    const res = await apiService.changeProfileStatus({
      status,
      profileRecruitmentId: undefined,
      note: 'Changed status to interview in process',
    });

    setIsLoading(false);
    return res;
  };

  // Request for a next round of interviews
  const rescheduleCurrentRound = async (): Promise<boolean> => {
    setIsLoading(true);
    const res = await apiService.rescheduleCurrentRound();
    if (res) {
      await fetchInterviewSlots();
    }
    setIsLoading(false);
    return res;
  };

  const setInterviewSuccess = async (isSuccess: boolean): Promise<boolean> => {
    if (isSuccess === false) {
      if (rejectReason === '') {
        OPToast.show(`Please enter reason for rejection.`, {
          variant: ToastVariant.ERROR,
          duration: 4000,
        });
        return false;
      }
    }
    setIsLoading(true);
    const res = await apiService.setInterviewSuccess(isSuccess, rejectReason);
    if (res) await sendNotification('INTERVIEW_FAILURE');
    if (res) {
      const { demandId } = router.query;
      await getAllProfilesForDemand(demandId as string);
    }
    setIsLoading(false);
    return res;
  };

  const sendNotification = async (event): Promise<boolean> => {
    setIsLoading(true);
    const res = await apiService.sendNotification(event);
    setIsLoading(false);
    return res;
  };

  const getAllNotifications = async () => {
    setIsLoading(true);
    console.log('fetching all notiftaion');
    const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in/', {
      action: 'Get All Notifications',
    });
    const _apiService = new PMInterviewApiService(httpClient, '', userId, '');
    const res = await _apiService.getAllNotifications(userId);
    if (res) await setAllNotifications(res);
    console.log('fetched notifcations: ', res);
    setIsLoading(false);
  };

  const notificationRead = async (id, userId) => {
    setIsLoading(true);
    const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in/', {
      action: 'Notification Read',
    });
    const _apiService = new PMInterviewApiService(httpClient, '', userId, '');
    const res = await _apiService.notificationRead(id, userId);
    setIsLoading(false);
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
    console.log('Type', type);
    if (type == 'INTERVIEW') {
      // await router.push(`/app/project-manager/interview`);
      await router.push({
        pathname: '/app/project-manager/interview',
        query: { profileId: profileId, rejectReason: rejectReason },
      });
    }
    if (type === 'TIME') {
      await router.push({
        pathname: '/app/project-manager/timesheet',
      });
    }
  };

  const openDailog = async () => {
    setIsLoading(true);
    const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in/', {
      action: 'Open Interview Dialog from Notification',
    });
    const _apiService = new PMInterviewApiService(httpClient, '', userId, '');
    const profileData = await _apiService.getProfileData(
      router.query.profileId,
    );
    console.log('profileData: ', profileData);
    await fetchInterviewSlots(profileData);
    await setInterviewDialogOpened(true);
    setIsLoading(false);
  };

  const getDashboardData = async () => {
    setIsLoading(true);
    const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in/', {
      action: 'Notification Read',
    });
    const _apiService = new PMInterviewApiService(httpClient, '', userId, '');
    const res = await _apiService.getDashboardData();
    setIsLoading(false);
    return res;
  };

  useEffect(() => {
    if (router.query.profileId) {
      openDailog();
    }
  }, []);

  return (
    <PMInterviewContext.Provider
      value={{
        sendNotification,
        getDashboardData,
        getAllNotifications,
        redirectFromNotification,
        allNotifications,
        interviewRounds,
        fetchInterviewSlots,
        notificationRead,
        bookSlots,
        isLoading,
        requestNextRound,
        rescheduleCurrentRound,
        setInterviewSuccess,
        updateProfileStatus,
        apiService,
        fetchInterview,
        rejectSlot,
        profiles,
        interviewDialogOpened,
        setInterviewDialogOpened,
        areYouSureOpen,
        setAreYouSureOpen,
        rejectReason,
        setRejectReason,
      }}>
      {props.children}
    </PMInterviewContext.Provider>
  );
};

export default PMInterviewState;
// export default Object.assign(InterviewState, { apiService: new InterviewApiService(new MockHTTPClient(), null) });
