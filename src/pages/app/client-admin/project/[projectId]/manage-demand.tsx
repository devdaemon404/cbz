import React from 'react';
import ManageDemandBase from '../../../../../components/client-admin/demands/ManageDemand';
import CADemandState from 'src/contexts/client-admin/projects/demands/CADemandState';
import { verifyClientAdmin } from '../../../../../utils/auth/verify-cookie';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

const ManageDemandPage = (props) => {
  console.log({ props });
  const router = useRouter();
  const projectId = router.query.projectId;
  return (
    <CADemandState
      clientId={props.clientId}
      projectId={projectId}
      id={props.id}>
      <ManageDemandBase
        userName={props.userName}
        projectId={router.query.projectId}
      />
    </CADemandState>
  );
};

export default ManageDemandPage;
