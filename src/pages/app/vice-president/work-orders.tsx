import React from 'react';
import WorkOrder from 'src/components/vice-president/workorder/WorkOrder';
import VPWorkorderState from 'src/contexts/vice-president/workorder/VPWorkorderState';
import { verifyVicePresident } from '../../../utils/auth/verify-cookie';

export async function getServerSideProps(context) {
  return await verifyVicePresident(context);
}

const WorkOrderPage = ({ userName, clientId, userId, workorderId }) => {
  return (
    <VPWorkorderState
      clientId={clientId}
      userId={userId}
      workorderId={workorderId}>
      <WorkOrder
        userName={userName}
        page={'workorder'}
        userId={userId}
        clientId={clientId}
        workorderId={workorderId}
      />
    </VPWorkorderState>
  );
};

export default WorkOrderPage;
