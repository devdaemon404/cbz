import React from 'react';
import { verifyVendorAdmin } from '../../../utils/auth/verify-cookie';
import VaInterviewBase from '../../../components/vendor-admin/interview/VaInterviewBase';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

const VAInterviewPage = ({ userName, userId }) => {
  return (
    <VaInterviewBase userName={userName} id={userId} role='VENDOR_ADMIN' />
  );
};

export default VAInterviewPage;
