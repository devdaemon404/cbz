import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Paper,
  Theme,
  Typography,
  MenuItem,
  Divider,
  Box,
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import classNames from 'classnames';
import PMDemandContext from 'src/contexts/project-manager/demand/pm-demand-context';
import { useRouter } from 'next/router';
import OPLoader from 'src/components/common/OPLoader';
import { CreateDemandRequestType } from 'src/types/response-types/project-manager/demand';
import OPKeyValue from '../common/OPKeyValue';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(3),
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  font: {
    fontWeight: 'bolder',
    paddingTop: 10,
    margin: theme.spacing(2, 0, 2, 0),
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  paperPadding: {
    // padding: theme.spacing(0, 4, 4, 4),
    // flexGrow: 1,
    padding: theme.spacing(0, 2),
    height: 430,
  },
  jobDescPaperPadding: {
    // padding: theme.spacing(0, 4, 4, 4),
    padding: theme.spacing(0, 2, 1),

    // flexGrow: 1,
  },
  paperPadding2: {
    // padding: theme.spacing(2, 4, 4, 4),
    // flexGrow: 1,
    // height: 400,
  },
  inputRootDesc: {
    '&$disabled': {
      color: '#222',
    },
    backgroundColor: 'white',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  headingMargin: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  disabled: {},
  buttonMargin: {
    marginTop: theme.spacing(3),
  },
  paperField: {
    padding: '5px 10px',
  },

  labeler: {
    fontWeight: 'bold',
    padding: 5,
    margin: '0px auto',
  },
}));

const SummaryStep = () => {
  const classes = useStyles();

  const { demandInfo } = useContext(PMDemandContext);

  const {
    name,
    quantity,
    expense,
    profile_name,
    startDate,
    duration,
    hours_per_week,
    job_description,
  } = demandInfo;

  const {
    primary_skills,
    secondary_skills,
    relevant_experience,
    total_experience,
  } = demandInfo.skills;

  type DemandInformationType = {
    name: string;
    value: string | number;
  };

  type SkillInformationType = {
    name: string;
    value: string | number | string[];
  };

  type AdditionalInformationType = {
    name: string;
    value: string | boolean | number;
  };

  const demandInformation: DemandInformationType[] = [
    { name: 'Full Name', value: name },
    // { name: 'Required Profile Name', value: profile_name },
    { name: 'QTY', value: quantity },
    { name: 'Desired Start Date', value: startDate },
    { name: 'Duration', value: duration },
    { name: 'Hrs/Wk', value: hours_per_week },
    // { name: 'Estimated Expense', value: expense },
  ];

  const skills: SkillInformationType[] = [
    { name: 'Primary Skills', value: primary_skills.join(', ') },
    { name: 'Secondary Skills', value: secondary_skills.join(', ') },
    { name: 'Relevant Experience', value: relevant_experience },
    { name: 'Total Experience', value: total_experience },
  ];

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.paperPadding2}>
        <Grid item xs={6}>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              color='primary'
              className={classes.font}>
              Demand Information
            </Typography>

            <Grid
              container
              item
              spacing={2}
              direction='row'
              justify='flex-end'
              alignItems='center'
              xs={12}>
              {demandInformation.map((demand) => {
                const { name, value } = demand;
                return (
                  <Grid container item direction='row' xs={12}>
                    <Grid item lg={6} xs={6}>
                      {/* <Paper
                        variant='outlined'
                        elevation={0}
                        className={classes.paperField}> */}
                      <Typography
                        variant='body2'
                        color='inherit'
                        className={classes.labeler}>
                        {name}
                      </Typography>
                      {/* </Paper> */}
                    </Grid>
                    <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                      <Typography
                        variant='body2'
                        color='inherit'
                        align='left'
                        style={{ marginLeft: 12 }}>
                        {value || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper variant='outlined' className={classes.paperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              color='primary'
              className={classes.font}>
              Skills
            </Typography>
            <Grid
              item
              container
              direction='row'
              xs={12}
              spacing={2}
              justify='flex-start'
              alignItems='center'>
              <Grid container direction='row' item xs={12} spacing={2}>
                {skills.map((skill) => {
                  const { name, value } = skill;
                  return (
                    <Grid container item xs={12} spacing={1}>
                      <Grid item xs={6}>
                        {/* <Paper
                          variant='outlined'
                          elevation={0}
                          className={classes.paperField}> */}
                        <Typography
                          variant='body2'
                          color='inherit'
                          className={classes.labeler}>
                          {name}
                        </Typography>
                        {/* </Paper> */}
                      </Grid>
                      <Grid item xs={6} classes={{ item: classes.alignCenter }}>
                        <Typography
                          variant='body2'
                          color='inherit'
                          align='left'
                          style={{ marginLeft: 12 }}>
                          {value || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={3}
            variant='outlined'
            className={classes.jobDescPaperPadding}>
            <Typography
              variant='h6'
              gutterBottom
              className={classes.font}
              color='primary'>
              Job Description
            </Typography>
            <Grid container spacing={2} direction='row'>
              <Grid
                direction='row'
                spacing={2}
                item
                xs={12}
                justify='flex-start'
                alignItems='center'>
                <Typography>
                  {/* <textarea
                  disabled
                  style={{
                    margin: 5,
                    padding: 10,
                    width: '100%',
                    minHeight: '300px',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    border: 'none',
                    backgroundColor: 'white',
                  }}> */}
                  {job_description}
                  {/* </textarea> */}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>

    // <div className={classes.root}>
    //   <Grid container spacing={2}>
    //     <Grid item xs={12}>
    //       <Paper className={classes.paper} variant='outlined'>
    //         <Box mb={2}>
    //           <Typography color='primary' variant='h6'>
    //             Demand Information
    //           </Typography>
    //           <Divider style={{ backgroundColor: '#0D3C61' }} />
    //         </Box>
    //         <Grid container spacing={1}>
    //           {demandInformation.map((data) => (
    //             <Grid item xs={6}>
    //               <OPKeyValue
    //                 label={data.name}
    //                 value={data.value ? data.value : '-'}
    //               />
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </Paper>
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Paper className={classes.paper} variant='outlined'>
    //         <Box mb={2}>
    //           <Typography color='primary' variant='h6'>
    //             Skills and Experience
    //           </Typography>
    //           <Divider style={{ backgroundColor: '#0D3C61' }} />
    //         </Box>
    //         <Grid container spacing={2}>
    //           {skills.map((data) => (
    //             <Grid item xs={6}>
    //               <OPKeyValue
    //                 label={data.name}
    //                 value={data.value ? data.value : '-'}
    //               />
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </Paper>
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Paper className={classes.paper} variant='outlined'>
    //         <Box mb={2}>
    //           <Typography color='primary' variant='h6'>
    //             Additional Information
    //           </Typography>
    //           <Divider style={{ backgroundColor: '#0D3C61' }} />
    //         </Box>
    //         <Grid container spacing={2}>
    //           {additionalInfo.map((data) => (
    //             <Grid item xs={6}>
    //               <OPKeyValue
    //                 label={data.name}
    //                 value={data.value ? data.value : '-'}
    //               />
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </Paper>
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Paper className={classes.paper} variant='outlined'>
    //         <Box mb={2}>
    //           <Typography color='primary' variant='h6'>
    //             Job Information
    //           </Typography>
    //           <Divider style={{ backgroundColor: '#0D3C61' }} />
    //         </Box>
    //         <Grid container spacing={2}>
    //           <Grid item xs={6}>
    //             <OPKeyValue
    //               label={'JOB DESCRIPTION'}
    //               value={job_description ? job_description : '-'}
    //             />
    //           </Grid>
    //         </Grid>
    //       </Paper>
    //     </Grid>
    //   </Grid>
  );
};

export default SummaryStep;

// import {
//   Button,
//   Grid,
//   makeStyles,
//   TextField,
//   Paper,
//   Theme,
//   Typography,
//   MenuItem,
//   Divider,
// } from '@material-ui/core';
// import React, { Fragment, useContext, useEffect, useState } from 'react';
// import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';

// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   margin: {
//     marginTop: theme.spacing(2),
//   },
//   font: {
//     fontWeight: 'bolder',
//     paddingTop: 10,
//     margin: theme.spacing(2, 0, 2, 0),
//   },
//   dividerColor: {
//     backgroundColor: theme.palette.primary.main,
//   },
//   paperPadding: {
//     padding: theme.spacing(0, 4, 4, 4),
//     flexGrow: 1,
//     height: 300,
//   },
//   jobDescPaperPadding: {
//     padding: theme.spacing(0, 4, 4, 4),
//     flexGrow: 1,
//   },
//   paperPadding2: {
//     padding: theme.spacing(2, 4, 4, 4),
//     flexGrow: 1,
//     height: 400,
//   },
//   inputRootDesc: {
//     '&$disabled': {
//       color: '#222',
//     },
//     backgroundColor: 'white',
//   },
//   alignCenter: {
//     alignSelf: 'center',
//   },
//   headingMargin: {
//     margin: theme.spacing(2, 0, 2, 0),
//   },
//   disabled: {},
//   buttonMargin: {
//     marginTop: theme.spacing(3),
//   },
//   paperField: {
//     padding: '5px 10px',
//   },

//   labeler: {
//     fontWeight: 'bold',
//     padding: 5,
//     margin: '0px auto',
//   },
// }));

// const DemandsSummaryTab = ({ demandData }) => {
//   const classes = useStyles();
//   const [workTime, setWorkTime] = React.useState('EUR');
//   // @ts-ignore

//   // @ts-ignore
//   const {
//     name,
//     quantity,
//     endDate,
//     profile_name,
//     startDate,
//     duration,
//     hours_per_week,
//     // @ts-ignore
//     user_first_name,
//     // @ts-ignore
//     user_last_name,
//     job_description,
//     // @ts-ignore
//     status,
//     // @ts-ignore
//     request_id,
//     primary_skills,
//     secondary_skills,
//     relevant_experience,
//     additional_skills,
//     total_experience,
//     email_enabled,
//     team_member_info_access,

//     location,
//     employment_type,
//     shift,
//     background_check_required,
//   } = demandData;

//   type DemandInformationType = {
//     name: string;
//     value: string | number;
//   };

//   type SkillInformationType = {
//     name: string;
//     value: string | number | string[];
//   };

//   type AdditionalInformationType = {
//     name: string;
//     value: string | boolean | number;
//   };

//   const demandInformation: DemandInformationType[] = [
//     { name: 'Full Name', value: name },
//     { name: 'Required Profile Name', value: profile_name },
//     { name: 'QTY', value: quantity },
//     {
//       name: 'Desired Start Date',
//       value: new Date(startDate).toLocaleDateString(),
//     },
//     { name: 'Duration', value: duration },
//     { name: 'Hrs/Wk', value: hours_per_week },
//     { name: 'Desired End Date', value: new Date(endDate).toLocaleDateString() },
//   ];

//   const skills: SkillInformationType[] = [
//     { name: 'Primary Skills', value: primary_skills.join(', ') },
//     { name: 'Secondary Skills', value: secondary_skills.join(', ') },
//     { name: 'Relevant Experience', value: relevant_experience },
//     { name: 'Total Experience', value: total_experience },
//     { name: 'Additional Skills', value: additional_skills.join(', ') },
//   ];

//   const additionalInfo: AdditionalInformationType[] = [
//     // { name: 'Email Enabled', value: email_enabled === 'true' ? 'Yes' : 'No' },

//     { name: 'Request Id', value: request_id },
//     { name: 'Status', value: status },
//     { name: 'Location', value: location },
//     { name: 'Shift', value: shift },
//     {
//       name: 'Employment Type',
//       value: employment_type === 'PART_TIME' ? 'Part Time' : 'Full Time',
//     },
//     {
//       name: 'Background Check Required',
//       value:
//         background_check_required === 'true' ? 'Mandatory' : 'Non-Mandatory',
//     },
//   ];

//   const handleWorkTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setWorkTime(event.target.value);
//   };
//   return (
//     <div>
//       <Grid container spacing={3} className={classes.paperPadding2}>
//         <Grid item xs={6}>
//           <Paper variant='outlined' className={classes.paperPadding}>
//             <Typography
//               variant='h6'
//               gutterBottom
//               color='primary'
//               className={classes.font}>
//               Demand Information
//             </Typography>

//             <Grid
//               container
//               item
//               spacing={2}
//               direction='row'
//               justify='flex-start'
//               alignItems='center'
//               xs={12}>
//               {demandInformation.map((demand) => {
//                 const { name, value } = demand;
//                 return (
//                   <Grid container item direction='row' xs={6}>
//                     <Grid item lg={6} xs={6}>
//                       {/* <Paper
//                         variant='outlined'
//                         elevation={0}
//                         className={classes.paperField}> */}
//                       <Typography
//                         variant='body2'
//                         color='inherit'
//                         className={classes.labeler}>
//                         {name}
//                       </Typography>
//                       {/* </Paper> */}
//                     </Grid>
//                     <Grid item xs={6} classes={{ item: classes.alignCenter }}>
//                       <Typography
//                         variant='body2'
//                         color='inherit'
//                         align='left'
//                         style={{ marginLeft: 12 }}>
//                         {value || 'N/A'}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 );
//               })}
//             </Grid>
//           </Paper>
//         </Grid>

//         <Grid item xs={6}>
//           <Paper variant='outlined' className={classes.paperPadding}>
//             <Typography
//               variant='h6'
//               gutterBottom
//               color='primary'
//               className={classes.font}>
//               Skills
//             </Typography>
//             <Grid
//               item
//               container
//               direction='row'
//               xs={12}
//               spacing={2}
//               justify='flex-start'
//               alignItems='center'>
//               <Grid container direction='row' item xs={12} spacing={2}>
//                 {skills.map((skill) => {
//                   const { name, value } = skill;
//                   return (
//                     <Grid container item xs={6} spacing={1}>
//                       <Grid item xs={6}>
//                         {/* <Paper
//                           variant='outlined'
//                           elevation={0}
//                           className={classes.paperField}> */}
//                         <Typography
//                           variant='body2'
//                           color='inherit'
//                           className={classes.labeler}>
//                           {name}
//                         </Typography>
//                         {/* </Paper> */}
//                       </Grid>
//                       <Grid item xs={6} classes={{ item: classes.alignCenter }}>
//                         <Typography
//                           variant='body2'
//                           color='inherit'
//                           align='left'
//                           style={{ marginLeft: 12 }}>
//                           {value || 'N/A'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   );
//                 })}
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>

//         <Grid item xs={12}>
//           <Paper
//             elevation={3}
//             variant='outlined'
//             className={classes.jobDescPaperPadding}>
//             <Typography
//               variant='h6'
//               gutterBottom
//               className={classes.font}
//               color='primary'>
//               Job Description
//             </Typography>
//             <Grid container spacing={2} direction='row'>
//               <Grid
//                 direction='row'
//                 spacing={2}
//                 item
//                 xs={12}
//                 justify='flex-start'
//                 alignItems='center'>
//                 <Typography>
//                   {/* <textarea
//                   disabled
//                   style={{
//                     margin: 5,
//                     padding: 10,
//                     width: '100%',
//                     minHeight: '300px',
//                     fontFamily: 'inherit',
//                     fontSize: 'inherit',
//                     border: 'none',
//                     backgroundColor: 'white',
//                   }}> */}
//                   {job_description}
//                   {/* </textarea> */}
//                 </Typography>
//               </Grid>
//             </Grid>
//             <Typography
//               variant='h6'
//               gutterBottom
//               className={classes.font}
//               color='primary'>
//               File
//             </Typography>
//             <Grid container spacing={2} direction='row'>
//               <Grid
//                 direction='row'
//                 spacing={2}
//                 item
//                 xs={12}
//                 justify='flex-start'
//                 alignItems='center'>
//                 <Typography>
//                   {demandData.file ? demandData.file.name : 'Not uploaded'}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>

//         <Grid item xs={12}>
//           <Paper
//             elevation={3}
//             variant='outlined'
//             className={classes.paperPadding}>
//             <Typography
//               variant='h6'
//               gutterBottom
//               className={classes.font}
//               color='primary'>
//               Additional Information
//             </Typography>
//             <Grid
//               item
//               container
//               direction='row'
//               xs={12}
//               spacing={2}
//               justify='flex-start'
//               alignItems='center'>
//               <Grid container direction='row' item xs={12} spacing={2}>
//                 {additionalInfo.map((addInfo) => {
//                   const { name, value } = addInfo;
//                   return (
//                     <Grid container item direction='row' xs={6}>
//                       <Grid item lg={6} xs={6}>
//                         {/* <Paper
//                           variant='outlined'
//                           elevation={0}
//                           className={classes.paperField}> */}
//                         <Typography
//                           variant='body2'
//                           color='inherit'
//                           className={classes.labeler}>
//                           {name}
//                         </Typography>
//                         {/* </Paper> */}
//                       </Grid>
//                       <Grid item xs={6} classes={{ item: classes.alignCenter }}>
//                         <Typography
//                           variant='body2'
//                           color='inherit'
//                           align='left'
//                           style={{ marginLeft: 12 }}>
//                           {value || 'N/A'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   );
//                 })}
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default DemandsSummaryTab;
