import { HttpClient, OPHttpClient } from '../../utils/op-http-client';
import {
  OTPResponseType,
  OnboardingFormSubmitResponseType,
  DocumentUploadResponseType,
  ContactInfoResponseType,
} from '../../types/response-types/employee/onboarding';
import { isException, OPException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import axios from 'axios';

/**
 * TODO
 * Work on BASE_URL
 * BASE_URL should come form process.env
 */
const BASE_URL = 'http://localhost:3000';

export class OnboardingAPIService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  // Upload an onboarding document from an employee
  uploadFile = async (file: File) => {
    const fileExtension = file.name.split('.').pop();

    const body = JSON.stringify({
      fileType: 'onboarding',
      fileExtension,
      fileName: file.name,
    });

    const res = await this.httpClient.post<DocumentUploadResponseType>(
      '/api/v2/file/onboarding/upload-url',
      body,
    );
    if (isException(res)) {
      // This is of type OPException
      OPToast.show('Error Uploading File');
      console.log(res.message);
    } else {
      // This is of type OTPResponseType
      console.log(res);
      return res;
    }
  };

  sendOTP = async (): Promise<boolean> => {
    const res = await this.httpClient.get<OTPResponseType>(
      '/api/v2/employee/onboarding-send-otp',
    );
    if (isException(res)) {
      console.log(res.message);
      OPToast.show('Error sending OTP');
      return false;
    } else {
      console.log(res);
      OPToast.show(res.message);
      return true;
    }
  };

  submitData = async (
    body,
  ): Promise<OnboardingFormSubmitResponseType | undefined> => {
    const res = await this.httpClient.post<OnboardingFormSubmitResponseType>(
      '/api/v2/employee/onboarding',
      body,
    );
    if (isException(res)) {
      OPToast.show('Invalid OTP');
      console.log(res.message);
    } else {
      console.log(res);
      OPToast.show(res.message);
      return res;
    }
  };

  fetchContactInfo = async (): Promise<
    ContactInfoResponseType | OPException
  > => {
    const res = await this.httpClient.get<ContactInfoResponseType>(
      '/api/v2/employee/contact-info',
    );
    if (isException(res)) {
      // This is of type OPException
      console.log(res);
      return res;
    } else {
      // This is of type OTPResponseType
      // OPToast.show(res);
      return res;
    }
  };

  awsDocumentUpload = async (url: string, file: File): Promise<void> => {
    const inputFormData = new FormData();
    inputFormData.append('file', file);
    const res = await axios.put(url, inputFormData) ;
    console.log(res);
  };

  awsDownloadFile = async (url: string) => {
    const res = await this.httpClient.get<any>(
      `/api/v2/file/work-order/get-url?filePath=${url}`,
    );
    return res.data.url;
  };

  // Vendor onboarding data
  getEmployeeOnboardingData = async (profileId): Promise<any | null> => {
    const res = await this.httpClient.get<any>(`employee/profile/${profileId}`);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return res.onboardingData;
  };
}
