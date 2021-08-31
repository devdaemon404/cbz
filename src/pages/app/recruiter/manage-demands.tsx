import React from 'react';
import ManageDemandBase from '../../../components/recruiter/manage-demand/ManageDemand';
import { useRouter } from 'next/router';
import { verifyRecruiter } from 'src/utils/auth/verify-cookie';
import RDemandState from 'src/contexts/recruiter/demand/RDemandState';
import VADemandState from 'src/contexts/vendor-admin/demand/VADemandState';

export async function getServerSideProps(context) {
  return await verifyRecruiter(context);
}

const ManageDemandPage = ({ userName, vendorId, id }) => {
  const router = useRouter();
  return (
    <VADemandState vendorId={vendorId} userId={id}>
      <ManageDemandBase userName={userName} />
    </VADemandState>
  );
};

export default ManageDemandPage;
