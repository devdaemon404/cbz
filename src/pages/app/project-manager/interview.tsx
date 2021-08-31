import React from 'react';
import InterviewBase from 'src/components/project-manager/interview/InterviewBase';
import PMDemandState from 'src/contexts/project-manager/demand/PMDemandState';
import PMInterviewState from 'src/contexts/project-manager/interview/PMInterviewState';
import { verifyProjectManager } from '../../../utils/auth/verify-cookie';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  return await verifyProjectManager(context);
}

const InterviewPage = ({ userName, clientId, userId }) => {
  const router = useRouter();
  console.log('kjdfkjaksdjfk', router.query.rejectReason);
  return (
    <PMDemandState>
      <PMInterviewState clientId={clientId} userId={userId}>
        <InterviewBase userName={userName} clientId={clientId} />;
      </PMInterviewState>
    </PMDemandState>
  );
};

export default InterviewPage;
