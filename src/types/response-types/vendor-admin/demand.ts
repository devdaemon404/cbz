import ResponseBaseV1 from '../response-base-v1';
import {
  DemandDataType,
  InterviewRoundInformationType,
  InterviewSlotType,
  ProfileDataType,
  VAProfileDataType,
} from '../../project-manager/demand';
import {
  ComplianceDocumentsType,
  ManageUserType,
  ProfileDetailsDataType,
} from '../../vendor-admin/demand';

export type FetchDemandProfilesResponseType = {
  data: [ProfileDetailsDataType];
} & ResponseBaseV1;

export type FetchComplianceDocumentResponseType = {
  data: ComplianceDocumentsType[];
} & ResponseBaseV1;

export type FetchManageUserResponseType = {
  data: ManageUserType[];
} & ResponseBaseV1;

export type DemandDetailsResponseType = {
  data: {
    demand: DemandDataType;
    recruitment: {
      id: string;
    };
  };
} & ResponseBaseV1;

export type FetchVAProfilesResponseType = {
  data: VAProfileDataType[];
} & ResponseBaseV1;

export type FetchVAProfileResponseType = {
  data: VAProfileDataType;
} & ResponseBaseV1;

export type VendorDemandDetailsResponseType = {
  data: DemandDataType;
};

export type RecrutierIdResponseType = {
  data: {
    id: string;
  };
};
