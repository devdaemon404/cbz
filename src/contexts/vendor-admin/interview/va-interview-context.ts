import { createContext } from 'react';
import {
  ProfileDetailsDataType,
  VAProfileDataType,
} from '../../../types/vendor-admin/demand';
import { InterviewSlotInformationType } from '../../../types/project-manager/demand';

type VAInterviewContextDataType = {
  profiles: VAProfileDataType[];
  isLoading: boolean;
  currentProfileIndex: number;
  isInterviewModalOpen: boolean;
  setCurrentProfileIndex: (index: number) => void;
  setIsInterviewModalOpen: (isOpen: boolean) => void;
  currentProfile: ProfileDetailsDataType | null | undefined;
  fetchInterview: () => Promise<void>;
  fetchProfile: (profileId: any) => Promise<void>;
  freezeSlot: ({
    profileId,
    roundNumber,
    roundDescription,
    slotId,
  }: {
    profileId: string;
    roundNumber: number;
    slotId: string;
    roundDescription: string;
  }) => Promise<boolean>;
  rejectSlot: (profile_id: any) => Promise<boolean>;
  sendNotification: (event: any, profileId: any) => Promise<boolean>;
};

export const vaInterviewContextDefault: VAInterviewContextDataType = {
  profiles: [],
  currentProfile: null,
  isLoading: false,
  currentProfileIndex: 0,
  isInterviewModalOpen: false,
  setCurrentProfileIndex: () => null,
  setIsInterviewModalOpen: () => null,
  fetchInterview: () => Promise.resolve(),
  fetchProfile: () => Promise.resolve(),
  freezeSlot: () => Promise.resolve(false),
  rejectSlot: () => Promise.resolve(false),
  sendNotification: (event: any, profileId: any) => Promise.resolve(false),
};

const VAInterviewContext = createContext<VAInterviewContextDataType>(
  vaInterviewContextDefault,
);

export default VAInterviewContext;
