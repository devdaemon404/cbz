import { OPHttpClient } from '../op-http-client';
import { isException } from '../op-exception';
import cookie from 'cookie';
import { v1ApiUrl } from '../../../server/config/keys';
import { GetServerSidePropsContext } from 'next';

export const defaultUnauthorizedResponse = {
  redirect: {
    permanent: false,
    destination: '/404',
  },
};

export type UnauthorizedUserBaseType = {
  props?: {};
  redirect: {
    permanent: boolean;
    destination: string;
  };
};

export type AuthorizedUserBaseType = {
  props: {
    userName: string;
    id?: string;
    clientId?: string;
    userId?: string;
  };
};

export const retrieveAuthHeader = (context) => {
  const accessToken = cookie.parse(context.req.headers.cookie).access_token;
  // console.log('ACCESS TOKEN', accessToken);
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// Verify a project manager's login credentials through httponly cookies
export const verifyProjectManager = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Project Manager Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(res);
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'PROJECT_MANAGER') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        clientId: res?.data?.client_id,
        userId: res?.data?.id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a vendor manager's login credentials through httponly cookies
export const verifyVendorAdmin = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Vendor Manager Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'VENDOR_ADMIN') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        userId: res.data.vendor.id,
        id: res.data.id,
        clientId: res.data.client_id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a vendor manager's login credentials through httponly cookies
export const verifySuperAdmin = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Super Admin Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'SUPER_ADMIN') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        // userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        userName: res.data.username,
        userId: res.data.id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a Recruitment manager's login credentials through httponly cookies
export const verifyRecruitmentManager = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Recruitment Manager Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(res);
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'RECRUITER_MANAGER') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        id: res?.data?.vendor.id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a recruiter login credentials through httponly cookies
export const verifyRecruiter = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Recruiter Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(res);
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'RECRUITER') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }

    console.log('LOGIN**************');
    return {
      props: {
        userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        id: res?.data?.id,
        vendorId: res.data.vendor.id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a VP login credentials through httponly cookies
export const verifyVicePresident = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Vice President Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(res);
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'VICE_PRESIDENT') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        id: res?.data?.id,
        clientId: res.data.client_id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a client admin's login credentials through httponly cookies
export const verifyClientAdmin = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    console.log('inside verify client admin');
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Client Admin Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(res);
    console.log(res.data.roles[0].role);
    console.log(retrieveAuthHeader(context));
    if (isException(res)) {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    if (
      res.data.roles[0].role !== 'CLIENT_MANAGER' &&
      res.data.roles[0].role !== 'CLIENT_ADMIN'
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        clientId: res?.data?.client_id,
        id: res?.data?.id,
        role: res.data.roles[0].role,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a CONTRACTOR's login credentials through httponly cookies
export const verifyContractor = async (
  context: GetServerSidePropsContext,
): Promise<any> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Employee/contractor Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(res);
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'CONTRACTOR') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        userId: res.data.id,
        userName: res?.data?.username,
        id: res?.data?.employee_id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};

// Verify a vendor manager's login credentials through httponly cookies
export const verifyAccountAndFinance = async (
  context: GetServerSidePropsContext,
): Promise<AuthorizedUserBaseType | UnauthorizedUserBaseType> => {
  try {
    const httpClient = OPHttpClient.init(v1ApiUrl, {
      action: 'Vendor Manager Validation Check',
      customHeaders: retrieveAuthHeader(context),
    });
    const res = await httpClient.get<any>('/apis/v1/check/user');
    console.log(retrieveAuthHeader(context));
    if (isException(res) || res.data.roles[0].role !== 'ACCOUNTANT') {
      return {
        redirect: {
          permanent: false,
          destination: '/app/404',
        },
      };
    }
    return {
      props: {
        userName: `${res?.data?.firstname ?? ''} ${res?.data?.lastname ?? ''}`,
        userId: res.data.id,
        vendorId: res.data.vendor.id,
        clientId: res.data.client_id,
      },
    };
  } catch (e) {
    console.log('Error parsing Access Token from cookie');
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
};
