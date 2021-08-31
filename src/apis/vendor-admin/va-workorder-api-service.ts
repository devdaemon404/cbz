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

export class VAWorkOrderApiService {
  private clientId;
  private userId;

  public setClientId(id) {
    this.clientId = id;
  }

  public setUserId(userId) {
    this.userId = userId;
  }

  constructor(private httpClient: HttpClient) {}

  fetchAllWorkOrders = async (userId): Promise<WorkOrderDataType[] | null> => {
    const res = await this.httpClient.get<FetchAllVAWorkOrderResponseType>(
      `/api/v2/work-order/vendor/${userId}`,
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
