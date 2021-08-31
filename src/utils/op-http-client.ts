import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { OPApiException, OPException, OPHttpException } from './op-exception';

export interface HttpClient {
  baseUrl: string;
  customHeaders?: any;
  action: string;

  get<T>(endPoint: string): Promise<T | OPException>;

  post<T>(endPoint: string, body: any, config?: any): Promise<T | OPException>;

  put<T>(endPoint: string, body: any): Promise<T | OPException>;

  patch<T>(endPoint: string, body: any): Promise<T | OPException>;

  delete<T>(endPoint: string, body: any): Promise<T | OPException>;
}

/**
 * The Request class which houses all types of requests that can be made.
 * Requires the endpoint to be provided
 */
export class OPHttpClient implements HttpClient {
  baseUrl: string;
  action: string;
  customHeaders?: any;
  axiosInstance: AxiosInstance;

  static init(
    baseUrl,
    { action, customHeaders }: { action: string; customHeaders?: any },
  ): OPHttpClient {
    return new OPHttpClient(baseUrl, { action, customHeaders });
  }

  constructor(
    baseUrl: string,
    { customHeaders, action }: { customHeaders?: any; action: string },
  ) {
    this.baseUrl = baseUrl;
    this.customHeaders = customHeaders;
    this.action = action;
    const config = {
      withCredentials: true,
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    };
    this.axiosInstance = axios.create(config);
  }

  // GET Request
  async get<RESPONSE_TYPE>(
    endPoint: string,
  ): Promise<RESPONSE_TYPE | OPException> {
    try {
      // console.log('Getting', this.baseUrl + endPoint);
      const response = await this.axiosInstance.get(endPoint);
      // This throws OPExceptions
      OPHttpClient.handleResponseError(response);
      return response.data as RESPONSE_TYPE;
    } catch (e: any) {
      return this.handleRequestError(e);
    }
  }

  // POST Request
  async post<RESPONSE_TYPE>(
    endPoint: string,
    body: any,
    config?: any,
  ): Promise<RESPONSE_TYPE | OPException> {
    try {
      const response = await this.axiosInstance.post(endPoint, body, config);
      OPHttpClient.handleResponseError(response);
      return response.data as RESPONSE_TYPE;
    } catch (e: any) {
      return this.handleRequestError(e);
    }
  }

  // PUT Request
  async put<RESPONSE_TYPE>(
    endPoint: string,
    body: any,
  ): Promise<RESPONSE_TYPE | OPException> {
    try {
      const response = await this.axiosInstance.put(endPoint, body);
      OPHttpClient.handleResponseError(response);
      return response.data as RESPONSE_TYPE;
    } catch (e) {
      return this.handleRequestError(e);
    }
  }

  // PATCH Request
  async patch<RESPONSE_TYPE>(
    endPoint: string,
    body: any,
  ): Promise<RESPONSE_TYPE | OPException> {
    try {
      const response = await this.axiosInstance.patch(endPoint, body);
      OPHttpClient.handleResponseError(response);
      return response.data as RESPONSE_TYPE;
    } catch (e) {
      return this.handleRequestError(e);
    }
  }

  // DELETE Request
  async delete<RESPONSE_TYPE>(
    endPoint: string,
  ): Promise<RESPONSE_TYPE | OPException> {
    try {
      const response = await this.axiosInstance.delete(endPoint);
      OPHttpClient.handleResponseError(response);
      return response.data as RESPONSE_TYPE;
    } catch (e: any) {
      return this.handleRequestError(e);
    }
  }

  // Responsible for handling any type of API/HTTP/Network failures and
  // modeling them into the OPException class, before throwing up the
  // call stack
  private static handleResponseError(response: AxiosResponse) {
    const { success, message } = response.data;
    if (success !== undefined && !success) {
      throw new OPApiException({
        message: 'API Failed',
        action: 'API Action',
      });
    }
  }

  private handleRequestError(error: any): OPException {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      const message = axiosError.response?.data?.message ?? axiosError.message;
      return new OPHttpException({
        action: this.action,
        message,
      });
    } else return error as OPException;
  }
}

export class MockHTTPClient implements HttpClient {
  action = 'Mock HTTP Client';
  baseUrl = 'Mock URL';

  delete<T>(endPoint: string, body: any): Promise<OPException | T> {
    return Promise.resolve({} as T);
  }

  get<T>(endPoint: string): Promise<OPException | T> {
    return Promise.resolve({} as T);
  }

  post<T>(endPoint: string, body: any, config?: any): Promise<OPException | T> {
    return Promise.resolve({} as T);
  }

  put<T>(endPoint: string, body: any): Promise<OPException | T> {
    return Promise.resolve({} as T);
  }

  patch<T>(endPoint: string, body: any): Promise<OPException | T> {
    return Promise.resolve({} as T);
  }
}
