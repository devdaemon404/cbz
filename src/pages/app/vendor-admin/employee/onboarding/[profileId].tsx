import { Typography } from '@material-ui/core';
import React from 'react';
import { OnboardingAPIService } from 'src/apis/employee/onboarding';
import OnboardingSubmission from 'src/components/vendor-admin/employee/OnboardingSubmission';
import VABaseLayout from 'src/components/vendor-admin/VABaseLayout';
import OnboardingState from 'src/contexts/employee/onboardingState';
import { isException } from 'src/utils/op-exception';
import { OPHttpClient } from 'src/utils/op-http-client';
import {
  defaultUnauthorizedResponse,
  verifyVendorAdmin,
} from '../../../../../utils/auth/verify-cookie';

export async function getServerSideProps(context) {
  console.log(context.query);
  const { profileId } = context.query;
  console.log(profileId);

  const result = await verifyVendorAdmin(context);
  if ('redirect' in result) {
    return result;
  }
  const v2URL = `${process.env.V2_API_URL}/api/v2`;

  const httpClientV2 = OPHttpClient.init(v2URL, {
    action: 'Onboarding Data',
  });

  const _apiServiceV2 = new OnboardingAPIService(httpClientV2);
  const res = await _apiServiceV2.getEmployeeOnboardingData(profileId);
  if (!res || isException(res)) {
    return {
      props: {
        onboardingData: null,
        userName: result.props.userName,
      },
    };
  }
  console.log({ res });
  return {
    props: {
      onboardingData: res,
      userName: result.props.userName,
    },
  };
}

const VAEmpOnboarding = (props) => {
  console.log(props.onboardingData);
  return (
    <OnboardingState>
      <VABaseLayout userName={props.userName} sidebarIndex={2}>
        {props.onboardingData ? (
          <OnboardingSubmission
            onboardingData={props.onboardingData.onboardingData}
          />
        ) : (
          <Typography variant='h3'>
            No onboarding Data for current profile
          </Typography>
        )}
      </VABaseLayout>
    </OnboardingState>
  );
};

export default VAEmpOnboarding;
