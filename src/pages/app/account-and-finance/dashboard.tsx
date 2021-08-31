import React from 'react';
import {
  verifyAccountAndFinance,
  verifyVendorAdmin,
} from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/account-and-finance/dashboard/Dashboard';
import AFBaseLayout from 'src/components/account-and-finance/AFBaseLayout';

export async function getServerSideProps(context) {
  return await verifyAccountAndFinance(context);
}

export default function ProjectManageDashboard({ userName }) {
  return (
    <AFBaseLayout userName={userName} sidebarIndex={0}>
      <Dashboard />
    </AFBaseLayout>
  );
}
