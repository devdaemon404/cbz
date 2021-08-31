import React from 'react';
import PMBaseLayout from '../../../components/project-manager/PMBaseLayout';
import { Typography } from '@material-ui/core';
import { verifyProjectManager } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/project-manager/dashboard/Dashboard';
import PMInterviewState from 'src/contexts/project-manager/interview/PMInterviewState';

export async function getServerSideProps(context) {
  return await verifyProjectManager(context);
}

export default function ProjectManageDashboard({ userName, userId, clientId }) {
  return (
    <PMInterviewState userId={userId} clientId={clientId}>
      <PMBaseLayout userName={userName} sidebarIndex={0}>
        <Dashboard />
      </PMBaseLayout>
    </PMInterviewState>
  );
}
