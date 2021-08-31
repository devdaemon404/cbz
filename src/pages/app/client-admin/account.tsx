import React from 'react';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import CADashboardState from 'src/contexts/client-admin/dashboard/CADashboardState';
import Account from 'src/components/client-admin/account/Account';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

export default function CADashboard({ userName, role, clientId, id }) {
  return (
    <CADashboardState clientId={clientId} userId={id}>
      <Account />
    </CADashboardState>
  );
}
