import { InvoiceType } from 'src/types/account-and-finance/invoice';
import ResponseBaseV1 from '../response-base-v1';

export type FetchInvoiceResponseType = {
  data: InvoiceType[];
} & ResponseBaseV1;
