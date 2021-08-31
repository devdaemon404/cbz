import React, { useContext } from 'react';
import PMDemandContext from '../../contexts/project-manager/demand/pm-demand-context';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';

import {
  Grid,
  Typography,
  TextField,
  makeStyles,
  createStyles,
  Button,
  Theme,
  CircularProgress,
} from '@material-ui/core';

import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridPadding: {
      padding: theme.spacing(3),
    },
    compulsory: {
      color: theme.palette.error.main,
    },
    topMargin: {
      marginTop: theme.spacing(1),
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

const SystemAccess = ({ title }) => {
  const classes = useStyles();

  const {
    demandInfo,
    handleDemandInfoChange,
    fileName,
    handleFileOnChange,
    loading,
    success,
    validation,
  } = useContext(PMDemandContext);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  return (
    <div>
      <Grid
        container
        direction='column'
        spacing={4}
        className={classes.gridPadding}>
        <Grid item xs={12}>
          <Typography>
            Job Description
            <span className={classes.compulsory}>*</span>
          </Typography>
          <TextField
            error={validation.job_description.error}
            multiline
            rows={5}
            margin='dense'
            fullWidth
            size='small'
            name='job_description'
            variant='outlined'
            value={demandInfo.job_description}
            placeholder='Enter the Job Description in Detail'
            onChange={(e) => {
              handleDemandInfoChange(e);
            }}
            className={classes.topMargin}
            helperText={validation.job_description.helperText}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Attachments
            <span className={classes.compulsory}>*</span>
          </Typography>

          <div className={classes.wrapper}>
            <label htmlFor='upload-photo'>
              <input
                style={{ display: 'none' }}
                id='upload-photo'
                name='upload-photo'
                type='file'
                onChange={(e) => {
                  handleFileOnChange(e);
                }}
              />
              {title === 'Edit Demand' ? (
                <Typography variant='subtitle2' color='initial'>
                  {demandInfo.jd_file_name
                    ? demandInfo.jd_file_name
                    : 'No files uploaded'}
                </Typography>
              ) : (
                <Button
                  color='secondary'
                  variant='contained'
                  component='span'
                  startIcon={<CloudUploadIcon />}
                  className={buttonClassname}
                  disabled={loading}
                  size='small'>
                  {fileName}
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              )}
            </label>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SystemAccess;
