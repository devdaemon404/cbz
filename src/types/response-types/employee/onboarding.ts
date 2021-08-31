import responseBaseV2 from '../response-base-v2';
import { ContactInformationType } from '../../employee/onboarding';

export type OTPResponseType = {} & responseBaseV2;

export type OnboardingFormSubmitResponseType = {} & responseBaseV2;

export type DocumentUploadResponseType = {
  data: {
    fileKey: string;
    url: string;
  };
} & responseBaseV2;

export type ContactInfoResponseType = {
  data: ContactInformationType
} & responseBaseV2;
