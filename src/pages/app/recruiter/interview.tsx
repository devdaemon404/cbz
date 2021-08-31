import React from 'react';
import { verifyRecruiter } from '../../../utils/auth/verify-cookie';
import VaInterviewBase from '../../../components/vendor-admin/interview/VaInterviewBase';

export async function getServerSideProps(context) {
  return await verifyRecruiter(context);
}

const RInterviewPage = ({ userName, id, vendorId }) => {
  return <VaInterviewBase userName={userName} id={vendorId} role='RECRUITER' />;
};

export default RInterviewPage;
