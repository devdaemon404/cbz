import { isException } from 'src/utils/op-exception';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import { HttpClient } from '../utils/op-http-client';

export class LoginApiService {
  constructor(private httpClient: HttpClient) {}

  // API to authenticate the USER
  authenticateUser = async (body): Promise<String> => {
    console.log('Body in API: ', body);
    const res = await this.httpClient.post<any>(`apis/v1/authenticate`, body);

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return '';
    }
    return res.scope;
  };

  resetPassword = async (data) => {
    const res = await this.httpClient.post<any>(
      '/apis/v1/changePassword',
      data,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return false;
    }
    OPToast.show('Password successfully reset.', {
      variant: ToastVariant.SUCCESS,
      duration: 1000,
    });
    return true;
  };

  resetPasswordWithUsername = async (data) => {
    const res = await this.httpClient.post<any>('/apis/v1/resetPassword', data);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return false;
    }

    OPToast.show('A mail has been sent to given email id', {
      variant: ToastVariant.SUCCESS,
      duration: 1000,
    });
    return true;
  };
}
