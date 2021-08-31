import {
  InterviewRoundType,
  InterviewSlotInformationType,
  NotificationType,
  ProfileDataType,
} from '../../types/project-manager/demand';
import {
  FetchProfileDetailsResponseType,
  FetchInterviewProfilesResponseType,
  FetchAllNotificationResponseType,
  ProfileDataTypeResponseType,
  DashboardResponseType,
} from '../../types/response-types/project-manager/demand';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';

export class PMInterviewApiService {
  constructor(
    private httpClient: HttpClient,
    public profileId: string,
    public userId: string,
    public profileStatus: string,
  ) {}

  // For a given profile ID, fetch the interview slots available
  fetchInterviewRounds = async (): Promise<
    InterviewSlotInformationType[] | null
  > => {
    const res = await this.httpClient.get<FetchProfileDetailsResponseType>(
      `/apis/v1/demand/profile/${this.profileId}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching profile details', {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    const { interview_rounds: interviewRounds } = res.data;
    let { interview_slots: interviewSlots } = res.data;

    // TODO: Handling the case where there are no rounds as the profile is fresh
    if (!interviewRounds) {
      console.log('SLOTS-1', interviewSlots);
      return interviewSlots;
    }

    interviewRounds.forEach((round) => {
      interviewSlots = interviewSlots.map((slot) => {
        if (round.round === slot.round) {
          return {
            ...slot,
            status: round.status,
            selectedSlotId: round.time.id,
          };
        }
        return slot;
      });
    });
    console.log('SLOTS', interviewSlots);
    return interviewSlots;
  };

  // Request next round of interviews
  requestNextRound = async (): Promise<boolean> => {
    const res = await this.httpClient.put(
      `/apis/v1/interview/profile/${this.profileId}/interview/round/status`,
      {
        note: 'API Test',
        interview_status: 'NEXT_ROUND_REQUIRED',
      },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  setInterviewSuccess = async (
    isSuccess: boolean,
    rejectReason: string,
  ): Promise<boolean> => {
    const res = await this.httpClient.put(
      `/apis/v1/interview/profile/${this.profileId}/interview/round/status`,
      {
        note: 'API Test',
        interview_status: isSuccess ? 'SUCCESSFUL' : 'FAILURE',
        reason: rejectReason === '' ? undefined : rejectReason,
      },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  // Reschedule the current round of interviews
  rescheduleCurrentRound = async (): Promise<boolean> => {
    const res = await this.httpClient.put(
      `/apis/v1/interview/profile/${this.profileId}/interview/round/status`,
      {
        note: 'API Test',
        interview_status: 'RE_SCHEDULED',
      },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  // ??
  bookSlots = async (data: InterviewRoundType): Promise<boolean> => {
    const res = await this.httpClient.put(
      `/apis/v1/interview/profile/${this.profileId}/book/slots`,
      data,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show(`Slot Booked`, {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  slotRejection = async () => {
    const res = await this.httpClient.patch(
      `/apis/v1/interview/profile/${this.profileId}/interview/round/rejection`,
      { body: {} },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  changeProfileStatus = async ({
    profileRecruitmentId,
    status,
    note,
  }: {
    profileRecruitmentId: string | undefined;
    status: string;
    note?: string;
  }): Promise<boolean> => {
    if (this.profileStatus !== 'INTERVIEW_IN_PROCESS') {
      const res = await this.httpClient.put(
        `/apis/v1/demand/recruitment/${profileRecruitmentId}/profile/${this.profileId}/status`,
        {
          note,
          profileStatus: status,
          vendor_note: false,
        },
      );
      if (isException(res)) {
        if (
          res.message ===
          'Profile Status transitions not allowed from, INTERVIEW_IN_PROCESS to INTERVIEW_IN_PROCESS, it is already same'
        ) {
          return false;
        }
        OPToast.show('Error updating status', {
          variant: ToastVariant.ERROR,
        });
        return false;
      }
      return true;
    }
    return false;
  };

  sendNotification = async (event_id) => {
    const body = {
      event_id,
      // content: { profile_id: this.profileId },
      content: [{ name: 'profile_id', value: this.profileId }],
    };
    console.log('BODY: ', body);

    const res = await this.httpClient.post(
      `/apis/v1/notification/user/${this.userId}`,
      body,
    );

    if (isException(res)) {
      // console.log(res);
      OPToast.show(`Error sending notification ${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Sent notification!', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  getAllNotifications = async (userId): Promise<NotificationType[] | null> => {
    console.log('inside api call', userId);
    const res = await this.httpClient.get<FetchAllNotificationResponseType>(
      `/apis/v1/notification/user/${userId}/all`,
    );

    // const res2 = await this.httpClient.get<DashboardResponseType>(
    //   `/apis/v1/stats/pm?user_id=60804965197de8385c6b0992&status=ALL&profile_status=ALL`,
    // );
    console.log('from server', res);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      // console.log('MESSAGE', res.message);
      return null;
    }
    return res.data;
  };

  getProfileData = async (profileId): Promise<ProfileDataType | null> => {
    const res = await this.httpClient.get<ProfileDataTypeResponseType>(
      `/apis/v1/demand/profile/${profileId}`,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      // console.log('MESSAGE', res.message);
      return null;
    }
    return res.data;
  };

  notificationRead = async (id, userId) => {
    const res = await this.httpClient.post(
      `/apis/v1/notification/user/${userId}/acknowledge/${id}`,
      {},
    );
    // if (isException(res)) {
    //   OPToast.show(`${res.message}`, {
    //     variant: ToastVariant.ERROR,
    //   });
    // }
  };

  getDashboardData = async (): Promise<any> => {
    const res = await this.httpClient.get<DashboardResponseType>(
      `/apis/v1/stats/pm?user_id=60804965197de8385c6b0992&status=ALL&profile_status=ALL`,
    );
    console.log('from server', res);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      // console.log('MESSAGE', res.message);
      return null;
    }
    return res.data;
  };
}
