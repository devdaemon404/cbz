import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import VABaseLayout from '../VABaseLayout';
import ManageEmployeesTable from './ManageEmployeesTable';

const ManageEmployee = ({ userName, id }) => {
  console.log(`vendor id is ${id}`);
  return (
    <VABaseLayout userName={userName} sidebarIndex={2}>
      <Fragment>
        {/* <OPLoader isLoading={isLoading} /> */}
        <ManageEmployeesTable />
      </Fragment>
    </VABaseLayout>
  );
};

export default ManageEmployee;
