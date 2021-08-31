import React, { useEffect, useState } from 'react';
import router from 'server/routes/auth';
import { LoginApiService } from 'src/apis/login-api-service';
import { OPHttpClient } from 'src/utils/op-http-client';
import LoginContext, { ErrorType, LoginType } from './loginContext';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import formInitialValues from 'src/components/client-admin/demands/FormModel/formInitialValues';

const LoginState = (props) => {
  const router = useRouter();

  // instantiate api service
  const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in', {
    action: 'Login Management',
  });

  const token = props.token;

  const apiService = new LoginApiService(httpClient);

  // Loading Indicator
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const [resetAgain, setResetAgain] = useState<boolean>(props.reset === 'true');

  useEffect(() => {
    setResetAgain(props.reset === 'true');
    if (props.reset === 'true') {
      setCurrentValidationSchema(resetFormWithUsernameValidationSchema);
      setCurrentInitialValues(resetFormWithUsernameInitialValues);
    }
  }, [props.reset]);

  const resetFormInitialValues = {
    new_password: '',
    confirm_password: '',
  };

  const resetFormWithUsernameInitialValues = {
    username: '',
  };

  const resetFormValidationSchema = Yup.object().shape({
    new_password: Yup.string()
      .required('This field cannot be empty.')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Does not meet the requirement',
      ),
    confirm_password: Yup.string()
      .required('Does not match password')
      .oneOf([Yup.ref('new_password')], 'Does not match password.'),
  });

  const resetFormWithUsernameValidationSchema = Yup.object().shape({
    username: Yup.string().required('This field cannot be empty.'),
  });

  const [currentInitialValues, setCurrentInitialValues] = useState<any>(
    resetFormInitialValues,
  );

  const [currentValidationSchema, setCurrentValidationSchema] = useState<any>(
    resetFormValidationSchema,
  );

  // Error Flag
  const [error, setError] = useState<ErrorType>({
    passwordError: {
      errFlag: false,
      errMsg: '',
    },
    userNameError: {
      errFlag: false,
      errMsg: '',
    },
  });
  // Auth API body
  const [loginData, setLoginData] = useState<LoginType>({
    password: '',
    expiry: 120,
    username: '',
  });

  // Handling the Login onchange
  const handleLoginChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const resetPassword = async (values) => {
    setIsLoading(true);
    console.log(values);
    const res: any = await apiService.resetPassword({
      password: values.new_password,
      token,
    });
    console.log('result: ', res);
    if (res) {
      router.push('/app/login');
      setIsLoading(false);
      return true;
    } else {
      await setResetAgain((prev) => !prev);
      await setCurrentInitialValues(resetFormWithUsernameInitialValues);
      await setCurrentValidationSchema(resetFormWithUsernameValidationSchema);
      setIsLoading(false);
      return false;
    }
  };

  const resetPasswordWithUsername = async (values) => {
    setIsLoading(true);
    const res: any = await apiService.resetPasswordWithUsername({
      username: values.username,
    });
    if (res) {
      router.push('/app/login');
    }

    setIsLoading(false);
  };

  // Redirect After Login
  const goToUrl = async (scope) => {
    console.log({ scope });
    switch (scope) {
      case 'CLIENT_ADMIN':
      case 'CLIENT_MANAGER':
        await router.push('/app/client-admin/dashboard');
        break;
      case 'PROJECT_MANAGER':
        await router.push('/app/project-manager/dashboard');
        break;
      case 'ACCOUNTANT':
        await router.push('/app/account-and-finance/dashboard');
        break;
      case 'RECRUITER':
        await router.push('/app/recruiter/dashboard');
        break;
      case 'CONTRACTOR':
        await router.push('/app/employee/employee-dashboard');
        break;
      case 'VENDOR_ADMIN':
        await router.push('/app/vendor-admin/dashboard');
        break;
      case 'VICE_PRESIDENT':
        await router.push('/app/vice-president/dashboard');
        break;
      case 'SUPER_ADMIN':
        await router.push('/app/super-admin/dashboard');
    }
  };

  // On Login submit
  const loginOnSubmit = async () => {
    console.log('ONCLICK SUBMIT');
    if (loginData.username === '' && loginData.password === '') {
      console.log({ loginData });
      setError({
        ...error,
        userNameError: {
          errFlag: true,
          errMsg: 'Username cannot be Empty',
        },
        passwordError: {
          errFlag: true,
          errMsg: 'Password cannot be empty',
        },
      });
      return;
    } else if (loginData.username === '' && loginData.password !== '') {
      console.log({ loginData });
      setError({
        ...error,
        userNameError: {
          errFlag: true,
          errMsg: 'Username cannot be Empty',
        },
        passwordError: {
          errFlag: false,
          errMsg: '',
        },
      });
    } else if (loginData.username !== '' && loginData.password === '') {
      console.log({ loginData });
      setError({
        ...error,
        userNameError: {
          errFlag: false,
          errMsg: '',
        },
        passwordError: {
          errFlag: true,
          errMsg: 'Password cannot be Empty',
        },
      });
    } else if (loginData.username !== '' && loginData.password !== '') {
      console.log({ loginData });
      setError({
        ...error,
        userNameError: {
          errFlag: false,
          errMsg: '',
        },
        passwordError: {
          errFlag: false,
          errMsg: '',
        },
      });
      const body = JSON.stringify(loginData);
      console.log(body);
      setIsLoading(true);
      const res = await apiService.authenticateUser(body);
      await goToUrl(res);
      setIsLoading(false);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        loginData,
        handleLoginChange,
        loginOnSubmit,
        error,
        isLoading,
        resetPassword,
        resetAgain,
        setResetAgain,
        resetPasswordWithUsername,
        currentInitialValues,
        currentValidationSchema,
      }}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginState;
