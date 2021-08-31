import React from 'react';
import { verifyClientAdmin } from '../../../../utils/auth/verify-cookie';
import WorkOrder from 'src/components/client-admin/workorder/WorkOrder';
import CAWorkorderState from 'src/contexts/client-admin/workorder/CAWorkorderState';

export async function getServerSideProps(context) {
  console.log(context.query);
  const result = await verifyClientAdmin(context);
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
    <CAWorkorderState
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
    </CAWorkorderState>
  );
};

export default WorkOrderTabsPage;
