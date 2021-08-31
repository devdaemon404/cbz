import React from 'react';
import ManageDemandBase from '../../../../../components/project-manager/ManageDemand';
import PMDemandState from '../../../../../contexts/project-manager/demand/PMDemandState';
import { verifyProjectManager } from '../../../../../utils/auth/verify-cookie';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  return await verifyProjectManager(context);
}

const ManageDemandPage = ({ userName }) => {
  const router = useRouter();
  const projectId = router.query.projectId;
  return (
    <PMDemandState projectId={projectId}>
      <ManageDemandBase
        userName={userName}
        projectId={router.query.projectId}
      />
    </PMDemandState>
  );
};

export default ManageDemandPage;
