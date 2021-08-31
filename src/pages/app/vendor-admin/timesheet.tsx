import React from 'react';
import TimeSheetBase from '../../../components/vendor-admin/timesheet/TimeSheet';

import { verifyVendorAdmin } from '../../../utils/auth/verify-cookie';

import VATimesheetState from 'src/contexts/vendor-admin/timesheet/VATimesheetState';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

const TimeSheetPage = ({ userName, userId }) => {
  return (
    <VATimesheetState userId={userId}>
      <TimeSheetBase userName={userName} id={userId} />
    </VATimesheetState>
  );
};

export default TimeSheetPage;
