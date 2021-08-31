import React from 'react';
import { verifyVendorAdmin } from '../../../utils/auth/verify-cookie';
import VAWorkorderState from 'src/contexts/vendor-admin/workorder/VAWorkorderState';
import WorkOrder from 'src/components/vendor-admin/workorder/WorkOrder';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

const WorkOrderPage = ({ userName, clientId, userId, workorderId }) => {
  return (
    <VAWorkorderState
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
    </VAWorkorderState>
  );
};

export default WorkOrderPage;
