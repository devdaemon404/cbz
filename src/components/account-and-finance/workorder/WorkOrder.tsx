import React from 'react';
import AFBaseLayout from '../AFBaseLayout';

import WorkOrderTable from './WorkOrderTable';
import WorkOrderTabs from './WorkOrderTabs';

const WorkOrder = ({
  userName,
  page,
  userId,
  clientId,
  workorderId,
}: {
  userName: string;
  page: string;
  userId: string;
  clientId: string;
  workorderId: string;
}) => {
  return (
    <AFBaseLayout sidebarIndex={2} userName={userName}>
      {page === 'workorder' ? (
        <WorkOrderTable userId={userId} clientId={clientId} />
      ) : (
        <WorkOrderTabs workorderId={workorderId} />
      )}
    </AFBaseLayout>
  );
};

export default WorkOrder;
