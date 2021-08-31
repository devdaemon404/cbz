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

const root = '/app/vendor-admin';

const VABaseLayout = ({
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
      title={'Vendor Admin Dashboard'}
      sidebarLabels={[
        {
          label: 'Dashboard',
          icon: DashboardIcon,
          href: `${root}/dashboard`,
        },
        {
          label: 'Manage Users',
          icon: PeopleIcon,
          href: `${root}/manage-user`,
        },
        {
          label: 'Manage Employees',
          icon: PersonOutlineIcon,
          href: `${root}/manage-employees`,
        },
        {
          label: 'Demand',
          icon: ReceiptIcon,
          href: `${root}/manage-demands`,
        },
        {
          label: 'Work Order',
          icon: WorkIcon,
          href: `${root}/work-orders`,
        },
        {
          label: 'Compliance Check',
          icon: CollectionsBookmarkIcon,
          href: `${root}/compliance-check`,
        },
        {
          label: 'Time Sheet',
          icon: AccessTimeIcon,
          href: `${root}/timesheet`,
        },
        {
          label: 'Interview',
          icon: WcIcon,
          href: `${root}/va-interview`,
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

export default VABaseLayout;
