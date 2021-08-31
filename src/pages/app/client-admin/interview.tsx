import React from 'react';
import VaInterviewBase from 'src/components/vendor-admin/interview/VaInterviewBase';
import PMDemandState from 'src/contexts/project-manager/demand/PMDemandState';
import PMInterviewState from 'src/contexts/project-manager/interview/PMInterviewState';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

const InterviewPage = ({ userName, id }) => {
  return <VaInterviewBase userName={userName} id={id} role='CLIENT_ADMIN' />;
};

export default InterviewPage;
