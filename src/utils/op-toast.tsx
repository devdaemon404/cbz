import toaster from 'toasted-notes';
import React from 'react';
import Alert from '@material-ui/lab/Alert/Alert';

export enum ToastPosition {
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom',
}

export enum ToastVariant {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

interface OPToastOptionType {
  position?: ToastPosition;
  variant?: ToastVariant;
  duration?: number;
}

export class OPToast {
  public static show(
    message: string,
    options: OPToastOptionType = {
      variant: ToastVariant.INFO,
      position: ToastPosition.TOP_RIGHT,
      duration: 1000,
    },
  ): void {
    toaster.notify(
      ({ onClose }) => (
        <Alert
          style={{ marginTop: 10, marginRight: 10 }}
          severity={options.variant}>
          {message}
        </Alert>
      ),
      { position: 'top-right', duration: options.duration },
    );
  }
}
