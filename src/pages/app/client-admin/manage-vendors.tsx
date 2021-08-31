import React from 'react';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import ManageVendors from 'src/components/client-admin/ManageVendors/ManageVendors';
import CAManageVendorsState from 'src/contexts/client-admin/manage-vendors/CAManageVendorsState';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

export default function CAmanageVendors({ userName, clientId, id, role }) {
  return (
    <CAManageVendorsState
      userName={userName}
      clientId={clientId}
      id={id}
      role={role}>
      <CABaseLayout userName={userName} sidebarIndex={2} role={role}>
        <ManageVendors clientId={clientId} id={id} userName={userName} />
      </CABaseLayout>
    </CAManageVendorsState>
  );
}
