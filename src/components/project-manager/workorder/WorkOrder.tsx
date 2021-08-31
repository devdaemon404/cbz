import React from 'react';

import PMBaseLayout from '../PMBaseLayout';
import WorkOrderTable from './WorkOrderTable';
import WorkOrderTabs from './WorkOrderTabs';

const WorkOrder = ({
  userName,
  page,
  clientId,
  workorderId,
}: {
  userName: string;
  page: string;
  clientId: string;
  workorderId: string;
}) => {
  return (
    <PMBaseLayout sidebarIndex={4} userName={userName}>
      {page === 'workorder' ? (
        <WorkOrderTable clientId={clientId} />
      ) : (
        <WorkOrderTabs workorderId={workorderId} />
      )}
    </PMBaseLayout>
  );
};

export default WorkOrder;
