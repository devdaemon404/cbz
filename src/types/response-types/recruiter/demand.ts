import { RDemandType } from 'src/types/recruiter/demand';
import ResponseBaseV1 from '../response-base-v1';

export type FetchRecruiterDemandResponseType = {
  data: RDemandType[];
} & ResponseBaseV1;
