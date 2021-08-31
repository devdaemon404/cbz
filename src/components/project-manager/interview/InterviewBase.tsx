import React from 'react';

import PMBaseLayout from '../PMBaseLayout';
import InterviewProfiles from './InterviewProfiles';

const InterviewBase = ({ userName, clientId }) => {
  return (
    <PMBaseLayout sidebarIndex={2} userName={userName}>
      <InterviewProfiles clientId={clientId} />
    </PMBaseLayout>
  );
};

export default InterviewBase;
