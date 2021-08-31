import { HttpClient } from '../../utils/op-http-client';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';

import {
  API_DATA_TYPE,
  API_DATA_TYPE_CALL,
  Datum,
  Model,
} from 'src/types/response-types/client-admin/manage-vendors';
import { CAManageVendorsDefault } from 'src/contexts/client-admin/manage-vendors/ca-manage-vendors-context';

export class CAApiService {
  constructor(
    private httpClient: HttpClient,
    private clientId: string,
    private id: string,
  ) {}

  public setClientId(clientId: string) {
    this.clientId = clientId;
    console.log('Client ID is CAVM ', clientId);
  }
  public setId(id: string) {
    this.id = id;
    console.log('ID is CAVM', id);
  }

  // Fecth all users MANAGE Vendors PAGE
  fetchAllUsersManageVendorsPage = async (): Promise<Datum[]> => {
    console.log('Client ID', this.clientId);
    const res = await this.httpClient.get<API_DATA_TYPE_CALL>(
      `/client/${this.clientId}/vendors?show_all=true`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching Vendor Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      // @ts-ignore
      return CAManageVendorsDefault.API_DATA.data;
    }
    return res.data;
  };

  // Update vendors data
  updateVendors = async (vendorId: string, data) => {
    const res = await this.httpClient.put(`/client/vendor/${vendorId}`, data);
    if (isException(res)) {
      OPToast.show('Error fetching Vendor Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }
    return null;
  };

  // Add vendors data
  addVendors = async (vendorId: string, data) => {
    const res = await this.httpClient.post(`${this.clientId}/user/VA`, data);
    if (isException(res)) {
      OPToast.show('Error fetching Vendor Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }
    return null;
  };

  // delete or inactivate user
  deleteInactivate = async (vendorId: string, action: string) => {
    let data = {
      op: 'toggle',
      path: action,
    };
    const res = await this.httpClient.patch(`/client/vendor/${vendorId}`, data);
    if (isException(res)) {
      OPToast.show('Error in Toggling Vendor Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }
    return null;
  };
}
