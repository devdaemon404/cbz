import { createContext } from 'react';
import { ProjectManagerAPIService } from 'src/apis/project-manager/pm-api-service';

export type LoginType = {
  password: String;
  expiry: Number;
  username: String;
};

export type ErrorType = {
  passwordError: {
    errFlag: Boolean;
    errMsg: String;
  };
  userNameError: {
    errFlag: Boolean;
    errMsg: String;
  };
};

export interface LoginContextDataType {
  loginData: LoginType;
  handleLoginChange: (e: any) => void;
  loginOnSubmit: () => void;
  error: ErrorType;
  isLoading: Boolean;
  resetPassword: (values: any) => Promise<boolean>;
  resetAgain: boolean;
  setResetAgain: React.Dispatch<React.SetStateAction<boolean>>;
  resetPasswordWithUsername: (values: any) => Promise<void>;
  currentInitialValues: any;
  currentValidationSchema: any;
}

const LoginContextDefaultValue = {
  loginData: {
    password: '',
    expiry: 5,
    username: '',
  },
  handleLoginChange: () => null,
  loginOnSubmit: () => Promise.resolve(),
  error: {
    passwordError: {
      errFlag: false,
      errMsg: '',
    },
    userNameError: {
      errFlag: false,
      errMsg: '',
    },
  },
  isLoading: false,
  resetAgain: false,
  resetPassword: (values: any) => Promise.resolve(true),
  setResetAgain: () => false,
  resetPasswordWithUsername: (value: any) => Promise.resolve(),
  currentInitialValues: {
    new_password: '',
    confirm_password: '',
  },
  currentValidationSchema: {},
};

const LoginContext = createContext<LoginContextDataType>(
  LoginContextDefaultValue,
);

export default LoginContext;
