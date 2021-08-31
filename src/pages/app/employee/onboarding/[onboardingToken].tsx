import { Fragment } from 'react';
import Head from 'next/head';

import OnboardingState from '../../../../contexts/employee/onboardingState';
import OnboardingBase from '../../../../components/project-manager/onboarding';
import { OnboardingAPIService } from '../../../../apis/employee/onboarding';
import { isException } from '../../../../utils/op-exception';
import { ContactInformationType } from '../../../../types/employee/onboarding';
import { OPHttpClient } from '../../../../utils/op-http-client';
import { Constants } from '../../../../utils/constants';

interface OnboardingPagePropType {
  isAuthenticated: boolean;
  contactInformation?: ContactInformationType;
}

interface OnboardingSSPropType {
  props?: OnboardingPagePropType;
  redirect?: any;
}

export async function getServerSideProps(
  context,
): Promise<OnboardingSSPropType> {
  const { onboardingToken } = context.query;
  const httpClient = OPHttpClient.init(Constants.API_V2_URL, {
    action: 'Onboarding Validation Check',
    customHeaders: {
      'x-onboarding-token': onboardingToken,
    },
  });
  const apiService = new OnboardingAPIService(httpClient);
  console.log('API V2', Constants.API_V2_URL);
  console.log('API V1', Constants.API_V1_URL);
  const res = await apiService.fetchContactInfo();
  console.log(res);
  if (isException(res)) {
    return {
      redirect: {
        permanent: false,
        destination: '/app/404',
      },
    };
  }
  if (res?.data)
    return {
      props: {
        isAuthenticated: true,
        contactInformation: res?.data,
      },
    };
  else
    return {
      props: {
        isAuthenticated: true,
      },
    };
}

const OnboardingPage = (props: OnboardingPagePropType) => {
  if (!props.isAuthenticated) {
    return <div>404</div>;
  }
  return (
    <Fragment>
      <Head>
        <title>OP-Onboarding</title>
      </Head>
      <OnboardingState contactInformation={props.contactInformation}>
        <OnboardingBase />
      </OnboardingState>
    </Fragment>
  );
};

export default OnboardingPage;
