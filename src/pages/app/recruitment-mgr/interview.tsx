import React from 'react';
import { verifyRecruitmentManager } from '../../../utils/auth/verify-cookie';
import VaInterviewBase from '../../../components/vendor-admin/interview/VaInterviewBase';

export async function getServerSideProps(context) {
  return await verifyRecruitmentManager(context);
}

const RMInterviewPage = ({ userName, id }) => {
  return (
    <VaInterviewBase userName={userName} id={id} role='RECRUITER_MANAGER' />
  );
};

export default RMInterviewPage;
