import { HttpClient } from '../../utils/op-http-client';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';

import {
  API_DATA_TYPE,
  Datum,
  modal,
  SelectedDataType,
} from 'src/types/response-types/client-admin/manage-users';
import { caManageUsersContextDefault } from 'src/contexts/client-admin/manage-users/ca-manage-users-context';

export class CAApiService {
  constructor(
    private httpClient: HttpClient,
    private clientId: string,
    private id: string,
  ) {}

  public setClientId(clientId: string) {
    this.clientId = clientId;
  }

  // Fecth all users MANAGE USER PAGE
  fetchAllUsersManageUserPage = async (): Promise<Datum[]> => {
    console.log('Client ID', this.clientId);
    const res = await this.httpClient.get<API_DATA_TYPE>(
      `/${this.clientId}/user?show_all=true&type=internal`,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show('Error fetching User Information');
      return caManageUsersContextDefault.API_DATA;
    }
    return res.data;
  };

  // Toggle between active and inactive user Manage User Page

  toggleUserState = async (vendorId): Promise<null> => {
    console.log('Client ID', this.clientId);
    const res = await this.httpClient.patch(
      `/${this.clientId}/user/${vendorId}`,
      { op: 'toggle', path: 'enabled' },
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show('Error Toggling User State');
      return null;
    }

    return null;
  };

  // Delete user Manage User Page

  deleteUser = async (vendorId): Promise<null> => {
    console.log('Client ID', this.clientId);
    const res = await this.httpClient.patch(
      `/${this.clientId}/user/${vendorId}`,
      { op: 'toggle', path: 'deleted' },
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show('Error Toggling User State');
      return null;
    }

    return null;
  };

  // Add a new User Manage User Page

  addNewUser = async (data: any, code: string): Promise<null> => {
    console.log('Client ID', this.clientId);
    let newData = {
      email: data.email,
      mobile: data.mobile,
      username: data.username,
      firstname: data.firstName,
      lastname: data.lastName,
      department_name: data.department_name,
    };

    const res = await this.httpClient.post(
      `/${this.clientId}/user/${code}`,
      newData,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show('Error Adding New User', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }

    return null;
  };

  // Update an Existing user:  Manage User Page

  updateUser = async (data: any, clientId: string): Promise<null> => {
    console.log('Client ID', this.clientId);
    const res = await this.httpClient.put(
      `/${this.clientId}/user/${clientId}`,
      data,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show('Error Updating New User', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }

    return null;
  };
}
