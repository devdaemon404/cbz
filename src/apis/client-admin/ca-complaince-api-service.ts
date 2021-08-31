import { HttpClient } from '../../utils/op-http-client';
import { isException, OPException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import {
  ComplianceType,
  VendorComplianceType,
  VendorDocumentType,
} from 'src/types/client-admin/compliance';
import {
  FetchComplianceResponseType,
  FetchVendorDocumentResponseType,
  FetchVendorsComplianceResponseType,
} from 'src/types/response-types/client-admin/compliance';
import { saveAs } from 'file-saver';

export class CAComplainceApiService {
  constructor(
    private httpClient: HttpClient,
    private clientId: string,
    private userId: string,
  ) {}

  // Fetch all compliacne for a particular month
  fetchAllCompliance = async (date): Promise<ComplianceType[] | undefined> => {
    const res = await this.httpClient.get<FetchComplianceResponseType>(
      `apis/v1/docs/management/client/${this.clientId}/monthly?month=${date.month}&year=${date.year}&show_all=true`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching compliance. Try again', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return;
    }
    return res.data;
  };

  // Fetch all compliacne for a particular month
  fetchAllVendors = async (
    date,
  ): Promise<VendorComplianceType[] | undefined> => {
    const res = await this.httpClient.get<FetchVendorsComplianceResponseType>(
      `apis/v1/docs/client/${this.clientId}?month=${date.month}&year=${date.year}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching vendors. Try again', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return;
    }
    return res.data;
  };

  // Fetch all vendor documents for a particular month
  fetchAllVendorDocuments = async (
    date,
    vendorId: string,
  ): Promise<VendorDocumentType[] | undefined> => {
    const res = await this.httpClient.get<FetchVendorDocumentResponseType>(
      `apis/v1/docs/client/${this.clientId}/vendor/${vendorId}?month=${date.month}&year=${date.year}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching vendor documents. Try again', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return;
    }
    return res.data;
  };

  // Create compliance document for selected month

  createCompliance = async (data, date): Promise<boolean> => {
    const res = await this.httpClient.post(
      `apis/v1/docs/management/client/${this.clientId}`,
      {
        client_id: this.clientId,
        document_name: data.document_name,
        document_type: data.document_type,
        mandatory: true,
        month: date.month,
        year: date.year,
      },
    );

    if (isException(res)) {
      // console.log(res);
      OPToast.show('Error Creating Compliance. Try Again', {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Compliance Created Successfully', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  // Upadte compliance document for selected month

  updateCompliance = async (data, date): Promise<boolean> => {
    const res = await this.httpClient.put(
      `apis/v1/docs/management/client/${this.clientId}/documentType/${data.document_id}`,
      {
        client_id: this.clientId,
        document_name: data.document_name,
        document_type: data.document_type,
        mandatory: true,
        month: date.month,
        year: date.year,
      },
    );

    if (isException(res)) {
      // console.log(res);
      OPToast.show('Error Updating Compliance. Try Again', {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Compliance Updated Successfully', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  // Delete compliance document

  deleteCompliance = async (documentId): Promise<boolean> => {
    const res = await this.httpClient.delete(
      `apis/v1/docs/management/client/${this.clientId}/documentType/${documentId}/force`,
      {},
    );

    // if (isException(res)) {
    //   // console.log(res);
    //   OPToast.show('Error Deleting Compliance. Try Again', {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }
    OPToast.show('Compliance Deleted Successfully', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  // Get Previous Month Documents

  getPrevMonthDocs = async (date): Promise<boolean> => {
    let prevMonth = date.month - 1;
    let prevYear = date.year;
    if (prevMonth < 0) {
      prevMonth += 12;
      prevYear -= 1;
    }
    const res = await this.httpClient.patch(
      `apis/v1/docs/management/client/${this.clientId}?from_month=${prevMonth}&from_year=${prevYear}`,
      {
        from_month: prevMonth,
        from_year: prevYear,
      },
    );
    if (isException(res)) {
      OPToast.show(
        `Some data from previous month already exists in current month`,
        {
          variant: ToastVariant.ERROR,
        },
      );
      return false;
    }
    OPToast.show('Successfully Fetched', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  documentRequest = async (document_type, date, vendorId): Promise<boolean> => {
    const res = await this.httpClient.post(
      `apis/v1/docs/client/${this.clientId}/vendor/${vendorId}?document_type=${document_type}&month=${date.month}&year=${date.year}`,
      {},
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Successfully Requested', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  documentApprove = async (documentId, vendorId): Promise<boolean> => {
    const res = await this.httpClient.patch(
      `apis/v1/docs/client/${this.clientId}/document/${documentId}?vendor_id=${vendorId}&document_status=APPROVED`,
      {},
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Document Approved', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  downloadFile = async (documentType, vendorId, date, filename) => {
    saveAs(
      `${process.env.V1_API_URL}/apis/v1/docs/vendor/${vendorId}?document_type=${documentType}&month=${date.month}&year=${date.year}`,
      // `http://test.app.cloudsbuzz.in/apis/v1/docs/vendor/${this.vendorId}?document_type=${doctype}&month=${month}&year=${year}`,
    );
  };
}
