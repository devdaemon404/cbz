import React from 'react';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import Account from 'src/components/vendor-admin/account/Account';
import VADashboardState from 'src/contexts/vendor-admin/dashboard/VADashboardState';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

export default function CADashboard({ userName, role, clientId, id }) {
  return (
    <VADashboardState clientId={clientId} userId={id}>
      <Account />
    </VADashboardState>
  );
}
