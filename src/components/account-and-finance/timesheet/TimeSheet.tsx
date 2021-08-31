import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import TimeSheetTable from './TimeSheetTable';
import AFBaseLayout from '../AFBaseLayout';
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
    <AFBaseLayout userName={userName} sidebarIndex={3}>
      <Fragment>
        <OPLoader isLoading={isLoading} />
        <TimeSheetTable />
      </Fragment>
    </AFBaseLayout>
  );
};

export default TimeSheet;
