import MasterLayout from '../common/MasterLayout';
import {
  Dashboard as DashboardIcon,
  QuestionAnswer as QAIcon,
  AccessTime as AccessTimeIcon,
  Wc as WcIcon,
  People as PeopleIcon,
  PersonOutline as PersonOutlineIcon,
  Receipt as ReceiptIcon,
  Work as WorkIcon,
  CollectionsBookmark as CollectionsBookmarkIcon,
} from '@material-ui/icons';
import React from 'react';

const root = '/app/super-admin';

const SABaseLayout = ({
  userName,
  children,
  sidebarIndex,
}: {
  userName: string;
  children: React.ReactElement;
  sidebarIndex: number;
}) => {
  const baseUrl = process.env.V1_API_URL;
  return (
    <MasterLayout
      // sidebarLabels={[{ label: 'TBD', icon: QAIcon, href: '/' }]}
      title={'Super Admin Dashboard'}
      sidebarLabels={[
        {
          label: 'Dashboard',
          icon: DashboardIcon,
          href: `${root}/dashboard`,
        },
        {
          label: 'Manage Clients',
          icon: PeopleIcon,
          href: `${root}/manage-client`,
        },
      ]}
      activeSidebarIndex={sidebarIndex}
      userName={userName}
      // activeSidebarIndex={0}
      breadCrumbData={[]}
      disableSidebar={false}>
      {children}
    </MasterLayout>
  );
};

export default SABaseLayout;
