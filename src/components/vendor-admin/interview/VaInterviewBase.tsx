import React from 'react';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import RecruiterBaseLayout from 'src/components/recruiter/RecruiterBaseLayout';
import RMBaseLayout from 'src/components/recruitment-mgr/RMBaseLayout';
import VAInterviewState from 'src/contexts/vendor-admin/interview/VAInterviewState';

import VABaseLayout from '../VABaseLayout';
import VaInterviewProfiles from './VaInterviewProfiles';

const VaInterviewBase = ({ userName, id, role }) => {
  switch (role) {
    case 'CLIENT_ADMIN':
      return (
        <CABaseLayout sidebarIndex={6} userName={userName}>
          <VAInterviewState id={id} role={role}>
            <VaInterviewProfiles role={role} />
          </VAInterviewState>
        </CABaseLayout>
      );
    case 'RECRUITER':
      return (
        <RecruiterBaseLayout sidebarIndex={2} userName={userName}>
          <VAInterviewState id={id} role={role}>
            <VaInterviewProfiles role={role} />
          </VAInterviewState>
        </RecruiterBaseLayout>
      );
    case 'RECRUITER_MANAGER':
      return (
        <RMBaseLayout sidebarIndex={3} userName={userName}>
          <VAInterviewState id={id} role={role}>
            <VaInterviewProfiles role={role} />
          </VAInterviewState>
        </RMBaseLayout>
      );
  }
  return (
    <VABaseLayout sidebarIndex={7} userName={userName}>
      <VAInterviewState id={id} role={role}>
        <VaInterviewProfiles role={role} />
      </VAInterviewState>
    </VABaseLayout>
  );
};

export default VaInterviewBase;
