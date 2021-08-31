import React from 'react';

import ManageUsersTable from './ManageUsersTable';

const ManageUsers = ({ userName, clientId, id }) => {
  return (
    <>
      <ManageUsersTable clientId={clientId} userName={userName} id={id} />
    </>
  );
};

export default ManageUsers;
