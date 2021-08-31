import React from 'react';

import VABaseLayout from '../VABaseLayout';
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
    <VABaseLayout sidebarIndex={4} userName={userName}>
      {page === 'workorder' ? (
        <WorkOrderTable userId={userId} clientId={clientId} />
      ) : (
        <WorkOrderTabs workorderId={workorderId} />
      )}
    </VABaseLayout>
  );
};

export default WorkOrder;
