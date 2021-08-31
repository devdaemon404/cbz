import React from 'react';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import RecruiterBaseLayout from 'src/components/recruiter/RecruiterBaseLayout';
import RMBaseLayout from 'src/components/recruitment-mgr/RMBaseLayout';
import VAInterviewState from 'src/contexts/vendor-admin/interview/VAInterviewState';

import AFBaseLayout from '../AFBaseLayout';
import AFInterviewProfiles from './AFInterviewProfiles';

const VaInterviewBase = ({ userName, id, role }) => {
  return (
    <AFBaseLayout sidebarIndex={3} userName={userName}>
      <VAInterviewState id={id} role={role}>
        <AFInterviewProfiles role={role} />
      </VAInterviewState>
    </AFBaseLayout>
  );
};

export default VaInterviewBase;
