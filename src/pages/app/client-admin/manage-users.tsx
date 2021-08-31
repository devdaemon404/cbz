import React from 'react';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import ManageUsers from 'src/components/client-admin/ManageUsers/ManageUsers';
import CAManageUsersState from 'src/contexts/client-admin/manage-users/CAManageUsersState';
export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

export default function CAmanageUsers({ userName, clientId, id, role }) {
  return (
    <CAManageUsersState
      clientId={clientId}
      id={id}
      userName={userName}
      role={role}>
      <CABaseLayout userName={userName} sidebarIndex={1} role={role}>
        <ManageUsers clientId={clientId} id={id} userName={userName} />
      </CABaseLayout>
    </CAManageUsersState>
  );
}
