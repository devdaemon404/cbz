import React from 'react';
import ComplianceBase from '../../../components/account-and-finance/compliance/Compliance';

import { verifyAccountAndFinance } from '../../../utils/auth/verify-cookie';

import VAComplianceState from 'src/contexts/vendor-admin/compliance/VAComplianceState';

export async function getServerSideProps(context) {
  return await verifyAccountAndFinance(context);
}

const CompliancePage = ({ userName, userId, clientId }) => {
  return (
    <VAComplianceState userId={userId} clientId={clientId}>
      <ComplianceBase userName={userName} id={userId} index={3} />
    </VAComplianceState>
  );
};

export default CompliancePage;
