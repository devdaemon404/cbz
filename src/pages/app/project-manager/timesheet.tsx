import React from 'react';
import TimeSheetBase from '../../../components/project-manager/timesheet/TimeSheet';
import { verifyProjectManager } from '../../../utils/auth/verify-cookie';
import PMDemandState from 'src/contexts/project-manager/demand/PMDemandState';
import MGRTimesheetState from 'src/contexts/project-manager/timesheet/manager/MGRTimesheetState';

export async function getServerSideProps(context) {
  return await verifyProjectManager(context);
}

const TimeSheetPage = ({ userName, clientId, userId }) => {
  return (
    // <PMDemandState>
    <MGRTimesheetState clientId={clientId} userId={userId}>
      <TimeSheetBase userName={userName} />
    </MGRTimesheetState>
    // </PMDemandState>
  );
};

export default TimeSheetPage;
