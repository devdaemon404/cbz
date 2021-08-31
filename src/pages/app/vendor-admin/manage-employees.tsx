import React from 'react';

import { verifyVendorAdmin } from '../../../utils/auth/verify-cookie';

import ManageEmployee from 'src/components/vendor-admin/manage-employees/ManageEmployee';
import VAManageEmployeeState from 'src/contexts/vendor-admin/manage-employee/VAManageEmployeeState';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}
const manageEmployees = ({ userName, userId, id, clientId }) => {
  return (
    <VAManageEmployeeState userId={userId} clientId={clientId}>
      <ManageEmployee userName={userName} id={id} />
    </VAManageEmployeeState>
  );
};

export default manageEmployees;
