import {
  CAProfileDataType,
  CAProfileDetailsDataType,
} from 'src/types/client-admin/workorder';
import ResponseBaseV1 from '../response-base-v1';

export type FetchCAProfileResponseType = {
  data: CAProfileDataType[];
} & ResponseBaseV1;

export type FetchCAProfileDetailsResponseType = {
  data: CAProfileDetailsDataType;
} & ResponseBaseV1;
