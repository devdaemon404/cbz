import React from 'react';
import { verifyVicePresident } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/vice-president/dashboard/Dashboard';
import VPBaseLayout from 'src/components/vice-president/VPBaseLayout';

export async function getServerSideProps(context) {
  return await verifyVicePresident(context);
}

export default function VADashboard({ userName }) {
  return (
    <VPBaseLayout userName={userName} sidebarIndex={0}>
      <Dashboard />
    </VPBaseLayout>
  );
}
