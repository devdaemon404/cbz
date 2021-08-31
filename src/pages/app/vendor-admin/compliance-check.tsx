import React from 'react';
import ComplianceBase from '../../../components/vendor-admin/compliance/Compliance';

import { verifyVendorAdmin } from '../../../utils/auth/verify-cookie';

import VAComplianceState from 'src/contexts/vendor-admin/compliance/VAComplianceState';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

const CompliancePage = ({ userName, userId, clientId }) => {
  return (
    <VAComplianceState userId={userId} clientId={clientId}>
      <ComplianceBase userName={userName} id={userId} index={5} />
    </VAComplianceState>
  );
};

export default CompliancePage;
