import React from 'react';
import ManageDemandBase from '../../../components/vendor-admin/manage-demand/ManageDemand';
import { useRouter } from 'next/router';
import { verifyVendorAdmin } from 'src/utils/auth/verify-cookie';
import VADemandState from 'src/contexts/vendor-admin/demand/VADemandState';

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

const ManageDemandPage = ({ userName, userId, id }) => {
  const router = useRouter();
  return (
    <VADemandState vendorId={userId} userId={id}>
      <ManageDemandBase userName={userName} />
    </VADemandState>
  );
};

export default ManageDemandPage;
