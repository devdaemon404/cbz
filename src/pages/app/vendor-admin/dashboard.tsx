import React from 'react';
import { verifyVendorAdmin } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/vendor-admin/dashboard/Dashboard';
import VABaseLayout from 'src/components/vendor-admin/VABaseLayout';
import VADashboardState from 'src/contexts/vendor-admin/dashboard/VADashboardState';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

export default function VADashboard({ userName, userId, id }) {
  return (
    <VADashboardState vendorId={userId} userId={id}>
      <VABaseLayout userName={userName} sidebarIndex={0}>
        <Dashboard />
      </VABaseLayout>
    </VADashboardState>
  );
}
