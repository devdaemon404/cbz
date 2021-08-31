import React from 'react';
import { verifyRecruiter } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/recruiter/dashboard/Dashboard';
import RecruiterBaseLayout from 'src/components/recruiter/RecruiterBaseLayout';
import VADashboardState from 'src/contexts/vendor-admin/dashboard/VADashboardState';

export async function getServerSideProps(context) {
  return await verifyRecruiter(context);
}

export default function RecruiterDashboard({ userName, vendorId, id }) {
  return (
    <VADashboardState vendorId={vendorId} userId={id}>
      <RecruiterBaseLayout userName={userName} sidebarIndex={0}>
        <Dashboard />
      </RecruiterBaseLayout>
    </VADashboardState>
  );
}
