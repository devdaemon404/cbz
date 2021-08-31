import React from 'react';
import { verifyRecruitmentManager } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/recruitment-mgr/dashboard/Dashboard';
import RMBaseLayout from 'src/components/recruitment-mgr/RMBaseLayout';

export async function getServerSideProps(context) {
  return await verifyRecruitmentManager(context);
}

export default function RecruiterDashboard({ userName }) {
  return (
    <RMBaseLayout userName={userName} sidebarIndex={0}>
      <Dashboard />
    </RMBaseLayout>
  );
}
