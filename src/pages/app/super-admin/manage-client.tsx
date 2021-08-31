import React from 'react';
import SAManageClientState from 'src/contexts/super-admin/manage-clients/SAManageClientState';
import ManageClientBase from '../../../components/super-admin/manage-clients/ManageClient';

import { verifySuperAdmin } from '../../../utils/auth/verify-cookie';

export async function getServerSideProps(context) {
  return await verifySuperAdmin(context);
}

const ManageClientPage = ({ userName, userId }) => {
  return (
    <SAManageClientState userId={userId}>
      <ManageClientBase userName={userName} id={userId} />
    </SAManageClientState>
  );
};

export default ManageClientPage;
