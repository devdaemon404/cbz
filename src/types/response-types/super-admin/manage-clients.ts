import { ManageClientType } from 'src/types/super-admin/manage-clients';
import ResponseBaseV1 from '../response-base-v1';

export type FetchManageClientsResponseType = {
  data: ManageClientType[];
} & ResponseBaseV1;
