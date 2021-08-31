import React, { ReactElement, useEffect, useState } from 'react';
import { OPHttpClient } from '../../../utils/op-http-client';
import {
  FreezeSlotRequestType,
  ProfileDetailsDataType,
  VAProfileDataType,
} from '../../../types/vendor-admin/demand';
import { VAInterviewApiService } from 'src/apis/vendor-admin/va-interview-api-service';
import VAInterviewContext from './va-interview-context';
import { useRouter } from 'next/router';

const VAInterviewState = ({
  id,
  role,
  children,
}: {
  id: string;
  role: string;
  children: ReactElement;
}) => {
  // HTTP Client
  const router = useRouter();
  const [profiles, setProfiles] = useState<VAProfileDataType[]>([]);
  const [
    currentProfile,
    setCurrentProfile,
  ] = useState<ProfileDetailsDataType | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(0);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState<boolean>(
    false,
  );

  const httpClient = OPHttpClient.init(`${process.env.V1_API_URL}`, {
    action: 'Get All Interview Profiles',
  });
  // Instantiate an API Service
  const _apiService = new VAInterviewApiService(httpClient);

  const fetchInterview = async () => {
    setIsLoading(true);
    const res = await _apiService.fetchAllOnGoingVendorInterviews(id, role);
    console.log('INTERVIEW DATA', res);
    if (res) setProfiles(res);
    setIsLoading(false);
  };

  const fetchProfile = async (profileId) => {
    setIsLoading(true);
    const res = await _apiService.fetchProfileData(profileId);
    if (res) setCurrentProfile(res);
    setIsLoading(false);
  };

  const freezeSlot = async (data: FreezeSlotRequestType): Promise<boolean> => {
    setIsLoading(true);
    const res = await _apiService.freezeSlots(data);

    if (res) {
      fetchInterview();
    }
    setIsLoading(false);
    return res;
  };

  const rejectSlot = async (profile_id): Promise<boolean> => {
    setIsLoading(true);
    const res = await _apiService.slotRejection(profile_id);
    if (res) {
      fetchInterview();
    }
    setIsLoading(false);
    return res;
  };

  const sendNotification = async (event, profile): Promise<boolean> => {
    setIsLoading(true);
    _apiService.setUserId(id);
    if (event === 'INTERVIEW_SLOTS_REJECTED') {
      console.log('INSIDE STATE', profile.id);
      _apiService.setProfileId(profile.id);
    } else if (event === 'INTERVIEW_SCHEDULED') {
      _apiService.setProfileId(profile.profileId);
    } else {
      _apiService.setProfileId(profile);
    }
    const res = await _apiService.sendNotification(event, profile);
    setIsLoading(false);
    return res;
  };

  const openDailog = async (id) => {
    setIsLoading(true);
    const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in/', {
      action: 'Open Interview Dialog from Notification',
    });
    const profileData = await _apiService.fetchProfileData(
      router.query.profileId,
    );
    console.log('profileData: ', profileData);
    await fetchProfile(id);
    await setIsInterviewModalOpen(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query.profileId) {
      openDailog(router.query.profileId);
    }
  }, []);

  useEffect(() => {
    fetchInterview();
  }, []);

  return (
    <VAInterviewContext.Provider
      value={{
        isLoading,
        isInterviewModalOpen,
        setIsInterviewModalOpen,
        fetchInterview,
        fetchProfile,
        profiles,
        currentProfile,
        currentProfileIndex,
        freezeSlot,
        rejectSlot,
        setCurrentProfileIndex,
        sendNotification,
      }}>
      {children}
    </VAInterviewContext.Provider>
  );
};

export default VAInterviewState;
