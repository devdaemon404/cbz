import React from 'react';
import { verifyAccountAndFinance } from '../../../../utils/auth/verify-cookie';
import VAWorkorderState from 'src/contexts/vendor-admin/workorder/VAWorkorderState';
import WorkOrder from 'src/components/account-and-finance/workorder/WorkOrder';

export async function getServerSideProps(context) {
  console.log(context.query);
  const result = await verifyAccountAndFinance(context);
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
    <VAWorkorderState
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
    </VAWorkorderState>
  );
};

export default WorkOrderTabsPage;
