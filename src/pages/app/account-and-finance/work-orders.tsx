import React from 'react';
import {
  verifyAccountAndFinance,
  verifyVendorAdmin,
} from '../../../utils/auth/verify-cookie';
import VAWorkorderState from 'src/contexts/vendor-admin/workorder/VAWorkorderState';
import WorkOrder from 'src/components/account-and-finance/workorder/WorkOrder';

export async function getServerSideProps(context) {
  return await verifyAccountAndFinance(context);
}

const WorkOrderPage = ({
  userName,
  clientId,
  userId,
  vendorId,
  workorderId,
}) => {
  return (
    <VAWorkorderState
      clientId={clientId}
      userId={vendorId}
      workorderId={workorderId}>
      <WorkOrder
        userName={userName}
        page={'workorder'}
        userId={vendorId}
        clientId={clientId}
        workorderId={workorderId}
      />
    </VAWorkorderState>
  );
};

export default WorkOrderPage;
