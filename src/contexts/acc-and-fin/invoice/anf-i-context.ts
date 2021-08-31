import { createContext, Dispatch, SetStateAction } from 'react';
import { InvoiceType } from 'src/types/account-and-finance/invoice';
type ANFInvoiceContextDataType = {
  isLoading: boolean;
  selectedDate: Date;
  handleDateChange: (value: any) => void;
  invoices: InvoiceType[];
};

export const anfInvoiceContextDefault: ANFInvoiceContextDataType = {
  isLoading: false,
  selectedDate: new Date(),
  handleDateChange: (value: any) => null,
  invoices: [],
};

const ANFInvoiceContext = createContext<ANFInvoiceContextDataType>(
  anfInvoiceContextDefault,
);

export default ANFInvoiceContext;
