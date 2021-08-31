import { createContext } from 'react';
import {
  InterviewRoundType,
  InterviewSlotInformationType,
  NotificationType,
  ProfileDataType,
} from '../../../types/project-manager/demand';
import { PMInterviewApiService } from '../../../apis/project-manager/pm-interview-api-service';
import { MockHTTPClient } from '../../../utils/op-http-client';

type PMInterviewContextDataType = {
  interviewRounds: InterviewSlotInformationType[];
  fetchInterviewSlots: (profile?: any) => void;
  bookSlots: (data: InterviewRoundType) => Promise<boolean>;
  sendNotification: (event: any) => Promise<boolean>;
  updateProfileStatus: (status: any) => Promise<boolean>;
  fetchInterview: () => Promise<void>;
  isLoading: boolean;
  profiles: ProfileDataType[];
  requestNextRound: () => Promise<boolean>;
  setInterviewSuccess: (isSuccess: boolean) => Promise<boolean>;
  rescheduleCurrentRound: () => Promise<boolean>;
  apiService: PMInterviewApiService;
  notificationRead: (id: any, userId: any) => Promise<void>;
  getAllNotifications: () => Promise<void>;
  allNotifications: NotificationType[];
  interviewDialogOpened: boolean;
  setInterviewDialogOpened: React.Dispatch<React.SetStateAction<boolean>>;
  rejectSlot: () => Promise<boolean>;
  redirectFromNotification: (
    type: any,
    id: any,
    user_id: any,
    read: any,
    profileId: any,
    rejectReason?: any,
  ) => Promise<void>;
  areYouSureOpen: boolean;
  setAreYouSureOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rejectReason: string;
  setRejectReason: React.Dispatch<React.SetStateAction<string>>;
  getDashboardData: () => Promise<any>;
};

export const pmInterviewContextDefault: PMInterviewContextDataType = {
  fetchInterviewSlots: () => null,
  interviewRounds: [],
  bookSlots: () => Promise.resolve(false),
  isLoading: false,
  sendNotification: (event: any) => Promise.resolve(false),
  fetchInterview: () => Promise.resolve(),
  profiles: [],
  updateProfileStatus: (status: any) => Promise.resolve(false),
  requestNextRound: () => Promise.resolve(false),
  rescheduleCurrentRound: () => Promise.resolve(false),
  setInterviewSuccess: () => Promise.resolve(false),
  notificationRead: (id: any, userId: any) => Promise.resolve(),
  rejectSlot: () => Promise.resolve(false),
  // @ts-ignore
  apiService: new PMInterviewApiService(new MockHTTPClient(), null),
  getAllNotifications: () => Promise.resolve(),
  allNotifications: [],
  interviewDialogOpened: false,
  setInterviewDialogOpened: () => false,
  redirectFromNotification: () => Promise.resolve(),
  areYouSureOpen: false,
  setAreYouSureOpen: () => false,
  rejectReason: '',
  setRejectReason: () => '',
  getDashboardData: () => Promise.resolve(),
};

const PMInterviewContext = createContext<PMInterviewContextDataType>(
  pmInterviewContextDefault,
);

export default PMInterviewContext;
