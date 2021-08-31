import React from 'react';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  AccountTree as ProjectIcon,
  Wc as WcIcon,
} from '@material-ui/icons';
import MasterLayout from '../common/MasterLayout';

type DashboardBaseLayoutProps = {
  children: JSX.Element;
  sidebarIndex: number;
  userName?: string;
};

const root = '/app/vice-president';
const baseUrl = process.env.V1_API_URL;

export default function VPBaseLayout(props: DashboardBaseLayoutProps) {
  return (
    <MasterLayout
      disableSidebar={false}
      title='Vice President Dashboard'
      userName={props.userName}
      sidebarLabels={[
        {
          label: 'Dashboard',
          icon: DashboardIcon,
          href: `${root}/dashboard`,
        },
        {
          label: 'Workorder',
          icon: WorkIcon,
          href: `${root}/work-orders`,
        },
      ]}
      activeSidebarIndex={props.sidebarIndex}>
      {props.children}
    </MasterLayout>
  );
}
