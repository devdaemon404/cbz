import React, { useEffect, useState } from 'react';
import { OPHttpClient } from 'src/utils/op-http-client';

import ANFInvoiceContext, { anfInvoiceContextDefault } from './anf-i-context';
import { VAApiService } from 'src/apis/vendor-admin/va-api-service';
import {
  ComplianceDocumentsType,
  ManageUserType,
} from 'src/types/vendor-admin/demand';
import { VAManageUserApiService } from 'src/apis/vendor-admin/va-manage-user-api-service';
import { SAManageClientsApiService } from 'src/apis/super-admin/sa-manage-clients-api-service';
import { ManageClientType } from 'src/types/super-admin/manage-clients';
import { ANFInvoiceApiService } from 'src/apis/acc-and-fin/anf-invoice-api-service';
import { InvoiceType } from 'src/types/account-and-finance/invoice';

const ANFInvoiceState = (props) => {
  // API URLs
  const v1URL = 'https://test.app.cloudsbuzz.in/';
  const URL = `${process.env.V2_API_URL}/`;

  const httpClientV2 = OPHttpClient.init(URL, {
    action: 'Account and Finance Invoice',
  });

  const clientId = props.clientId;
  const vendorId = props.userId;

  const apiService = new ANFInvoiceApiService(httpClientV2, clientId, vendorId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const getInvoices = async () => {
    setIsLoading(true);
    const res = await apiService.fetchInvoice();
    if (res) {
      setInvoices(res);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('SelectedDate: ', selectedDate);
    getInvoices();
  }, [selectedDate]);

  return (
    <ANFInvoiceContext.Provider
      value={{
        isLoading,
        selectedDate,
        invoices,
        handleDateChange,
      }}>
      {props.children}
    </ANFInvoiceContext.Provider>
  );
};

export default ANFInvoiceState;
