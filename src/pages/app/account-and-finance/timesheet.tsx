import React from 'react';

import { verifyAccountAndFinance } from '../../../utils/auth/verify-cookie';

import VATimesheetState from 'src/contexts/vendor-admin/timesheet/VATimesheetState';
import TimeSheet from 'src/components/account-and-finance/timesheet/TimeSheet';

export async function getServerSideProps(context) {
  return await verifyAccountAndFinance(context);
}

const TimeSheetPage = ({ userName, vendorId }) => {
  return (
    <VATimesheetState userId={vendorId}>
      <TimeSheet userName={userName} id={vendorId} />
    </VATimesheetState>
  );
};

export default TimeSheetPage;
