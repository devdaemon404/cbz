import { WorkOrderDataType } from '../../types/project-manager/workorder';
import {
  FetchAllVAWorkOrderResponseType,
  FetchWorkOrderResponseType,
} from '../../types/response-types/project-manager/demand';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';
import responseBaseV2 from 'src/types/response-types/response-base-v2';
import axios from 'axios';
import { saveAs } from 'file-saver';
import {
  CAProfileDataType,
  CAProfileDetailsDataType,
} from 'src/types/client-admin/workorder';
import {
  FetchCAProfileDetailsResponseType,
  FetchCAProfileResponseType,
} from 'src/types/response-types/client-admin/workorder';
import moment from 'moment';

export class CAWorkOrderApiService {
  private clientId;
  private vendorId;
  private userId;

  public setClientId(id) {
    this.clientId = id;
  }

  public setUserId(userId) {
    this.userId = userId;
  }

  public setVendorId(vendorId) {
    this.vendorId = vendorId;
  }

  constructor(private httpClient: HttpClient) {}

  fetchAllWorkOrders = async (userId): Promise<WorkOrderDataType[] | null> => {
    const res = await this.httpClient.get<FetchAllVAWorkOrderResponseType>(
      `/api/v2/work-order/client/${userId}`,
    );
    if (isException(res)) {
      console.log(res);
      OPToast.show('Error fetching workorders', {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    console.log('From API: ', res.workOrderData);
    return res.workOrderData;
  };

  fetchWorkOrder = async (workOrderId): Promise<WorkOrderDataType | null> => {
    const res = await this.httpClient.get<FetchWorkOrderResponseType>(
      `/api/v2/work-order/${workOrderId}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching workorders', {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  createWorkorder = async (
    data,
    profileId,
    demandId,
    vendorId,
  ): Promise<boolean> => {
    data.duration = Math.round(
      moment(new Date(data.endDate)).diff(
        new Date(data.startDate),
        'months',
        true,
      ),
    ).toString();

    // data.endDate = moment(data.endDate).format('DD-MM-YYYY');
    // data.startDate = moment(data.startDate).format('DD-MM-YYYY');

    console.log('data', data, profileId, demandId, this.clientId, vendorId);
    const res = await this.httpClient.post<any>(
      `/api/v2/work-order?clientId=${this.clientId}&vendorId=${vendorId}&demandId=${demandId}&profileId=${profileId}`,
      data,
    );
    if (isException(res)) {
      OPToast.show('Error creating workorder', {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Successfully created workorder', {
      variant: ToastVariant.SUCCESS,
      duration: 1000,
    });
    return false;
  };

  fetchProfiles = async (): Promise<CAProfileDataType[] | null> => {
    const res = await this.httpClient.get<FetchCAProfileResponseType>(
      `apis/v1/demand/client/profiles/enhanced?client_id=${this.clientId}&statuses=INTERVIEW_SUCCESS`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching profiles', {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  fetchProfileDetails = async (
    demand_id: string,
  ): Promise<CAProfileDetailsDataType | null> => {
    const res = await this.httpClient.get<FetchCAProfileDetailsResponseType>(
      `apis/v1/demand/${demand_id}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching profile details', {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.data;
  };

  updateWorkorder = async (body, workOrderId) => {
    console.log('BODY: ', workOrderId);
    let reqBody: any = {};
    reqBody.duration = Math.round(
      moment(new Date(body.endDate)).diff(
        new Date(body.startDate),
        'months',
        true,
      ),
    ).toString();

    reqBody.endDate = moment(body.endDate).format('DD-MM-YYYY');
    reqBody.startDate = moment(body.startDate).format('DD-MM-YYYY');
    reqBody.officialEmail = body.officialEmail;
    reqBody.currency = body.currency;
    reqBody.jobType = body.jobType;
    reqBody.rateCard = body.rateCard;
    reqBody.posReportsTo = body.posReportsTo;
    reqBody.requestedResource = body.requestedResource;
    reqBody.posId = body.posId;
    reqBody.posTitle = body.posTitle;

    // const reqData = JSON.stringify(body);

    const res = await this.httpClient.patch<responseBaseV2>(
      `/api/v2/work-order/${workOrderId}`,
      { ...reqBody, role: 'CLIENT_MANAGER' },
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show('Successfully Updated Workorder', {
        variant: ToastVariant.SUCCESS,
      });
    }
  };

  // Change the status of a particular profile
  rejectWorkorder = async (
    profileId: string,
    {
      profileRecruitmentId,
      status,
      note,
    }: { profileRecruitmentId: string; status: string; note?: string },
  ): Promise<boolean> => {
    const res = await this.httpClient.put(
      `/apis/v1/demand/recruitment/5f89803ee5daed54edb656ed/profile/${profileId}/status`,
      {
        note,
        profileStatus: status,
        vendor_note: false,
      },
    );
    if (isException(res)) {
      OPToast.show('Error rejecting workorder', {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  /** Download cv in workorder */
  awsDownloadFile = async (profile_id: string) => {
    console.log('Inside Download File');
    window.open(
      `https://test.app.cloudsbuzz.in/apis/v1/demand/profile/${profile_id}/file`,
      '_blank',
    );
    // const res = await this.httpClient.get<any>(
    //   `/apis/v1/demand/profile/${profile_id}/file`,
    // );

    // const profileData = await this.httpClient.get<any>(
    //   `/apis/v1/demand/profile/${profile_id}`,
    // );

    // const fileName = profileData.data.profile_file_name;
    // const fileType = profileData.data.profile_file_content_type;

    // console.log('FileName: ', fileName);
    // console.log('FileType: ', fileType);

    // const file = new Blob([res], {
    //   type: fileType,
    // });

    //Open the URL on new Window
    // saveAs(file, fileName);
    // console.log('Response from download file: ', res);
    // var blob = new Blob(res, {
    //   type: 'document/pdf',
    // });
    // saveAs(blob, 'filename.pdf');
    // if (isException(res)) {
    //   OPToast.show(res.message, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return null;
    // }
    // // const res = await this.httpClient.get<any>(
    // console.log('End of download file');

    // //   `/api/v2/file/work-order/get-url?filePath=${url}`,
    // // );
  };

  /** API to change the status of Work Order **/

  WorkOrderStatus = async (body, workOrderId) => {
    body.user_id = this.userId;

    console.log('BODY: ', body);
    const reqData = JSON.stringify(body);
    // "status": "DROPPED",
    // "role": "PM",
    // "user_id": "5f896f9ee5daed54edb656e0",
    // "suggestion": "string"

    const res = await this.httpClient.patch<responseBaseV2>(
      `/api/v2/work-order/status/${workOrderId}`,
      reqData,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show(`Already Approved/Dropped/Amended by this user`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show('Status Changed', {
        variant: ToastVariant.SUCCESS,
      });
    }
  };
}
