import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import TimeSheetTable from './TimeSheetTable';
import VABaseLayout from '../VABaseLayout';
import VATimesheetContext from 'src/contexts/vendor-admin/timesheet/va-ts-context';

const TimeSheet = ({ userName, id }) => {
  const { isLoading } = useContext(VATimesheetContext);
  // const { weekNumber, year } = selectedVAWeekData;
  // useEffect(() => {
  //   const employeeList = async () => {
  //     await fetchAllVATimesheet(id);
  //   };
  //   employeeList();
  // }, [weekNumber, year]);

  return (
    <VABaseLayout userName={userName} sidebarIndex={6}>
      <Fragment>
        <OPLoader isLoading={isLoading} />
        <TimeSheetTable />
      </Fragment>
    </VABaseLayout>
  );
};

export default TimeSheet;
