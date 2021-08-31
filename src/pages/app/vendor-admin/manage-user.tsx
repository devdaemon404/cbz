import React from 'react';
import ManageUserBase from '../../../components/vendor-admin/manage-user/ManageUser';

import { verifyVendorAdmin } from '../../../utils/auth/verify-cookie';

import VAManageUserState from 'src/contexts/vendor-admin/manage-user/VAManageUserState';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

const ManageUserPage = ({ userName, userId, id, clientId }) => {
  return (
    <VAManageUserState userId={userId} clientId={clientId}>
      <ManageUserBase userName={userName} id={id} />
    </VAManageUserState>
  );
};

export default ManageUserPage;
