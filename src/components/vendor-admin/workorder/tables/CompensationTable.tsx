import React, { Fragment, useEffect, useState } from 'react';
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
import TextField from '@material-ui/core/TextField';

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
}));

const CompensationTable = ({ data }) => {
  const classes = useStyles();

  const [regularMarkup, setRegularMarkup] = useState<number>(0);
  const [regularBillRate, setRegularBillRate] = useState<number>(0);
  const [reimbursementRate, setReimbursementRate] = useState<number>(0);

  useEffect(() => {
    setRegularBillRate(
      parseInt(data.rateCard) + (regularMarkup / 100) * data.rateCard,
    );
  }, [regularMarkup]);

  useEffect(() => {
    setReimbursementRate(regularBillRate - data.contractedFee);
  }, [regularBillRate]);

  return (
    <Fragment>
      <TableContainer variant='outlined' component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell className={classes.rowBackground} align='center'>
                Regular Pay Rate
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                +
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                Regular Mark-Up (%)
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                =
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                Regular Bill Rate
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                -
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                Contracted Fee
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                =
              </TableCell>
              <TableCell className={classes.rowBackground} align='center'>
                Reimbursement Rate
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align='center'>
                {data.rateCard ? data.rateCard : 'Not provided'}
              </TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'>
                <TextField
                  id='regular-markup'
                  size='small'
                  variant='outlined'
                  value={regularMarkup ? regularMarkup : 0}
                  style={{ width: '5rem' }}
                  onChange={(e) =>
                    setRegularMarkup(
                      e.target.value.trim() === ''
                        ? 0
                        : parseInt(e.target.value),
                    )
                  }
                />
              </TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'>
                {regularBillRate ? regularBillRate : '0'}
              </TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'>
                {data.contractedFee ? data.contractedFee : 'Not provided'}
              </TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'>
                {reimbursementRate ? reimbursementRate : '0'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default CompensationTable;
