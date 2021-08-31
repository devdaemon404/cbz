import React, { Fragment, useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import FileDownload from 'js-file-download';
import FileSaver from 'file-saver';
import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableHead,
  Theme,
  Grid,
  Typography,
  TableRow,
  TableBody,
  TableCell,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  TablePagination,
  TableFooter,
} from '@material-ui/core';
import 'date-fns';
import { createStyles, withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import PMInterviewContext from '../../../contexts/project-manager/interview/pm-interview-context';
import {
  DemandDataType,
  ProfileDataType,
} from 'src/types/project-manager/demand';
import InterviewModal from './InterviewModal';
import ScreeningRejectModal from './ScreeningRejectModal';
import CADemandContext from '../../../contexts/client-admin/projects/demands/ca-demand-context';
import OPLoader from 'src/components/common/OPLoader';
import StyledAlert from '@material-ui/lab/Alert/Alert';
import GetAppIcon from '@material-ui/icons/GetApp';
import OPTablePaginationActions from 'src/components/common/OPTablePaginationActions';
const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  font: {
    fontWeight: 'bold',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  message: {
    margin: 'auto',
  },
}));

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.light,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:focus': {},
    },
  }),
)(TableRow);

const Alert = withStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 'auto',
    },
  }),
)(StyledAlert);

interface Data {
  candidateName: string;
  email: string;
  mobile: string;
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
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email Id',
    align: 'left',
  },
  {
    id: 'mobile',
    numeric: false,
    disablePadding: true,
    label: 'Contact Number',
  },
  {
    id: 'experience',
    numeric: false,
    disablePadding: true,
    label: 'Experience',
  },
  {
    id: 'submittedDate',
    numeric: false,
    disablePadding: true,
    label: 'Submitted Date',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
  },
];

const statuses = [
  'SHORT_LISTED',
  'INTERVIEW_IN_PROCESS',
  'INTERVIEW_FAILURE_DROPPED',
  'INTERVIEW_SUCCESS',
];

const statusesToShow = [
  'SHORT_LISTED',
  'JOB_SEEKER_INTERESTED',
  'EVALUATION_IN_PROGRESS',
  'INTERVIEW_IN_PROCESS',
  'INTERVIEW_FAILURE_DROPPED',
  'INTERVIEW_SUCCESS',
];

const ViewProfileTab = ({ demandData }: { demandData: DemandDataType }) => {
  const classes = useStyles();
  const { fetchInterviewSlots, isLoading } = useContext(PMInterviewContext);
  const { profiles, updateProfileStatus, getAllProfilesForDemand } = useContext(
    CADemandContext,
  );

  const [profilesToShow, setProfilesToShow] = useState<ProfileDataType[]>([]);

  useEffect(() => {
    const _profiles = profiles.filter((profile) =>
      statusesToShow.includes(profile.profile_status),
    );
    setProfilesToShow(_profiles);
  }, [profiles]);

  const [interviewDialogOpened, setInterviewDialogOpened] = useState(false);
  const [slotRejectionRaised, setSlotRejectionRaised] = useState(false);
  const [
    screeningRejectedDialogOpened,
    setScreeningRejectedDialogOpened,
  ] = useState(false);
  const dateFormat = (created: string) => {
    return moment(created).format('DD-MM-YYYY');
  };

  // Pagination ********

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, profilesToShow.length - page * rowsPerPage);

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

  const [loading, setLoading] = useState(false);

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
      const profile = profilesToShow.filter(
        (_profile) => profileId === _profile.id,
      )[0];
      await updateProfileStatus(profile, 'EVALUATION_IN_PROGRESS', demandId);
      console.log('Updated Profile to Evalutation in Progress');
      await getAllProfilesForDemand(demandId);
    }
    setLoading(false);
  };

  const handleSelectChange = async (
    event: React.ChangeEvent<{ value: unknown }>,
    profile,
  ) => {
    if (event.target.value === 'SHORT_LISTED') {
      await updateProfileStatus(profile, 'SHORT_LISTED', profile.demand_id);
      console.log('Updated Profile to Short Listed', profile);
      await getAllProfilesForDemand(profile.demand_id);
    }
  };

  useEffect(() => {
    console.log('slot rejec', slotRejectionRaised);
  }, [slotRejectionRaised]);

  return (
    <Fragment>
      <OPLoader isLoading={isLoading || loading} />
      <Grid container spacing={1}>
        <Grid item>
          <Typography variant='h6' color='initial' className={classes.font}>
            Demand - {demandData.request_id}
          </Typography>
        </Grid>
        <Grid container item direction='column'>
          <Grid item>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      className={classes.font}
                      align='left'
                      width={10}>
                      S.No.
                    </StyledTableCell>
                    {headContent.map((head) => (
                      <StyledTableCell
                        className={classes.font}
                        align={head.align ? 'left' : 'center'}>
                        {head.label}
                      </StyledTableCell>
                    ))}
                    <StyledTableCell className={classes.font} align='center'>
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {profilesToShow.length > 0 ? (
                  <TableBody>
                    {(rowsPerPage > 0
                      ? profilesToShow?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : profilesToShow
                    )?.map((profile, index) => (
                      <StyledTableRow hover key={profile.name}>
                        <StyledTableCell align='left'>
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell
                          component='th'
                          align='left'
                          scope='row'>
                          {profile.name
                            ? profile.name
                            : `${profile.firstname} ${profile.lastname}`}
                        </StyledTableCell>
                        <StyledTableCell align='left'>
                          {profile.email}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {profile.mobile}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {profile.experience}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {dateFormat(profile.created)}
                        </StyledTableCell>
                        <TableCell align='left'>
                          {profile.profile_status ===
                            'EVALUATION_IN_PROGRESS' && (
                            <FormControl
                              size='small'
                              fullWidth
                              className={classes.formControl}>
                              <Select
                                variant='outlined'
                                value={profile.profile_status}
                                onChange={(e) =>
                                  handleSelectChange(e, profile)
                                }>
                                <MenuItem value='EVALUATION_IN_PROGRESS'>
                                  Evaluation in Progress
                                </MenuItem>
                                <MenuItem value='SHORT_LISTED'>
                                  Short Listed
                                </MenuItem>
                              </Select>
                            </FormControl>
                          )}

                          {profile.profile_status ===
                            'JOB_SEEKER_INTERESTED' && (
                            <Alert icon={false} severity='info'>
                              Job Seeker Interested
                            </Alert>
                          )}

                          {profile.profile_status === 'READY_TO_SHARE' && (
                            <Alert icon={false} severity='info'>
                              Ready to share
                            </Alert>
                          )}

                          {profile.profile_status ===
                            'INTERVIEW_IN_PROCESS' && (
                            <Alert icon={false} severity='info'>
                              Ongoing
                            </Alert>
                          )}
                          {profile.profile_status ===
                            'INTERVIEW_FAILURE_DROPPED' && (
                            <Alert icon={false} severity='error'>
                              Failed
                            </Alert>
                          )}
                          {profile.profile_status === 'INTERVIEW_SUCCESS' && (
                            <Alert icon={false} severity='success'>
                              Successful
                            </Alert>
                          )}
                          {profile.profile_status === 'SHORT_LISTED' && (
                            <Alert icon={false} severity='info'>
                              Short Listed
                            </Alert>
                          )}
                          {profile.profile_status === 'FILTERED' && (
                            <Alert icon={false} severity='warning'>
                              Filtered
                            </Alert>
                          )}
                          {profile.profile_status === 'LISTED' && (
                            <Alert icon={false} severity='info'>
                              Listed
                            </Alert>
                          )}
                        </TableCell>
                        <StyledTableCell align='center'>
                          {statuses.includes(profile.profile_status) && (
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
                          )}
                          <IconButton
                            onClick={() =>
                              downloadFile(
                                profile.id,
                                profile.demand_id,
                                profile.profile_file_name,
                                profile.profile_status,
                                profile.firstname,
                              )
                            }>
                            <GetAppIcon fontSize='inherit' />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
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
                    style={{ padding: '1rem 2rem' }}>
                    No Profiles for the Current Demand
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
                      count={profilesToShow.length}
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

export default ViewProfileTab;
