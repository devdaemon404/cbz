import React, { Fragment, useContext, useState } from 'react';
import moment from 'moment';
// React Components Imports
import {
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  Theme,
  TableRow,
  TableBody,
  TableCell,
  Button,
  makeStyles,
  ButtonGroup,
  Typography,
  withStyles,
  createStyles,
  TableFooter,
  TablePagination,
  Tooltip,
} from '@material-ui/core';
import StyledAlert from '@material-ui/lab/Alert/Alert';
import {
  Edit as EditIcon,
  GetApp as DownloadIcon,
  PostAdd as AddIcon,
} from '@material-ui/icons';
import OPLoader from 'src/components/common/OPLoader';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import { ProfileDataType } from 'src/types/project-manager/demand';
import VAComplianceContext from 'src/contexts/vendor-admin/compliance/va-cc-context';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  tableHeadFont: {
    fontWeight: 800,
    // backgroundColor: theme.palette.secondary.light,
  },
}));

const Alert = withStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 'auto',
    },
  }),
)(StyledAlert);

interface Data {
  documentName: string;
  uploadedOn: string;
  status: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  align?: string;
}

const headContent: HeadCell[] = [
  {
    id: 'documentName',
    numeric: false,
    disablePadding: true,
    label: 'Document Name',
    align: 'left',
  },
  {
    id: 'uploadedOn',
    numeric: false,
    disablePadding: false,
    label: 'Uploaded On',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
];

const ComplianceTable = () => {
  const classes = useStyles();

  // Pagination ********
  // const documents: ProfileDataType[] = [];
  const { documents, handleDocumentTypeChange, downloadDocument } = useContext(
    VAComplianceContext,
  );

  return (
    <Fragment>
      <OPLoader isLoading={false} />
      <Grid container spacing={1}>
        <Grid container item direction='column'>
          <Grid item>
            <TableContainer component={Paper} style={{ height: '80vh' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell className={classes.tableHeadFont} width={10}>
                      S.No.
                    </TableCell> */}
                    {headContent.map((head) => (
                      <TableCell
                        align={head.align ? 'left' : 'center'}
                        width={head.label === 'Status' ? 10 : undefined}
                        className={classes.tableHeadFont}>
                        {head.label}
                      </TableCell>
                    ))}
                    <TableCell
                      align='center'
                      width={10}
                      className={classes.tableHeadFont}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                {documents.length > 0 ? (
                  <TableBody>
                    {documents.map((data, index) => (
                      <TableRow hover key={data.id}>
                        {/* <TableCell align='center'>{index + 1}</TableCell> */}
                        <TableCell component='th' align='left' scope='row'>
                          {data.document_name}
                        </TableCell>
                        <TableCell align='center'>
                          {data.updated
                            ? moment(data.updated).format('DD MMM YYYY')
                            : '--'}
                        </TableCell>
                        <TableCell align='center'>
                          {data.document_status === 'NOT_PRESENT' && (
                            <Alert icon={false} severity='error'>
                              PENDING
                            </Alert>
                          )}
                          {data.document_status === 'APPROVED' && (
                            <Alert icon={false} severity='success'>
                              {data.document_status}
                            </Alert>
                          )}
                          {data.document_status === 'REQUESTED' && (
                            <Alert icon={false} severity='warning'>
                              {data.document_status}
                            </Alert>
                          )}
                          {data.document_status === 'SUBMITTED' && (
                            <Alert icon={false} severity='info'>
                              {data.document_status}
                            </Alert>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          {/* {data.document_status !== 'NOT_PRESENT' && ( */}
                          <ButtonGroup>
                            {data.document_status !== 'APPROVED' && (
                              <Tooltip
                                title={
                                  data.document_status === 'NOT_PRESENT'
                                    ? 'Create Document'
                                    : 'Edit Document'
                                }>
                                <Button
                                  onClick={() =>
                                    handleDocumentTypeChange(data.document_type)
                                  }
                                  variant='text'
                                  color='primary'>
                                  {data.document_status === 'NOT_PRESENT' ? (
                                    <AddIcon />
                                  ) : (
                                    <EditIcon />
                                  )}
                                </Button>
                              </Tooltip>
                            )}
                            {(data.document_status === 'APPROVED' ||
                              data.document_status === 'SUBMITTED') && (
                              <Button
                                onClick={() =>
                                  downloadDocument(data.document_type)
                                }
                                variant='text'
                                color='primary'>
                                <DownloadIcon />
                              </Button>
                            )}
                          </ButtonGroup>
                          {/* )} */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        style={{ borderBottom: 'none', paddingTop: '3rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                          }}>
                          <Typography variant='h4' color='primary'>
                            No available data
                          </Typography>
                          <NoDataSVG />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ComplianceTable;
