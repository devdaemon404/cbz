import React from 'react';
import TimeSheetBase from '../../../components/client-admin/timesheet/TimeSheet';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';
import PMDemandState from 'src/contexts/project-manager/demand/PMDemandState';
import CATimesheetState from 'src/contexts/client-admin/timesheet/manager/CATimesheetState';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

const TimeSheetPage = ({ userName, clientId, userId }) => {
  return (
    // <PMDemandState>
    <CATimesheetState clientId={clientId} userId={userId}>
      <TimeSheetBase userName={userName} />
    </CATimesheetState>
    // </PMDemandState>
  );
};

export default TimeSheetPage;
