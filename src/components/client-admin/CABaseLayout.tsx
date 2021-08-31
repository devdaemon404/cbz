import React from 'react';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  AccountTree as ProjectIcon,
  Wc as WcIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  LibraryBooks as DocumentManagementIcon,
} from '@material-ui/icons';
import MasterLayout from '../common/MasterLayout';

type DashboardBaseLayoutProps = {
  children: JSX.Element;
  sidebarIndex: number;
  userName?: string;
  role?: string;
};

const root = '/app/client-admin';
const baseUrl = process.env.V1_API_URL;

export default function CABaseLayout(props: DashboardBaseLayoutProps) {
  return (
    <MasterLayout
      disableSidebar={false}
      title={
        props.role === 'CLIENT_ADMIN'
          ? 'Client Admin Dashboard'
          : 'Client Manager Dashboard'
      }
      userName={props.userName}
      sidebarLabels={[
        {
          label: 'Dashboard',
          icon: DashboardIcon,
          href: `${root}/dashboard`,
        },
        {
          label: 'Manage Users',
          icon: PeopleIcon,
          href: `${root}/manage-users`,
        },
        {
          label: 'Manage Vendors',
          href: `${root}/manage-vendors`,
          icon: PersonIcon,
        },
        {
          label: 'Project',
          icon: ReceiptIcon,
          href: `${root}/projects`,
        },
        {
          label: 'Workorder',
          icon: WorkIcon,
          href: `${root}/work-orders`,
        },
        {
          label: 'Document Management',
          icon: DocumentManagementIcon,
          href: `${root}/docs-management`,
        },
        {
          label: 'Interview',
          icon: WcIcon,
          href: `${root}/interview`,
        },
        {
          label: 'Timesheet',
          icon: AccessTimeIcon,
          href: `${root}/timesheet`,
        },
      ]}
      activeSidebarIndex={props.sidebarIndex}>
      {props.children}
    </MasterLayout>
  );
}
