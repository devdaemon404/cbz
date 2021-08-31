import React from 'react';
import { verifyContractor } from '../../../utils/auth/verify-cookie';
import Dashboard from 'src/components/employee/em-dashboard/Dashboard';
import DashboardBaseLayout from 'src/components/employee/dashboard/DashboardBaseLayout2';
import EMPTimesheetState from 'src/contexts/employee/timesheet/EmpTimesheetState';

export async function getServerSideProps(context) {
  return await verifyContractor(context);
}
export default function ContractorDashboard({ userName, id, userId }) {
  return (
    <EMPTimesheetState userName={userName} empId={id} userId={userId}>
      <DashboardBaseLayout userName={userName} sidebarIndex={0}>
        <Dashboard userName={userName} />
      </DashboardBaseLayout>
    </EMPTimesheetState>
  );
}
