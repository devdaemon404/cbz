import React from 'react';
import { verifyProjectManager } from '../../../../utils/auth/verify-cookie';
import WorkOrderBase from '../../../../components/project-manager/workorder/WorkOrder';
import MGRWorkorderState from 'src/contexts/project-manager/workorder/MGRWorkorderState';

export async function getServerSideProps(context) {
  console.log(context.query);
  const result = await verifyProjectManager(context);
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
    <MGRWorkorderState
      workorderId={workorderId}
      clientId={clientId}
      userId={userId}>
      <WorkOrderBase
        userName={userName}
        page={'workordertabs'}
        clientId={clientId}
        workorderId={workorderId}
      />
    </MGRWorkorderState>
  );
};

export default WorkOrderTabsPage;
