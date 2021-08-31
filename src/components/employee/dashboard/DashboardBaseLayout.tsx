import React from 'react';
import {
  Home as HomeIcon,
  NewReleases as NewReleasesIcon,
  AccessTime as AccessTimeIcon,
} from '@material-ui/icons';
import MasterLayout from '../../common/MasterLayout';

type DashboardBaseLayoutProps = {
  children: JSX.Element;
  sidebarIndex: number;
  userName?: string;
};

const root = 'app/employee';

export default function DashboardBaseLayout(props: DashboardBaseLayoutProps) {
  const title = (
    <div>
      <b>CloudBuzz</b>/ Employee Onboarding
    </div>
  );
  return (
    <MasterLayout
      // disableSidebar={true}
      title='CloudsBuzz / Employee Onboarding'
      userName={props.userName}
      breadCrumbData={[
        {
          label: 'Home',
          icon: HomeIcon,
          href: `/${root}/dashboard`,
        },
      ]}
      sidebarLabels={[
        {
          label: 'Home',
          icon: HomeIcon,
          href: `/${root}/dashboard`,
        },
        {
          label: 'Onboarding',
          icon: NewReleasesIcon,
          href: `/${root}/onboarding`,
        },
        {
          label: 'Timesheet',
          icon: AccessTimeIcon,
          href: `/${root}/timesheet`,
        },
      ]}
      activeSidebarIndex={props.sidebarIndex}
      disableSidebar={true}>
      {props.children}
    </MasterLayout>
  );
}
