import React from 'react';
import { verifyProjectManager } from '../../../utils/auth/verify-cookie';
import WorkOrderBase from '../../../components/project-manager/workorder/WorkOrder';
import MGRWorkorderState from 'src/contexts/project-manager/workorder/MGRWorkorderState';

export async function getServerSideProps(context) {
  return await verifyProjectManager(context);
}

const WorkOrderPage = ({ userName, clientId, userId, workorderId }) => {
  return (
    <MGRWorkorderState
      clientId={clientId}
      userId={userId}
      workorderId={workorderId}>
      <WorkOrderBase
        userName={userName}
        page={'workorder'}
        clientId={clientId}
        workorderId={workorderId}
      />
    </MGRWorkorderState>
  );
};

export default WorkOrderPage;
