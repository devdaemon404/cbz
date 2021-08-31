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
  Checkbox,
  Button,
  Link,
} from '@material-ui/core';
import moment from 'moment';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import OnboardingContext from '../../../contexts/employee/onboardingContext';
import { Theme } from '@material-ui/core/styles';
import { DocumentDataType } from '../../../types/employee/onboarding';

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
    padding: theme.spacing(5, 10),
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
}));

// Column values for work table
interface WorkColumn {
  label: string;
  minWidth?: number;
  align?: 'left';
}

const workColumns: WorkColumn[] = [
  { label: 'Company', minWidth: 0 },
  { label: 'Job Title', minWidth: 0 },
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

interface FamilyInfoColumn {
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

const familyInfoColumns: FamilyInfoColumn[] = [
  { label: 'Family Member Name', minWidth: 0 },
  { label: 'Relationship', minWidth: 0 },
  { label: 'Occupation', minWidth: 0 },
  { label: 'Date of Birth', minWidth: 0 },
  { label: 'Blood Group', minWidth: 0 },
];

export default function OnboardingSubmission({ onUploadClick }) {
  // context
  const {
    skills,
    workHistory,
    academicInfo,
    contactInfo,
    familyInfo,
    documents,
  } = useContext(OnboardingContext);

  const { expert, intermediate, beginner } = skills;

  const contactData = [
    { label: 'Full Name', key: contactInfo.fullName },
    { label: 'Email', key: contactInfo.emailAddress },
    { label: 'Permanent Address', key: contactInfo.permanentAddress },
    { label: 'Phone Number', key: contactInfo.phoneNumber },
  ];

  interface RequiredFile {
    name: string;
    uploaded: boolean;
  }

  // Function to reverse string
  function reverseString(str) {
    return str.split('-').reverse().join('-');
  }

  const createCheckbox = (file: DocumentDataType) => {
    return (
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'>
        <Grid item xs={11}>
          <Checkbox checked={file.files.length !== 0} disabled />
          {file.label}
        </Grid>
        <Grid item xs={1}>
          {file.files.length !== 0 ? (
            <Fragment></Fragment>
          ) : (
            <Link
              style={{
                color: '#0D3C61',
                cursor: 'pointer',
              }}>
              <CloudUploadIcon onClick={onUploadClick} />
            </Link>
          )}
        </Grid>
      </Grid>
    );
  };

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='flex-start'
          spacing={4}>
          {/*contact Info Grid  */}
          <Grid item xs={12}>
            <Typography className={classes.labelStyle}>
              Contact Information
            </Typography>
          </Grid>

          <Grid container direction='row' justify='center' alignItems='center'>
            {contactData.map((gridData) => (
              <Grid
                className={classes.margin}
                container
                direction='row'
                justify='center'
                alignItems='flex-start'
                item
                spacing={2}
                xs={6}>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <b>{gridData.label}</b>
                </Grid>
                <Grid item xs={6}>
                  {gridData.key}
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* Divider */}
          <Grid item xs={12}>
            <Divider className={classes.dividerColor} />
          </Grid>

          {/* Work History and Skills Table Grids */}
          <Grid item xs={12}>
            <Typography className={classes.labelStyle}>Work History</Typography>
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
              {workHistory.length > 0 ? (
                <TableBody>
                  {workHistory.map((row) => (
                    <TableRow
                      key={row.companyName}
                      className={classes.tableRowColor}>
                      {/* <TableCell component='th' scope='row'>
                        {row.companyName}{' '}
                      </TableCell> */}
                      <TableCell align='left'>{row.companyName}</TableCell>
                      <TableCell align='left'>{row.jobTitle}</TableCell>
                      <TableCell align='left'>
                        {/* {reverseString(row.startDate)} */}
                        {moment(row.startDate).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align='left'>
                        {/* {reverseString(row.endDate)} */}
                        {moment(row.endDate).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align='left'>{row.responsibilities}</TableCell>
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

          {/* <Grid item xs={6}>
            <Typography className={classes.labelStyle}>Skills</Typography>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  {skillsColumns.map((column) => (
                    <TableCell
                      className={classes.tableHeadFont}
                      key={column.label}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.tableRowColor}>
                  <TableCell component='th' scope='row'>
                    {expert.map((skill) => (
                      <Typography>{skill}</Typography>
                    ))}
                  </TableCell>
                  <TableCell align='left'>
                    {intermediate.map((skill) => (
                      <Typography>{skill}</Typography>
                    ))}
                  </TableCell>
                  <TableCell align='left'>
                    {beginner.map((skill) => (
                      <Typography>{skill}</Typography>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid> */}

          {/* Divider */}
          <Grid item xs={12}>
            <Divider className={classes.dividerColor} />
          </Grid>

          {/* Academic Info Table Grid */}
          <Grid item xs={12}>
            <Typography className={classes.labelStyle}>
              Family Information
            </Typography>
            <Table
              stickyHeader
              className={classes.table}
              aria-label='simple table'>
              <TableHead>
                <TableRow>
                  {familyInfoColumns.map((column) => (
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
                {familyInfo.map((row) => {
                  // if (
                  //   row.familyMemberName === '' &&
                  //   row.relationship === '' &&
                  //   row.occupation === '' &&
                  //   row.familyMemberDob === '' &&
                  //   row.bloodGroup === ''
                  // )
                  //   return null;
                  return (
                    <TableRow
                      key={row.familyMemberName}
                      className={classes.tableRowColor}
                      style={{ marginBottom: '10px' }}>
                      <TableCell component='th' scope='row'>
                        {row.familyMemberName}{' '}
                      </TableCell>
                      {/* <TableCell align='left'>{row.qualifiction}</TableCell>   */}
                      <TableCell align='left'>{row.relationship}</TableCell>
                      <TableCell align='left'>{row.occupation}</TableCell>
                      <TableCell align='left'>{row.familyMemberDob}</TableCell>
                      <TableCell align='left'>{row.bloodGroup}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
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
                {academicInfo.map((row) => (
                  <TableRow
                    key={row.qualification}
                    className={classes.tableRowColor}
                    style={{ marginBottom: '10px' }}>
                    <TableCell component='th' scope='row'>
                      {row.qualification}{' '}
                    </TableCell>
                    {/* <TableCell align='left'>{row.qualifiction}</TableCell>   */}
                    <TableCell align='left'>{row.schoolCollegeName}</TableCell>
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
              <Grid item xs={6}>
                {documents.slice(0, documents.length / 2).map(createCheckbox)}
              </Grid>

              <Grid item xs={6}>
                {documents.slice(documents.length / 2).map(createCheckbox)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
