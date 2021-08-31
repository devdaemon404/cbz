import { HttpClient } from '../../utils/op-http-client';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import { validateRequest } from 'server/middleware/validate-request';
import { InvoiceType } from 'src/types/account-and-finance/invoice';
import { FetchInvoiceResponseType } from 'src/types/response-types/account-and-finance/invoice';

export class ANFInvoiceApiService {
  constructor(
    private httpClient: HttpClient,
    private clientId: string,
    private vendorId: string,
  ) {}

  fetchInvoice = async (): Promise<InvoiceType[] | null> => {
    const res = await this.httpClient.get<FetchInvoiceResponseType>(
      `api/v2/invoice/client/${this.clientId}`,
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      console.log('MESSAGE', res.message);
      return null;
    }

    return res.data;
  };
}
