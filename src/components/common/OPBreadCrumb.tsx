import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NextLink from 'next/link';
import { SvgIconComponent } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      display: 'flex',
      color: '#e3e3e3',
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
  })
);

type OPBreadCrumbProps = {
  data: OPBreadCrumbData[];
};

const OPBreadCrumb = (props: OPBreadCrumbProps) => {
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      {props.data.map((data) => (
        <NextLink href={data.href}>
          <Link color='inherit' className={classes.link}>
            <data.icon className={classes.icon} />
            {data.label}
          </Link>
        </NextLink>
      ))}
    </Breadcrumbs>
  );
};

export interface OPBreadCrumbData {
  label: string;
  icon: SvgIconComponent;
  href: string;
}

export default OPBreadCrumb;
