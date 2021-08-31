import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import Link from 'next/link';
import {
  createStyles,
  makeStyles,
  Theme,
  createMuiTheme,
} from '@material-ui/core/styles';
import {
  Typography,
  AppBar,
  Toolbar,
  CssBaseline,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  MenuItem,
  IconButton,
  Button,
  Avatar,
  Popover,
} from '@material-ui/core';
import {
  Mail as MailIcon,
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  SvgIconComponent,
} from '@material-ui/icons';
import OPBreadCrumb, { OPBreadCrumbData } from './OPBreadCrumb';
import defaultTheme from '../../utils/theme';
import { useRouter } from 'next/router';
import PersonIcon from '@material-ui/icons/Person';

const theme = createMuiTheme({
  ...defaultTheme,
});

interface SidebarData {
  label: string;
  icon: SvgIconComponent;
  href: string;
}

type MasterLayoutProps = {
  sidebarLabels: SidebarData[];
  title: string;
  activeSidebarIndex: number;
  children: JSX.Element;
  breadCrumbData?: OPBreadCrumbData[];
  userName?: string;
  disableSidebar: boolean;
} & typeof defaultProps;

const defaultBreadCrumbData: OPBreadCrumbData[] = [];

const defaultProps = {
  title: 'Unknown Page',
  sidebarLabels: [{ label: '', icon: MailIcon }],
  activeSidebarIndex: 0,
  breadCrumbData: defaultBreadCrumbData,
  disableSidebar: false,
};

type SmartLInkProps = {
  href: string;
  children: any;
  key: any;
  iterator: number;
};

const MasterLayout = (props: MasterLayoutProps) => {
  const drawerWidth = props.disableSidebar ? 0 : 240;
  const [open, setOpen] = useState<boolean>(true);
  const handleDrawer = () => {
    setOpen(!open);
  };

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      label: {
        color: 'white',
      },
      root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      // bg: {
      //   backgroundImage: `url('./background.png')`,
      //   width: '100%',
      //   height: '100%'
      // },
      appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: drawerWidth,
      },
      drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        marginTop: '-3rem',
        justifyContent: 'flex-end',
      },
      // necessary for content to be below app bar
      toolbar: theme.mixins.toolbar,
      logoText: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        fontWeight: 600,
        fontSize: 24,
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 14,
      },
      breadCrumbs: {
        marginLeft: 20,
        marginBottom: 10,
        color: 'white',
      },
      title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: '12ch',
          '&:focus': {
            width: '20ch',
          },
        },
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: drawerWidth,
      },
      contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
      selectedSidebarItem: {
        color: theme.palette.primary.dark,
      },
    }),
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const router = useRouter();

  const logout = async () => {
    try {
      const res = await axios({
        url: 'https://test.app.cloudsbuzz.in/apis/v1/logout',
        method: 'post',
      });
      if (res) {
        localStorage.clear();
        router.push('/app/login');
        // window.location.href = '/app/login';
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? 'simple-popover' : undefined;
  // @ts-ignore
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position='fixed'
          className={clsx(
            classes.appBar,
            {
              [classes.appBarShift]: open,
            },
            // classes.bg,
          )}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawer}
              edge='start'
              className={clsx(classes.menuButton, open)}>
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant='h6' noWrap>
              {props.title}
            </Typography>
            {/*SEARCH BAR*/}
            {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div> */}
            <MenuItem component={Button} onClick={handleClick}>
              {/* <IconButton>
                <Avatar src={'https://i.pravatar.cc/300'} />
              </IconButton> */}
              <ListItemIcon>
                <PersonIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <div style={{ color: 'white', fontSize: '14px' }}>
                <b>{props.userName ?? 'Ashwin Prasad'}</b>
              </div>
            </MenuItem>
          </Toolbar>
        </AppBar>

        {!props.disableSidebar && (
          <Drawer
            className={classes.drawer}
            variant='persistent'
            anchor='left'
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}>
            <Typography component='h1' className={classes.logoText}>
              CloudsBuzz
            </Typography>
            <Divider />
            <List>
              {props.sidebarLabels.map((data: SidebarData, index: number) => (
                <SmartLink href={data.href} key={index} iterator={index}>
                  <ListItem
                    button
                    selected={props.activeSidebarIndex === index}
                    className={
                      props.activeSidebarIndex === index
                        ? classes.selectedSidebarItem
                        : undefined
                    }>
                    <ListItemIcon
                      className={
                        props.activeSidebarIndex === index
                          ? classes.selectedSidebarItem
                          : undefined
                      }>
                      <data.icon />
                    </ListItemIcon>
                    <ListItemText primary={data.label} />
                  </ListItem>
                </SmartLink>
              ))}
            </List>
            <Popover
              id={id}
              open={popoverOpen}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}>
              <List component='nav' aria-label='main mailbox folders'>
                <ListItem button onClick={logout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary='Logout' />
                </ListItem>
              </List>
            </Popover>
          </Drawer>
        )}
        <div
          style={{
            backgroundColor: '#f2f2f2',
            minHeight: 'calc(100vh - 20px)',
            margin: '0 auto',
          }}>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: !open,
            })}>
            <div className={classes.drawerHeader} />
            <div
              style={{
                paddingTop: 45,
              }}>
              <Typography component='div'>{props.children}</Typography>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </div>
  );
};

MasterLayout.defaultProps = defaultProps;
export default MasterLayout;

const SmartLink = (props: SmartLInkProps) => {
  if (props.href.startsWith('https://')) {
    return (
      <a
        key={props.iterator}
        href={props.href}
        style={{ textDecoration: 'none', color: 'inherit' }}>
        {props.children}
      </a>
    );
  } else {
    return (
      <Link key={props.iterator} href={props.href}>
        {props.children}
      </Link>
    );
  }
};
