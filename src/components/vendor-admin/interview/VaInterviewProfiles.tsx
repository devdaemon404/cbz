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
} from '@material-ui/core';
import StyledAlert from '@material-ui/lab/Alert/Alert';
import {
  Visibility as ViewIcon,
  Schedule as InterviewRoundIcon,
} from '@material-ui/icons';
import OPLoader from 'src/components/common/OPLoader';
import VaInterviewModal from './VaInterviewModal';
import VAInterviewContext from 'src/contexts/vendor-admin/interview/va-interview-context';
import ViewProfileModal from './ViewProfileModal';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import NoDataSVG from 'src/components/common/svg/NoDataSVG';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  tableHeadFont: {
    fontWeight: 800,
    backgroundColor: theme.palette.secondary.light,
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
  candidateName: string;
  emailId: string;
  contactNumber: string;
  experience: string;
  submittedDate: string;
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
    id: 'candidateName',
    numeric: false,
    disablePadding: true,
    label: 'Candidate Name',
    align: 'left',
  },
  {
    id: 'emailId',
    numeric: false,
    disablePadding: false,
    label: 'Email Id',
    align: 'left',
  },
  {
    id: 'contactNumber',
    numeric: false,
    disablePadding: false,
    label: 'Contact Number',
  },
  {
    id: 'experience',
    numeric: false,
    disablePadding: false,
    label: 'Experience',
  },
  {
    id: 'submittedDate',
    numeric: false,
    disablePadding: false,
    label: 'Submitted Date',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Interview Status',
  },
];

const InterviewProfiles = ({ role }: { role: string }) => {
  const classes = useStyles();
  const {
    profiles,
    isLoading,
    currentProfileIndex,
    isInterviewModalOpen,
    setIsInterviewModalOpen,
    fetchProfile,
    fetchInterview,
    setCurrentProfileIndex,
  } = useContext(VAInterviewContext);
  console.log('VA Interview Profiles: ', profiles);

  // Pagination ********

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, profiles.length - page * rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ********************

  const [viewProfileModalOpened, setViewProfileModalOpened] = useState(false);

  return (
    <Fragment>
      <OPLoader isLoading={isLoading} />
      <Grid container spacing={1}>
        <Grid container item direction='column'>
          <Grid item>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeadFont} width={10}>
                      S.No.
                    </TableCell>
                    {headContent.map((head) => (
                      <TableCell
                        align={head.align ? 'left' : 'center'}
                        className={classes.tableHeadFont}>
                        {head.label}
                      </TableCell>
                    ))}
                    <TableCell align='center' className={classes.tableHeadFont}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                {profiles.length > 0 ? (
                  <TableBody>
                    {(rowsPerPage > 0
                      ? profiles?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : profiles
                    )?.map((profile, index) => (
                      <TableRow hover key={profile.id}>
                        <TableCell align='center'>{index + 1}</TableCell>
                        <TableCell component='th' align='left' scope='row'>
                          {`${profile.firstname} ${profile.lastname}`}
                        </TableCell>
                        <TableCell align='left'>{profile.email}</TableCell>
                        <TableCell align='center'>{profile.mobile}</TableCell>
                        <TableCell align='center'>
                          {profile.experience}
                        </TableCell>
                        <TableCell align='center'>
                          {moment(profile.created).format('DD-MM-YYYY')}
                        </TableCell>
                        <TableCell align='center'>
                          {role === 'VENDOR_ADMIN' &&
                          profile.profile_status === 'INTERVIEW_IN_PROCESS' ? (
                            <Alert icon={false} severity='info'>
                              Ongoing
                            </Alert>
                          ) : (
                            <Alert icon={false} severity='info'>
                              {profile.profile_status}
                            </Alert>
                          )}
                          {role !== 'VENDOR_ADMIN' &&
                          profile.profileStatus === 'INTERVIEW_IN_PROCESS' ? (
                            <Alert icon={false} severity='info'>
                              Ongoing
                            </Alert>
                          ) : null}
                        </TableCell>
                        <TableCell align='center'>
                          <ButtonGroup>
                            <Button
                              onClick={async () => {
                                await fetchProfile(profile.id);
                                setIsInterviewModalOpen(true);
                              }}
                              variant='text'
                              color='primary'>
                              <InterviewRoundIcon />
                            </Button>
                            <Button
                              onClick={async () => {
                                await fetchProfile(profile.id);
                                setViewProfileModalOpened(true);
                              }}
                              variant='text'
                              color='secondary'>
                              <ViewIcon />
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 81 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow style={{ height: 81 * emptyRows }}>
                      <TableCell colSpan={6}>
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
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: 'All', value: -1 },
                      ]}
                      count={profiles.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={OPTablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            {/*</Paper>*/}
          </Grid>
        </Grid>
      </Grid>

      <VaInterviewModal
        // profileIndex={currentProfileIndex}
        role={role}
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
        }}
      />

      <ViewProfileModal
        // profileIndex={currentProfileIndex}
        isOpen={viewProfileModalOpened}
        onClose={() => {
          setViewProfileModalOpened(false);
        }}
      />
    </Fragment>
  );
};

export default InterviewProfiles;
