import React from 'react';

import ProjectsTable from './ProjectsTable';

const Projects = ({ userName, clientId, id }) => {
  return (
    <>
      <ProjectsTable clientId={clientId} userName={userName} id={id} />
    </>
  );
};

export default Projects;
