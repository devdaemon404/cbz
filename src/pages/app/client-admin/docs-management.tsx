import React from 'react';
import ComplianceBase from '../../../components/client-admin/docs-manage/DocsManage';

import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';

import CAComplianceState from 'src/contexts/client-admin/compliance/CAComplianceState';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

const CompliancePage = ({ userName, id, clientId, role }) => {
  return (
    <CAComplianceState userId={id} clientId={clientId}>
      <ComplianceBase userName={userName} id={id} index={5} role={role} />
    </CAComplianceState>
  );
};

export default CompliancePage;
