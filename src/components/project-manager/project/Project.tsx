import React from 'react';

import PMBaseLayout from '../PMBaseLayout';
import ProjectTable from './ProjectTable';

const Project = ({
  userName,
  clientId,
  userId,
}: {
  userName: string;
  clientId: string;
  userId: string;
}) => {
  return (
    <PMBaseLayout sidebarIndex={3} userName={userName}>
      <ProjectTable clientId={clientId} userId={userId} />
    </PMBaseLayout>
  );
};

export default Project;
