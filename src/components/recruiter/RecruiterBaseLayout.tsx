import React from 'react';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  AccountTree as ProjectIcon,
  Wc as WcIcon,
  Person as PersonIcon,
} from '@material-ui/icons';
import MasterLayout from '../common/MasterLayout';

type DashboardBaseLayoutProps = {
  children: JSX.Element;
  sidebarIndex: number;
  userName?: string;
};

const root = '/app/recruiter';
const baseUrl = process.env.V1_API_URL;

export default function RecruiterBaseLayout(props: DashboardBaseLayoutProps) {
  return (
    <MasterLayout
      disableSidebar={false}
      title='Recruiter Dashboard'
      userName={props.userName}
      sidebarLabels={[
        {
          label: 'Dashboard',
          icon: DashboardIcon,
          href: `${root}/dashboard`,
        },
        {
          label: 'Demands',
          icon: ReceiptIcon,
          href: `${root}/manage-demands`,
        },
        // {
        //   label: 'Recruitment',
        //   icon: PersonIcon,
        //   href: ``,
        // },
        {
          label: 'Interview',
          icon: WcIcon,
          href: `${root}/interview`,
        },
        // {
        //   label: 'Time Sheet',
        //   icon: AccessTimeIcon,
        //   href: `${root}/timesheet`,
        // },

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
