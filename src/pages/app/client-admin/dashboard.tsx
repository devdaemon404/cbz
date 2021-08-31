import React from 'react';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/client-admin/dashboard/Dashboard';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import CADashboardState from 'src/contexts/client-admin/dashboard/CADashboardState';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

export default function CADashboard({ userName, role, clientId, id }) {
  return (
    <CADashboardState clientId={clientId} userId={id}>
      <CABaseLayout userName={userName} sidebarIndex={0} role={role}>
        <Dashboard />
      </CABaseLayout>
    </CADashboardState>
  );
}
