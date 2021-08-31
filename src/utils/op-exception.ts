/*
 * Abstract class which defines the properties of any Excpetions which might occur
 * */
export interface OPException {
  message: string;
  error?: string;
  action: string;
  type: string;
  _exceptionBdcwbsywxtqcezxz: boolean;
}

export function isException(object: any): object is OPException {
  return '_exceptionBdcwbsywxtqcezxz' in object;
}

/**
 * Catch and handle any API Exceptions where success was undefined or false
 */
export class OPApiException implements OPException {
  action: string;
  message: string;
  type: string;
  _exceptionBdcwbsywxtqcezxz = true;

  constructor({ action, message }: { action: string; message: string }) {
    this.action = action;
    this.message = message;
    this.type = '[ API EXCEPTION ]';
  }
}

/**
 * Catch and handle HTTP Exceptions where the response is not 200
 */
export class OPHttpException implements OPException {
  action: string;
  message: string;
  type: string;
  _exceptionBdcwbsywxtqcezxz = true;

  constructor({ action, message }: { action: string; message: string }) {
    this.action = action;
    this.message = message;
    this.type = '[ HTTP EXCEPTION ]';
  }
}

/**
 * Catch and handle any Network exception that occurs
 */

export class OPNetworkException implements OPException {
  action: string;
  message: string;
  type: string;
  _exceptionBdcwbsywxtqcezxz = true;

  constructor({ action, message }: { action: string; message: string }) {
    this.action = action;
    this.message = message;
    this.type = ' [ NETWORK EXCEPTION ]';
  }
}
