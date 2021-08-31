import { FetchManageUserResponseType } from 'src/types/response-types/vendor-admin/demand';
import { ManageUserType } from 'src/types/vendor-admin/demand';
import { isException } from 'src/utils/op-exception';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import { HttpClient } from '../../utils/op-http-client';

export class VAManageUserApiService {
  constructor(private httpClient: HttpClient, private vendorId: string) {}

  fetchManageUserData = async (vendorId): Promise<ManageUserType[] | null> => {
    const res = await this.httpClient.get<FetchManageUserResponseType>(
      `apis/v1/vendor/${vendorId}/user?show_all=true`,
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

  submitUser = async (vendorId, body): Promise<ManageUserType[] | null> => {
    console.log('Body in API: ', body);
    const res = await this.httpClient.post<FetchManageUserResponseType>(
      `apis/v1/vendor/${vendorId}/user/${body.role}`,
      {
        department_name: '',
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        mobile: body.mobile,
        username: body.username,
      },
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return null;
    }
    OPToast.show(`Successfully added a new user`, {
      variant: ToastVariant.SUCCESS,
    });
    return res.data;
    // return null;
  };

  updateUser = async (
    vendorId,
    userId,
    body,
  ): Promise<ManageUserType[] | null> => {
    console.log('Body: ', body);
    const res = await this.httpClient.put<FetchManageUserResponseType>(
      `apis/v1/vendor/${vendorId}/user/${userId}`,
      {
        email: body.email,
        firstName: body.firstname,
        lastName: body.lastname,
        mobile: body.mobile,
        username: body.username,
      },
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return null;
    }
    OPToast.show(`Successfully updated.`, {
      variant: ToastVariant.SUCCESS,
    });
    return res.data;
    // return null;
  };

  deleteUser = async (vendorId, userId) => {
    // console.log('Body: ', body);
    const res = await this.httpClient.patch<FetchManageUserResponseType>(
      `apis/v1/vendor/${vendorId}/user/${userId}`,
      {
        op: 'toggle',
        path: 'deleted',
      },
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
    }
    OPToast.show(`Successfully deleted.`, {
      variant: ToastVariant.SUCCESS,
    });
  };

  toggleActiveUser = async (vendorId, userId) => {
    // console.log('Body: ', body);
    const res = await this.httpClient.patch<FetchManageUserResponseType>(
      `apis/v1/vendor/${vendorId}/user/${userId}`,
      {
        op: 'toggle',
        path: 'enabled',
      },
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
    }
    OPToast.show(`Successfully disabled.`, {
      variant: ToastVariant.SUCCESS,
    });
  };
}
