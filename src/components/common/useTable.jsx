import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
  TableContainer,
  TableFooter,
} from '@material-ui/core';
import OPTablePaginationActions from './OPTablePaginationActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  table: {
    minWidth: 750,
  },
  tableHeadFont: {
    fontWeight: 'bolder',
    backgroundColor: theme.palette.secondary.light,
  },
  tableRow: {
    '&:focus': {},
    cursor: 'pointer',
  },
  hoverUnderline: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  font: {
    fontWeight: 'bold',
  },
}));

export default function useTable(records, headCells, filterFn, noOfRows = 5) {
  const classes = useStyles();

  let pages = [];
  if (noOfRows === 5) {
    pages = [8, 10, 25];
  } else {
    pages = [15, 20, 25];
  }
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, records.length - page * rowsPerPage);

  const TblContainer = (props) => (
    <TableBody>
      {props.children}
      {emptyRows > 0 && (
        <TableRow style={{ height: 81 * emptyRows }}>
          <TableCell colSpan={6} />
        </TableRow>
      )}
    </TableBody>
  );

  const TblHead = (props) => {
    const handleSortRequest = (cellId) => {
      const isAsc = orderBy === cellId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(cellId);
    };

    return (
      <TableHead className={classes.tableHeadFont}>
        <TableRow>
          <TableCell width={10}>
            <b> S.No. </b>
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              align={headCell.align ? 'left' : 'center'}
              key={headCell.id}
              className={classes.font}
              sortDirection={orderBy === headCell.id ? order : false}>
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  style={{
                    marginLeft: `${headCell.align ? '0rem' : '1.5rem'}`,
                  }}
                  onClick={() => {
                    handleSortRequest(headCell.id);
                  }}>
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TblPagination = () => (
    <TableFooter>
      <TableRow>
        <TablePagination
          page={page}
          rowsPerPageOptions={pages}
          rowsPerPage={rowsPerPage}
          count={records.length}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={OPTablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(
      filterFn.fn(records),
      getComparator(order, orderBy),
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    emptyRows
  };
}
