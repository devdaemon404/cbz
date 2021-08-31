import React, { Fragment } from 'react';
import {
  Theme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
} from '@material-ui/core/';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    width: '100%',
  },
  rowBackground: {
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(1),
  },
  headUnderline: {
    borderBottom: `3px solid ${green[400]}`,
  },
  fieldWidth: {
    width: theme.spacing(6),
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
  paperPadding: {
    padding: theme.spacing(0.35),
    marginBottom: theme.spacing(2),
  },
  paperBackground: {
    backgroundColor: theme.palette.secondary.light,
  },
  font: {
    fontWeight: 'bold',
  },
}));

const ContractualComponentsTable = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <TableContainer variant='outlined' component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell
                className={classes.rowBackground}
                align='center'></TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                Version
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                Effective Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align='center' className={classes.font}>
                Governing Master Service Aggrement
              </TableCell>
              <TableCell align='center'>MSA v1</TableCell>
              <TableCell align='center'>09/29/19</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='center' className={classes.font}>
                Statement of Work
              </TableCell>
              <TableCell align='center'>Non Payroll - SF_30SEP2019</TableCell>
              <TableCell align='center'>09/29/19</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default ContractualComponentsTable;
