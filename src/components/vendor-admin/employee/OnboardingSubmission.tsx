import React, { Fragment, useContext } from 'react';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Divider,
  Typography,
  Link,
  Paper,
  Box,
} from '@material-ui/core';
import OnboardingContext from '../../../contexts/employee/onboardingContext';
import { Theme } from '@material-ui/core/styles';
import OPKeyValue from 'src/components/common/OPKeyValue';
import moment from 'moment';

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: 'none',
      },
    },
  },
});

// styles for the page
const useStyles = makeStyles((theme: Theme) => ({
  table: {
    borderSpacing: '0 10px',
    borderCollapse: 'separate',
  },
  labelStyle: {
    fontSize: 17,
    marginBottom: 2,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(0, 10),
  },
  bgPaper: {
    padding: theme.spacing(2, 2, 2, 2),
  },
  margin: {
    padding: 7,
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  tableRowColor: {
    backgroundColor: '#DBE2E7',
  },
  tableHeadFont: {
    fontWeight: 'bold',
    fontSize: '.8rem',
  },
  documentContainer: {
    margin: theme.spacing(1),
  },
}));

// Column values for work table
interface WorkColumn {
  label: string;
  minWidth?: number;
  align?: 'left';
}

const workColumns: WorkColumn[] = [
  { label: 'Company', minWidth: 0 },
  { label: 'Designation', minWidth: 0 },
  { label: 'Start Date', minWidth: 0 },
  { label: 'End Date', minWidth: 0 },
  { label: 'Responsibilities', minWidth: 0 },
];

// column values for skills table
interface SkillsColumn {
  label: string;
  minWidth?: number;
  align?: 'left';
}

const skillsColumns: SkillsColumn[] = [
  { label: 'Expert Skills', minWidth: 0 },
  { label: 'Intermediate Skills', minWidth: 0 },
  { label: 'Beginner Skills', minWidth: 0 },
];

interface AcademicInfoColumn {
  label: string;
  minWidth?: number;
  align?: 'left';
}

const academicInfoColumns: AcademicInfoColumn[] = [
  { label: 'Qualification', minWidth: 0 },
  { label: 'School/College', minWidth: 0 },
  { label: 'Specialization', minWidth: 0 },
  { label: 'Year of Passing', minWidth: 0 },
  { label: 'Percentage', minWidth: 0 },
];

interface FamilyInfoColumn {
  label: string;
  minWidth?: number;
  align?: 'left';
}

const familyInfoColumns: FamilyInfoColumn[] = [
  { label: 'Family Member Name', minWidth: 0 },
  { label: 'Relationship', minWidth: 0 },
  { label: 'DOB', minWidth: 0 },
  { label: 'Blood Group', minWidth: 0 },
  { label: 'Occupation', minWidth: 0 },
];

export default function OnboardingSubmission(props) {
  // context
  const { downloadFile } = useContext(OnboardingContext);
  const { onboardingData } = props;
  console.log({ onboardingData });

  const skills = onboardingData.skills;

  const workHistory = onboardingData.workHistory;

  const academicInfo = onboardingData.academicInfo;

  const familyInfo = onboardingData.familyInfo;

  interface RequiredFile {
    name: string;
    uploaded: boolean;
  }

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Typography variant={'h5'}>Employee Onboarding Information</Typography>
        <br />
        <Typography variant={'subtitle2'}>
          {moment(onboardingData.updatedAt).format(
            '[Last Updated:] ddd, DD-MMM yyyy [at] hh:mm a',
          )}
        </Typography>
        <br />
        <Paper variant='outlined' className={classes.bgPaper}>
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='flex-start'
            spacing={4}>
            {/*contact Info Grid  */}

            {/* Work History and Skills Table Grids */}
            <Grid item xs={12}>
              <Typography className={classes.labelStyle}>
                Work History
              </Typography>
              <Table
                // stickyHeader
                className={classes.table}
                aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    {workColumns.map((column) => (
                      <TableCell
                        // key={column.label}
                        className={classes.tableHeadFont}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {onboardingData?.workHistory?.length > 0 ? (
                  <TableBody>
                    {onboardingData.workHistory.map((row) => (
                      <TableRow
                        key={row.companyName}
                        className={classes.tableRowColor}>
                        {/* <TableCell component='th' scope='row'>
                        {row.companyName}{' '}
                      </TableCell> */}
                        <TableCell align='left'>{row.companyName}</TableCell>
                        <TableCell align='left'>{row.jobTitle}</TableCell>
                        <TableCell align='left'>
                          {moment(row.startDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell align='left'>
                          {moment(row.endDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell align='left'>
                          {row.responsibilities}
                        </TableCell>
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
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider className={classes.dividerColor} />
            </Grid>

            {/* Family History Table Grids */}
            <Grid item xs={12}>
              <Typography className={classes.labelStyle}>
                Family History
              </Typography>
              <Table
                // stickyHeader
                className={classes.table}
                aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    {familyInfoColumns.map((column) => (
                      <TableCell
                        // key={column.label}
                        className={classes.tableHeadFont}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {onboardingData?.familyInfo?.length > 0 ? (
                  <TableBody>
                    {onboardingData.familyInfo.map((row) => (
                      <TableRow
                        key={row.familyMemberName}
                        className={classes.tableRowColor}>
                        {/* <TableCell component='th' scope='row'>
                        {row.companyName}{' '}
                      </TableCell> */}
                        <TableCell align='left'>
                          {row.familyMemberName}
                        </TableCell>
                        <TableCell align='left'>{row.relationship}</TableCell>
                        <TableCell align='left'>
                          {moment(row.familyMemeberDob).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell align='left'>{row.bloodGroup}</TableCell>
                        <TableCell align='left'>{row.occupation}</TableCell>
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
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider className={classes.dividerColor} />
            </Grid>

            {/* Academic Info Table Grid */}
            <Grid item xs={12}>
              <Typography className={classes.labelStyle}>
                Academic Information
              </Typography>
              <Table
                stickyHeader
                className={classes.table}
                aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    {academicInfoColumns.map((column) => (
                      <TableCell
                        className={classes.tableHeadFont}
                        key={column.label}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: 'white',
                        }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {onboardingData.academicInfo.map((row) => (
                    <TableRow
                      key={row.qualification}
                      className={classes.tableRowColor}
                      style={{ marginBottom: '10px' }}>
                      <TableCell component='th' scope='row'>
                        {row.qualification}{' '}
                      </TableCell>
                      {/* <TableCell align='left'>{row.qualifiction}</TableCell>   */}
                      <TableCell align='left'>
                        {row.schoolCollegeName}
                      </TableCell>
                      <TableCell align='left'>{row.specialization}</TableCell>
                      <TableCell align='left'>{row.yearOfPassing}</TableCell>
                      <TableCell align='left'>{row.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider className={classes.dividerColor} />
            </Grid>

            {/* Documents Table Grid */}
            <Grid item xs={12}>
              <Typography className={classes.labelStyle}>Documents</Typography>
              <Grid container xs={12}>
                {onboardingData.documents.map((doc) => (
                  <>
                    <Grid xs={12} item className={classes.documentContainer}>
                      <OPKeyValue
                        color={'secondary'}
                        label={doc.label}
                        value={
                          doc.s3FileKeys.length > 0 ? (
                            <>
                              <Grid
                                container
                                direction='column'
                                justify='flex-start'
                                alignItems='flex-start'
                                component={Paper}
                                variant='outlined'
                                style={{ padding: '0.5rem 1rem' }}>
                                {console.log(doc.s3FileKeys.length)}
                                {doc.s3FileKeys.map((file, count) => (
                                  <Link
                                    style={{ color: '#0D3C61' }}
                                    onClick={() => downloadFile(file)}>
                                    <b>
                                      {/* {console.log(count, file, file.length)} */}
                                      {doc.s3FileKeys.length === 0 ? (
                                        <b>Not uploaded by User</b>
                                      ) : (
                                        `${doc.label} - ${count + 1}`
                                      )}
                                    </b>
                                  </Link>
                                ))}
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid
                                container
                                direction='column'
                                justify='flex-start'
                                alignItems='flex-start'
                                component={Paper}
                                variant='outlined'
                                style={{ padding: '0.5rem 1rem' }}>
                                <Link
                                  style={{ color: '#0D3C61' }}
                                  underline='none'>
                                  <b>Not Uploaded By User</b>
                                </Link>
                              </Grid>
                            </>
                          )
                        }
                      />
                      <Box mt={1}>
                        <Divider />
                      </Box>
                    </Grid>
                  </>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </ThemeProvider>
  );
}
