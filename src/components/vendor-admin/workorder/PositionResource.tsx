import React, { useContext } from 'react';
import {
  Grid,
  makeStyles,
  TextField,
  Paper,
  Theme,
  Typography,
  Divider,
  IconButton,
  Button,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import OPKeyValue from 'src/components/common/OPKeyValue';
import { GetApp as GetAppIcon, PlayForWorkTwoTone } from '@material-ui/icons';
import moment from 'moment';
import CompensationTable from './tables/CompensationTable';
import { WorkOrderDataType } from 'src/types/project-manager/workorder';
import MGRWorkorderContext from 'src/contexts/project-manager/workorder/mgr-workorder-context';
import { render } from 'react-dom';
import VAWorkorderContext from 'src/contexts/vendor-admin/workorder/va-workorder-context';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  font: {
    fontWeight: 'bolder',
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  paperPadding: {
    padding: theme.spacing(0, 4, 4, 4),
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
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
    textAlign: 'right',
  },
  textBackground: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
  },
  boldFont: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const PositionResource = ({
  workorder,
  version,
}: {
  workorder: WorkOrderDataType;
  version?: boolean;
}) => {
  const { downloadFile, handleVersionChange, selectedVersion } = useContext(
    VAWorkorderContext,
  );

  const classes = useStyles();

  type ResourceDataType = {
    name: string;
    value: string | number;
  };

  type WorkAssignmentDataType = {
    name: string;
    type?: string;
    value: string | number;
  };

  type EstimatedWorkOrderAmountDataType = {
    name: string;
    value: string;
  };

  const workAssignment: WorkAssignmentDataType[] = [
    { name: 'Demand ID#', value: workorder.data.posId },
    { name: 'Position Title', value: workorder.data.posTitle },
    { name: 'Position reports to', value: workorder.data.posReportsTo },
    { name: 'Job Type', value: workorder.data.jobType },
    { name: 'Rate Card', value: workorder.data.rateType },
    // { name: 'Rate Type', value: workorder.data.rateType },
    // { name: 'Contracted Fee', value: '-' },
    { name: 'Currency', value: workorder.data.currency },
  ];

  const estimatedWorkOrderAmount: EstimatedWorkOrderAmountDataType[] = [
    {
      name: 'Start Date',
      value: moment(workorder.data.startDate).format('DD MMM YYYY'),
    },
    {
      name: 'End Date',
      value: moment(workorder.data.endDate).format('DD MMM YYYY'),
    },
    // {
    //   name: 'Estimated Total Spend',
    //   value: workorder.data.estimatedTotalSpend,
    // },
    { name: 'Duration (Months)', value: workorder.data.duration },
    // {
    //   name: 'Est. Remaining Budget',
    //   value: workorder.data.estimatedRemainingBudget,
    // },
    // {
    //   name: 'Allow Expense Entry',
    //   value: workorder.data.allowExpenses ? 'Yes' : 'No',
    // },
    // { name: 'Estimated Expenses', value: '' },
    // { name: 'Estimated Labour', value: '' },
    // { name: 'Travel & Expences Expected', value: '' },
    // { name: 'Travel time Reimburasable', value: '' },
    // { name: 'Travel required to', value: '' },
    // { name: 'Misc. Terms & conditions', value: '' },
  ];

  const renderMenuItem = () => {
    const menuItems: any[] = [];
    // @ts-ignore
    for (var i = 0; i < workorder?.data?.changes?.length + 1; i++) {
      menuItems.push(<MenuItem value={i}>{i}</MenuItem>);
    }
    return <>{menuItems}</>;
  };

  const desc = workorder.data.assignmentDesc;

  const resource: ResourceDataType[] = [
    { name: 'Requested resource', value: workorder.data.requestedResource },
    { name: 'ID Number#', value: workorder.data.id },
    { name: 'Official Email', value: workorder.data.officialEmail },
  ];

  return (
    <>
      <Grid container direction='column' spacing={4}>
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Resource
            </Typography>
          </Grid>
          <Grid item container direction='row'>
            {/* {resource.map((data) => {
              return (
                <Grid item lg={4} xs={12}>
                  <OPKeyValue label={data.name} value={data.value} />
                </Grid>
              );
            })} */}
            <Grid item lg={4} xs={12}>
              <OPKeyValue label='ID Number#' value={workorder.data.id} />
            </Grid>
            <Grid item lg={4} xs={12}>
              <OPKeyValue
                label='Requested resource'
                value={workorder.data.requestedResource}
              />
            </Grid>
            <Grid item lg={4} xs={12}>
              <OPKeyValue
                label='Official Email'
                value={workorder.data.officialEmail}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid>
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Work Assignment
            </Typography>
          </Grid>
          <Grid item container direction='row'>
            <Grid item lg={12} container direction='row' spacing={2}>
              {workAssignment.map((data) => {
                return (
                  <Grid item lg={6} xs={12}>
                    <OPKeyValue label={data.name} value={data.value} />
                  </Grid>
                );
              })}
            </Grid>
            {/* <Grid item lg={4}>
              <Grid item xs={12} lg={12}>
                <Paper
                  variant='elevation'
                  elevation={0}
                  className={classes.paperField}>
                  <Typography variant='body2' color='inherit' align='center'>
                    Assignment Description
                  </Typography>
                </Paper>
                <TextField
                  margin='dense'
                  size='small'
                  fullWidth
                  variant='outlined'
                  multiline
                  rows='4'
                  value={desc}
                  InputProps={{
                    classes: {
                      root: classes.inputRootDesc,
                      disabled: classes.disabled,
                    },
                  }}
                  disabled
                />
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid>
        {/* <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Compensation Rates
            </Typography>
          </Grid>
          <Grid item container direction='row' spacing={2}>
            <Grid item lg={12} xs={12}>
              <CompensationTable data={workorder.data} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid> */}
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Estimated Work Order Amount
            </Typography>
          </Grid>
          <Grid item container direction='row' spacing={2} xs={12}>
            {estimatedWorkOrderAmount.map((data) => {
              return (
                <Grid item lg={6} xs={12}>
                  <OPKeyValue
                    label={data.name}
                    value={data.value === '' ? '---' : data.value}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        {/* <Grid item>
          <Divider className={classes.dividerColor} />
        </Grid> */}
        {/* <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography
              gutterBottom
              variant='h6'
              color='primary'
              className={classes.font}>
              Document Attachments
            </Typography>
          </Grid>
          <Grid item container direction='row' spacing={2}>
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<GetAppIcon />}
                onClick={() => downloadFile(workorder.data.profile)}>
                CV
              </Button>
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </>
  );
};

export default PositionResource;
