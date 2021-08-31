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

const root = '/app/project-manager';

export default function PMBaseLayout(props: DashboardBaseLayoutProps) {
  return (
    <MasterLayout
      disableSidebar={false}
      title='Project Manager Dashboard'
      userName={props.userName}
      sidebarLabels={[
        {
          label: 'Dashboard',
          icon: DashboardIcon,
          href: `${root}/dashboard`,
        },
        {
          label: 'Time Sheet',
          icon: AccessTimeIcon,
          href: `${root}/timesheet`,
        },
        {
          label: 'Interview',
          icon: WcIcon,
          href: `${root}/interview`,
        },
        {
          label: 'Project Demands',
          icon: ProjectIcon,
          href: `${root}/projects`,
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
