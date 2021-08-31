import { makeStyles } from '@material-ui/core/styles';

import { useEffect, Fragment } from 'react';
import Head from 'next/head';

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
} from '@material-ui/core';
import DashboardBaseLayout from '../../../../components/employee/dashboard/DashboardBaseLayout';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(
  client: string,
  company: string,
  plan: string,
  createdDate: string,
  subUsers: number,
  status: string,
) {
  return { client, company, plan, createdDate, subUsers, status };
}

const rows = [
  createData(
    'Ashwin Prasada',
    'Onpar Labs',
    'Premium',
    '22/11/1998',
    10,
    'OPEN',
  ),
];

export default function HomePageRoot() {
  const classes = useStyles();

  return (
    <Fragment>
      <Head>
        <title>OP-Dashboard</title>
      </Head>
      <DashboardBaseLayout sidebarIndex={0}>
        <Paper elevation={12}>
          <TableContainer component={'div'}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Client User</TableCell>
                  <TableCell align='left'>Company&nbsp;(g)</TableCell>
                  <TableCell align='left'>Plan&nbsp;(g)</TableCell>
                  <TableCell align='left'>Created Date&nbsp;(g)</TableCell>
                  <TableCell align='right'>Sub Users&nbsp;(g)</TableCell>
                  <TableCell align='left'>Status&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              {rows.length > 0 ? (
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component='th' scope='row'>
                        {row.client}
                      </TableCell>
                      <TableCell align='left'>{row.company}</TableCell>
                      <TableCell align='left'>{row.plan}</TableCell>
                      <TableCell align='left'>{row.createdDate}</TableCell>
                      <TableCell align='right'>{row.subUsers}</TableCell>
                      <TableCell align='left'>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <Typography
                  variant='h6'
                  color='primary'
                  style={{ padding: '1rem' }}>
                  No Data Available
                </Typography>
              )}
            </Table>
          </TableContainer>
        </Paper>
      </DashboardBaseLayout>
    </Fragment>
  );
}
