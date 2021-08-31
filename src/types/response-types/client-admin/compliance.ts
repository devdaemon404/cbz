import {
  ComplianceType,
  VendorComplianceType,
  VendorDocumentType,
} from 'src/types/client-admin/compliance';
import ResponseBaseV1 from '../response-base-v1';

export type FetchComplianceResponseType = {
  data: ComplianceType[];
} & ResponseBaseV1;

export type FetchVendorsComplianceResponseType = {
  data: VendorComplianceType[];
} & ResponseBaseV1;

export type FetchVendorDocumentResponseType = {
  data: VendorDocumentType[];
} & ResponseBaseV1;
