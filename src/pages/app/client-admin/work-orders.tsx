import React from 'react';
import {
  verifyClientAdmin,
  verifyVendorAdmin,
} from '../../../utils/auth/verify-cookie';
import VAWorkorderState from 'src/contexts/vendor-admin/workorder/VAWorkorderState';
import WorkOrder from 'src/components/client-admin/workorder/WorkOrder';
import CAWorkorderState from 'src/contexts/client-admin/workorder/CAWorkorderState';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

const WorkOrderPage = ({ userName, clientId, id, workorderId, role }) => {
  return (
    <CAWorkorderState
      clientId={clientId}
      userId={id}
      workorderId={workorderId}
      role={role}>
      <WorkOrder
        userName={userName}
        page={'workorder'}
        userId={id}
        clientId={clientId}
        workorderId={workorderId}
      />
    </CAWorkorderState>
  );
};

export default WorkOrderPage;
