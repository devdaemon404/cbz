import React, { Fragment, useContext, useEffect, useState } from 'react';

import FileSaver from 'file-saver';
import { useRouter } from 'next/router';
// React Components Imports
import {
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  Theme,
  Typography,
  TableRow,
  TableBody,
  TableCell,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  createStyles,
  withStyles,
  makeStyles,
  TextField,
  InputLabel,
  TableFooter,
  TablePagination,
} from '@material-ui/core';
import StyledAlert from '@material-ui/lab/Alert/Alert';
import useTable from '../../common/useTable';
import { GetApp as GetAppIcon } from '@material-ui/icons';
import { ProfileDataType } from 'src/types/project-manager/demand';
import { OPHttpClient } from 'src/utils/op-http-client';
import { ProjectManagerAPIService } from 'src/apis/project-manager/pm-api-service';
import OPLoader from 'src/components/common/OPLoader';
import InterviewModal from '../demand/InterviewModal';
import ScreeningRejectModal from '../demand/ScreeningRejectModal';
import PMInterviewContext from 'src/contexts/project-manager/interview/pm-interview-context';
import moment from 'moment';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';

const useStyles = makeStyles((theme: Theme) => {
  // console.log('Work order theme', theme);
  return createStyles({
    root: {
      width: '100%',
    },
    hoverUnderline: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    font: {
      fontWeight: 'bold',
    },
    margin: {
      margin: theme.spacing(2, 0),
    },
    tableRowHover: {
      '&:hover': {
        backgroundImage:
          'linear-gradient(to right top, #ffffff, #f9f9fc, #f2f4f9, #eaf0f6, #e1ebf2);',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    tableHeadFont: {
      fontWeight: 800,
      backgroundColor: theme.palette.secondary.light,
    },
  });
});

const Alert = withStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 'auto',
    },
  }),
)(StyledAlert);

const InterviewProfiles = ({ clientId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    fetchInterviewSlots,
    isLoading,
    fetchInterview,
    profiles,
    interviewDialogOpened,
    setInterviewDialogOpened,
  } = useContext(PMInterviewContext);

  const { updateProfileStatus, getAllProfilesForDemand } = useContext(
    PMDemandContext,
  );

  const downloadFile = async (profileId, demandId, fileName, status, name) => {
    setLoading(true);
    try {
      const response = await fetch(
        // `https://test.app.cloudsbuzz.in/apis/v1/demand/profile/${profileId}/file`,
        `${process.env.V2_API_URL}/apis/v1/demand/profile/${profileId}/file`,
      );
      const blob = await response.blob();
      FileSaver.saveAs(blob, `${name}_${fileName}`);
      console.log('File successfully downloaded', demandId);
    } catch (err) {
      console.log('Failed to get file', err);
    }

    if (status === 'JOB_SEEKER_INTERESTED') {
      const profile = profiles.filter(
        (_profile) => profileId === _profile.id,
      )[0];
      await updateProfileStatus(profile, 'EVALUATION_IN_PROGRESS', demandId);
      console.log('Updated Profile to Evalutation in Progress');
      await getAllProfilesForDemand(demandId);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInterview();
  }, []);

  const statuses = [
    'SHORT_LISTED',
    'INTERVIEW_IN_PROCESS',
    'INTERVIEW_FAILURE_DROPPED',
    'INTERVIEW_SUCCESS',
  ];
  // Function to reverse string
  function reverseString(str) {
    return str.split('-').reverse().join('-');
  }

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

  const headCells: HeadCell[] = [
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
      label: 'Status',
    },
  ];

  const [filterTerm, setFilterTerm] = useState('resourceName');
  const [slotRejectionRaised, setSlotRejectionRaised] = useState(false);
  const [records, setRecords] = useState(profiles);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  // const {
  //   TblContainer,
  //   TblHead,
  //   TblPagination,
  //   recordsAfterPagingAndSorting,
  // } = useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == '') return items;
        else
          return items.filter((x) =>
            x[filterTerm].toLowerCase().includes(target.value),
          );
      },
    });
  };

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterTerm(event.target.value as string);
    // console.log(document.getElementById('search-field'));
    const searchElement = document.getElementById('search-field');
    if (searchElement) {
      console.log('there is a search field', searchElement);
      searchElement.focus();
    }
  };

  // const { profiles, updateProfileStatus } = useContext(PMDemandContext);

  const [
    screeningRejectedDialogOpened,
    setScreeningRejectedDialogOpened,
  ] = useState(false);

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
  // const dateFormat = (created: string) => {
  //   return moment(created).format('DD-MM-YYYY');
  // };

  // const downloadFile = async (profileId) => {
  //   try {
  //     const response = await fetch(
  //       `https://test.app.cloudsbuzz.in/apis/v1/demand/profile/${profileId}/file`,
  //     );
  //     const blob = await response.blob();
  //     FileSaver.saveAs(blob, 'filename');
  //   } catch (err) {
  //     console.log('Failed to get file');
  //   }

  //   const profile = profiles.filter((_profile) => profileId === _profile.id)[0];
  //   await updateProfileStatus(profile, 'EVALUATION_IN_PROGRESS');
  //   console.log('Updated Profile to Evalutation in Progress');
  // };

  return (
    <Fragment>
      <OPLoader isLoading={loading || isLoading} />
      <Grid container spacing={1}>
        <Grid item>
          <Typography variant='h6' color='initial' className={classes.font}>
            Profiles - (Ongoing)
          </Typography>
        </Grid>
        <Grid container item direction='column'>
          <Grid item>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableHeadFont}
                      align='left'
                      width={10}>
                      S.No.
                    </TableCell>
                    {headCells.map((cells) => (
                      <TableCell
                        align={cells.align ? 'left' : 'center'}
                        className={classes.tableHeadFont}>
                        {cells.label}
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
                      <TableRow hover key={profile.name}>
                        <TableCell align='left'>{index + 1}</TableCell>
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
                        <TableCell align='left'>
                          {profile.profileStatus ===
                            'EVALUATION_IN_PROGRESS' && (
                            <FormControl
                              size='small'
                              fullWidth
                              className={classes.formControl}>
                              <Select
                                variant='outlined'
                                value={profile.profileStatus}
                                // onChange={(e) => handleSelectChange(e, profile)}
                              >
                                <MenuItem value='EVALUATION_IN_PROGRESS'>
                                  Evaluation in Progress
                                </MenuItem>
                                <MenuItem value='SHORT_LISTED'>
                                  Short Listed
                                </MenuItem>
                              </Select>
                            </FormControl>
                          )}

                          {profile.profileStatus ===
                            'JOB_SEEKER_INTERESTED' && (
                            <Alert icon={false} severity='info'>
                              Job Seeker Interested
                            </Alert>
                          )}

                          {profile.profileStatus === 'INTERVIEW_IN_PROCESS' && (
                            <Alert icon={false} severity='info'>
                              Ongoing
                            </Alert>
                          )}
                          {profile.profileStatus ===
                            'INTERVIEW_FAILURE_DROPPED' && (
                            <Alert icon={false} severity='error'>
                              Failed
                            </Alert>
                          )}
                          {profile.profileStatus === 'INTERVIEW_SUCCESS' && (
                            <Alert icon={false} severity='success'>
                              Successful
                            </Alert>
                          )}
                          {profile.profileStatus === 'SHORT_LISTED' && (
                            <Alert icon={false} severity='info'>
                              Short Listed
                            </Alert>
                          )}
                          {profile.profileStatus === 'FILTERED' && (
                            <Alert icon={false} severity='warning'>
                              Filtered
                            </Alert>
                          )}
                          {profile.profileStatus === 'LISTED' && (
                            <Alert icon={false} severity='info'>
                              Listed
                            </Alert>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          <Button
                            onClick={async () => {
                              await fetchInterviewSlots(profile);
                              await setSlotRejectionRaised(
                                profile.slotRejectionRaised,
                              );
                              await setInterviewDialogOpened(true);
                            }}
                            variant='text'
                            color='primary'>
                            Open
                          </Button>
                          <IconButton
                            onClick={() =>
                              downloadFile(
                                profile.id,
                                profile.demand_id,
                                profile.profile_file_name,
                                profile.profileStatus,
                                profile.firstname,
                              )
                            }>
                            <GetAppIcon fontSize='inherit' />
                          </IconButton>
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
                  <Typography
                    variant='h6'
                    color='primary'
                    style={{ padding: '1rem' }}>
                    No Data Available
                  </Typography>
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
          </Grid>
        </Grid>
      </Grid>

      <InterviewModal
        slotRejectionRaised={slotRejectionRaised}
        isOpen={interviewDialogOpened}
        onClose={() => {
          setInterviewDialogOpened(false);
        }}
      />

      <ScreeningRejectModal
        isOpen={screeningRejectedDialogOpened}
        onClose={() => {
          setScreeningRejectedDialogOpened(false);
        }}
      />
    </Fragment>
  );
};

export default InterviewProfiles;
