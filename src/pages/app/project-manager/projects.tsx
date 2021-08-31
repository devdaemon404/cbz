import React from 'react';
import { verifyProjectManager } from '../../../utils/auth/verify-cookie';
import ProjectBase from '../../../components/project-manager/project/Project';

export async function getServerSideProps(context) {
  return await verifyProjectManager(context);
}

const ProjectsPage = ({ userName, clientId, userId }) => {
  return (
    <ProjectBase userName={userName} clientId={clientId} userId={userId} />
  );
};

export default ProjectsPage;
