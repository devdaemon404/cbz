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
} from '../../types/response-types/project-manager/demand';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';

export class DashboardApiService {
  constructor(
    private httpClient: HttpClient,
    public profileId: string,
    public userId: string,
  ) {}

  getDashboardData = async () => {
    const res: any = await this.httpClient.get(
      `apis/v1/stats/ca?client_id=${this.profileId}&demand_status=ALL&profile_status=ALL`,
    );
    return res.data;
  };

  getVendorDashboardData = async () => {
    const res: any = await this.httpClient.get(
      `apis/v1/stats/contractors?vendor_id=${this.profileId}`,
    );

    const res2: any = await this.httpClient.get(
      `apis/v1/stats/vendor/demands?vendor_id=${this.profileId}`,
    );

    return { contractors: res.data, demands: res2?.data };
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
}
