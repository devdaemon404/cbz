import React from 'react';
import {
  Home as HomeIcon,
  NewReleases as NewReleasesIcon,
} from '@material-ui/icons';
import MasterLayout from '../../common/MasterLayout';

type DashboardBaseLayoutProps = {
  children: JSX.Element;
  sidebarIndex: number;
  userName?: string;
};

const root = '/employee/onboarding';

export default function DashboardBaseLayout(props: DashboardBaseLayoutProps) {
  const title = (
    <div>
      <b>CloudBuzz</b>/ Employee Onboarding
    </div>
  );
  return (
    <MasterLayout
      disableSidebar={true}
      title='CloudBuzz / Employee Onboarding'
      userName={props.userName}
      breadCrumbData={[
        {
          label: 'Home',
          icon: HomeIcon,
          href: `${root}`,
        },
      ]}
      sidebarLabels={[
        {
          label: 'Home',
          icon: HomeIcon,
          href: `${root}`,
        },
        {
          label: 'Onboarding',
          icon: NewReleasesIcon,
          href: `${root}/onboarding`,
        },
      ]}
      activeSidebarIndex={props.sidebarIndex}>
      {props.children}
    </MasterLayout>
  );
}
