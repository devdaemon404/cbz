import { FetchManageUserResponseType } from 'src/types/response-types/vendor-admin/demand';
import {
  ManageEmployeeSingle,
  ManageEmployeeType,
  ManageUserType,
} from 'src/types/vendor-admin/demand';
import { isException } from 'src/utils/op-exception';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import { profile } from 'winston';
import { HttpClient } from '../../utils/op-http-client';

export class VAManageEmployeeApiService {
  constructor(private httpClient: HttpClient, private vendorId: string) {}

  fetchManageEmployeeData = async (
    vendorId,
  ): Promise<ManageEmployeeSingle[] | null> => {
    const res = await this.httpClient.get<ManageEmployeeType>(
      `apis/v1/demand/vendor/profiles/enhanced?vendor_id=${vendorId}&statuses=INTERVIEW_SUCCESS`,
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return null;
    }

    return res.data;
  };

  getLoginCred2 = async (profileId): Promise<void> => {
    const res: any = await this.httpClient.post('/apis/v1/employee', profileId);
    if (!isException(res)) {
      OPToast.show(`${res?.message}`, {
        variant: ToastVariant.SUCCESS,
      });
      return;
    }

    OPToast.show(`${res.message}`, {
      variant: ToastVariant.ERROR,
    });
  };
}

export class VAManageEmployeeApiService2 {
  constructor(private httpClient: HttpClient, private vendorId: string) {}

  initiateOnboarding = async (profileId): Promise<void> => {
    const res: any = await this.httpClient.post(
      '/api/v2/admin/onboarding-url',
      profileId,
    );
    if (!isException(res)) {
      OPToast.show(`${res?.message}`, {
        variant: ToastVariant.SUCCESS,
      });
      return;
    }

    OPToast.show(`${res.message}`, {
      variant: ToastVariant.ERROR,
    });
  };

  getLoginCred1 = async (profileId) => {
    const res: any = await this.httpClient.get(
      `api/v2/employee/profile/${profileId}`,
    );
    if (!isException(res)) {
      OPToast.show(`${res?.message}`, {
        variant: ToastVariant.SUCCESS,
      });
      return;
    }

    OPToast.show(`${res.message}`, {
      variant: ToastVariant.ERROR,
    });
  };
}
