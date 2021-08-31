import { HttpClient } from '../../utils/op-http-client';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { FetchManageClientsResponseType } from 'src/types/response-types/super-admin/manage-clients';
import { ManageClientType } from 'src/types/super-admin/manage-clients';
import { validateRequest } from 'server/middleware/validate-request';

export class SAManageClientsApiService {
  constructor(private httpClient: HttpClient) {}

  fetchManageClientData = async (
    showAll,
  ): Promise<ManageClientType[] | null> => {
    const res = await this.httpClient.get<FetchManageClientsResponseType>(
      `apis/v1/client?show_all=${showAll}`,
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

  submitClient = async (data): Promise<boolean | null> => {
    const res = await this.httpClient.post(`apis/v1/client`, {
      ...data,
      // password: '',
      // enabled: true,
      deleted: false,
    });

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return null;
    }
    OPToast.show(`Successfully added a new client`, {
      variant: ToastVariant.SUCCESS,
    });
    return true;
    // return null;
  };

  updateClient = async (userId, data) => {
    const res = await this.httpClient.put(`apis/v1/client/${userId}`, data);

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
  };

  deleteClient = async (userId) => {
    // console.log('Body: ', body);
    const res = await this.httpClient.patch(`apis/v1/client/${userId}`, {
      op: 'toggle',
      path: 'deleted',
    });

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

  toggleActive = async (userId) => {
    const res = await this.httpClient.patch(`apis/v1/client/${userId}`, {
      op: 'toggle',
      path: 'enabled',
    });
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
    }
  };
}
