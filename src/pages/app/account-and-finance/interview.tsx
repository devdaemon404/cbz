import React from 'react';
import {
  verifyAccountAndFinance,
  verifyVendorAdmin,
} from '../../../utils/auth/verify-cookie';
import AFInterviewBase from '../../../components/account-and-finance/interview/AFInterviewBase';

export async function getServerSideProps(context) {
  return await verifyAccountAndFinance(context);
}

const AFInterviewPage = ({ userName, vendorId }) => {
  return (
    <AFInterviewBase userName={userName} id={vendorId} role='VENDOR_ADMIN' />
  );
};

export default AFInterviewPage;
