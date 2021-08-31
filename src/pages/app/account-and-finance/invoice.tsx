import React from 'react';
import InvoiceBase from '../../../components/account-and-finance/invoice/Invoice';

import { verifyAccountAndFinance } from '../../../utils/auth/verify-cookie';

import ANFInvoiceState from 'src/contexts/acc-and-fin/invoice/ANFInvoiceState';

export async function getServerSideProps(context) {
  return await verifyAccountAndFinance(context);
}

const CompliancePage = ({ userName, userId, clientId, vendorId }) => {
  return (
    <ANFInvoiceState userId={userId} clientId={clientId} vendorId={vendorId}>
      <InvoiceBase userName={userName} id={userId} />
    </ANFInvoiceState>
  );
};

export default CompliancePage;
