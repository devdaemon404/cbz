import { ProfileDataType } from 'src/types/project-manager/demand';
import {
  FetchInterviewProfilesResponseType,
  FetchVAProfileResponseType,
  FetchVendorInterviewProfilesResponseType,
} from 'src/types/response-types/project-manager/demand';
import {
  FreezeSlotRequestType,
  ProfileDetailsDataType,
  VAProfileDataType,
} from 'src/types/vendor-admin/demand';
import { isException } from 'src/utils/op-exception';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';

export class VAInterviewApiService {
  constructor(private httpClient: HttpClient) {}
  private userId;
  private profileId;

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public setProfileId(profileId: string) {
    this.profileId = profileId;
  }

  // API Call to fetch profiles which are in process
  // /apis/v1/demand/vendor/profiles?vendor_ids=[ID's]&statuses=INTERVIEW_IN_PROCESS
  fetchAllOnGoingVendorInterviews = async (
    vendorId: string,
    role: string,
  ): Promise<VAProfileDataType[] | null> => {
    let res: any;
    // if (role === 'RECRUITER') {
    //   res = await this.httpClient.get<FetchVendorInterviewProfilesResponseType>(
    //     `/apis/v1/demand/recruiter/profiles/detailed/all?recruiter_user_id=${vendorId}&statuses=INTERVIEW_IN_PROCESS`,
    //   );
    // } else
    if (role === 'VENDOR_ADMIN' || role === 'RECRUITER') {
      res = await this.httpClient.get<FetchVendorInterviewProfilesResponseType>(
        // `/apis/v1/demand/vendor/profiles?vendor_ids=${vendorId}&statuses=INTERVIEW_IN_PROCESS`,
        `/apis/v1/demand/vendor/profiles?vendor_ids=${vendorId}`,
      );
    } else if (role === 'CLIENT_ADMIN') {
      res = await this.httpClient.get<FetchVendorInterviewProfilesResponseType>(
        `/apis/v1/demand/client/profiles/detailed?client_id=${vendorId}&statuses=INTERVIEW_IN_PROCESS`,
      );
    }
    console.log({ res });
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return null;
    }
    return res.data;
  };

  // Get a slots and rounds for a profiles
  // /apis/v1/demand/profile/{profile_id}

  fetchProfileData = async (
    profileId,
  ): Promise<ProfileDetailsDataType | null> => {
    const res = await this.httpClient.get<FetchVAProfileResponseType>(
      `/apis/v1/demand/profile/${profileId}`,
    );
    console.log({ res });
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return null;
    }
    const profile = res.data;
    if (profile.interview_slots) {
      // @ts-ignore
      profile.interviewSlotsArr = [...Object.values(profile.interview_slots)];
    }
    if (profile.interview_rounds) {
      // @ts-ignore
      profile.interviewRoundsArr = [...Object.values(profile.interview_rounds)];
    }
    for (const slot of profile.interviewSlotsArr) {
      for (const round of profile.interviewRoundsArr) {
        if (slot.round === round.round) {
          slot.selectedSlotId = round.slot_id;
        }
      }
    }

    return res.data;
  };

  // Freeze slots for a given profile ID
  freezeSlots = async (data: FreezeSlotRequestType) => {
    const res = await this.httpClient.put(
      `/apis/v1/interview/profile/${data.profileId}/freeze/slot`,
      {
        round: data.roundNumber,
        slot_id: data.slotId,
        round_description: data.roundDescription,
        notes: 'Notes',
      },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show(`Slot Frozen`, {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  // Rejection of a slot
  slotRejection = async (profile_id) => {
    const res = await this.httpClient.patch(
      `/apis/v1/interview/profile/${profile_id}/interview/round/rejection`,
      { body: {} },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show(`Slot Rejected`, {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  sendNotification = async (event_id, profile) => {
    let body: any = null;
    console.log(profile);
    if (event_id === 'INTERVIEW_SLOTS_REJECTED') {
      body = {
        event_id,
        content: [
          { name: 'profile_id', value: this.profileId },
          { name: 'reject_reason', value: profile.rejectReason },
        ],
      };
    } else if (event_id === 'INTERVIEW_SCHEDULED') {
      const fromTime = new Date(profile.selectedSlot.from);
      const toTime = new Date(profile.selectedSlot.to);
      const timezone = profile.selectedSlot.raw.zone_name;
      body = {
        event_id,
        content: [
          { name: 'profile_id', value: profile.profileId },
          { name: 'start_year', value: fromTime.getFullYear().toString() },
          { name: 'start_month', value: fromTime.getMonth().toString() },
          { name: 'start_day', value: fromTime.getDate().toString() },
          { name: 'start_hour', value: fromTime.getHours().toString() },
          { name: 'start_min', value: fromTime.getMinutes().toString() },
          { name: 'end_year', value: toTime.getFullYear().toString() },
          { name: 'end_month', value: toTime.getMonth().toString() },
          { name: 'end_day', value: toTime.getDate().toString() },
          { name: 'end_hour', value: toTime.getHours().toString() },
          { name: 'end_min', value: toTime.getMinutes().toString() },
          { name: 'timezone', value: timezone },
        ],
      };
    } else {
      const fromTime = new Date(profile.selectedSlot.from);
      const toTime = new Date(profile.selectedSlot.to);
      const timezone = profile.selectedSlot.raw.zone_name;
      body = {
        event_id,
        content: [
          { name: 'profile_id', value: profile.profileId },
          { name: 'start_year', value: fromTime.getFullYear().toString() },
          { name: 'start_month', value: fromTime.getMonth().toString() },
          { name: 'start_day', value: fromTime.getDate().toString() },
          { name: 'start_hour', value: fromTime.getHours().toString() },
          { name: 'start_min', value: fromTime.getMinutes().toString() },
          { name: 'end_year', value: toTime.getFullYear().toString() },
          { name: 'end_month', value: toTime.getMonth().toString() },
          { name: 'end_day', value: toTime.getDate().toString() },
          { name: 'end_hour', value: toTime.getHours().toString() },
          { name: 'end_min', value: toTime.getMinutes().toString() },
          { name: 'timezone', value: timezone },
        ],
      };
    }
    console.log('BODY: ', body);

    const res = await this.httpClient.post(
      `/apis/v1/notification/user/${this.userId}`,
      body,
    );

    if (isException(res)) {
      console.log(res);
      OPToast.show(`Error sending notification ${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    } else {
      OPToast.show('Sent notification!', {
        variant: ToastVariant.SUCCESS,
      });
      return true;
    }
  };
}
