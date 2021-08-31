import React from 'react';
import WorkOrder from 'src/components/vice-president/workorder/WorkOrder';
import VPWorkorderState from 'src/contexts/vice-president/workorder/VPWorkorderState';
import { verifyVicePresident } from '../../../../utils/auth/verify-cookie';

export async function getServerSideProps(context) {
  console.log(context.query);
  const result = await verifyVicePresident(context);
  console.log({
    ...result.props,
    workorderId: context.query,
  });
  return {
    props: {
      ...result.props,
      workorderId: context.query.workorderId,
    },
  };
}

const WorkOrderTabsPage = ({ userName, clientId, workorderId, userId }) => {
  return (
    <VPWorkorderState
      workorderId={workorderId}
      clientId={clientId}
      userId={userId}>
      <WorkOrder
        userId={userId}
        userName={userName}
        page={'workordertabs'}
        clientId={clientId}
        workorderId={workorderId}
      />
    </VPWorkorderState>
  );
};

export default WorkOrderTabsPage;
