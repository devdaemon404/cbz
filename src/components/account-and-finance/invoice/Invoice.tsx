import {
  Button,
  MenuItem,
  TextField,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect } from 'react';
import OPLoader from '../../common/OPLoader';
import AFBaseLayout from '../AFBaseLayout';
import InvoiceTable from './InvoiceTable';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import ANFInvoiceContext from 'src/contexts/acc-and-fin/invoice/anf-i-context';

const Invoice = ({ userName, id }) => {
  const { selectedDate, handleDateChange } = useContext(ANFInvoiceContext);
  return (
    <AFBaseLayout userName={userName} sidebarIndex={1}>
      <>
        <OPLoader isLoading={false} />
        <Typography variant='h5' color='primary'>
          Download Invoice
        </Typography>
        <Paper style={{ padding: '1rem 2rem' }}>
          <Typography variant='caption'>Pick a Month</Typography>
          <br></br>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              variant='inline'
              openTo='year'
              size='small'
              views={['year', 'month']}
              inputVariant='outlined'
              value={selectedDate}
              style={{ marginBottom: '1rem' }}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
          <InvoiceTable />
        </Paper>
      </>
    </AFBaseLayout>
  );
};

export default Invoice;
