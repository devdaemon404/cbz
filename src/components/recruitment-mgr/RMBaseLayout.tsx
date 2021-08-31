import React from 'react';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  AccountTree as ProjectIcon,
  Wc as WcIcon,
  People as PeopleIcon,
} from '@material-ui/icons';
import MasterLayout from '../common/MasterLayout';

type DashboardBaseLayoutProps = {
  children: JSX.Element;
  sidebarIndex: number;
  userName?: string;
};

const root = '/app/recruitment-mgr';
const baseUrl = process.env.V1_API_URL;

export default function RMBaseLayout(props: DashboardBaseLayoutProps) {
  return (
    <MasterLayout
      disableSidebar={false}
      title='Recruitment Manager Dashboard'
      userName={props.userName}
      sidebarLabels={[
        {
          label: 'Dashboard',
          icon: DashboardIcon,
          href: `${root}/dashboard`,
        },
        {
          label: 'Manage Recruiter',
          icon: PeopleIcon,
          href: `${baseUrl}/#/application/recruiterlist`,
        },
        {
          label: 'Demand',
          icon: ReceiptIcon,
          href: `${baseUrl}/#/application/managedemand`,
        },
        {
          label: 'Interview',
          icon: WcIcon,
          href: `${root}/interview`,
        },
        // {
        //   label: 'Project Demands',
        //   icon: ProjectIcon,
        //   href: `${root}/projects`,
        // },
        // {
        //   label: 'Workorder',
        //   icon: WorkIcon,
        //   href: `${root}/work-orders`,
        // },
      ]}
      activeSidebarIndex={props.sidebarIndex}>
      {props.children}
    </MasterLayout>
  );
}
