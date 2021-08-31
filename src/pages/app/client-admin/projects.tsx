import React from 'react';
import { verifyClientAdmin } from '../../../utils/auth/verify-cookie';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import Projects from 'src/components/client-admin/Projects/Projects';
import CAProjectsState from 'src/contexts/client-admin/projects/CAProjectsState';
export async function getServerSideProps(context) {
  return await verifyClientAdmin(context);
}

export default function CAProjects({
  userName,
  clientId,
  role,
  id,
}: {
  userName: string;
  clientId: string;
  id: string;
  role: string;
}) {
  return (
    <CAProjectsState clientId={clientId} id={id} userName={userName}>
      <CABaseLayout userName={userName} sidebarIndex={3} role={role}>
        <Projects clientId={clientId} id={id} userName={userName} />
      </CABaseLayout>
    </CAProjectsState>
  );
}
