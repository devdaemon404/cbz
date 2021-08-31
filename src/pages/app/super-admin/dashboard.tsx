import React from 'react';
import PMBaseLayout from '../../../components/project-manager/PMBaseLayout';
import { verifySuperAdmin } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/super-admin/dashboard/Dashboard';
import SAManageClientState from 'src/contexts/super-admin/manage-clients/SAManageClientState';
import SABaseLayout from 'src/components/super-admin/SABaseLayout';

export async function getServerSideProps(context) {
  return await verifySuperAdmin(context);
}

export default function ProjectManageDashboard({ userName, userId }) {
  return (
    <SAManageClientState userId={userId}>
      <SABaseLayout userName={userName} sidebarIndex={0}>
        <Dashboard />
      </SABaseLayout>
    </SAManageClientState>
  );
}
