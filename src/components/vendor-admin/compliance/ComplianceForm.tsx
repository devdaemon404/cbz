import React, { Fragment, useContext, useRef, useState } from 'react';
import moment from 'moment';
// React Components Imports
import {
  Grid,
  Paper,
  Theme,
  Button,
  makeStyles,
  Typography,
  withStyles,
  IconButton,
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { DropzoneArea as DropzoneAreaBase } from 'material-ui-dropzone';
import OPLoader from 'src/components/common/OPLoader';
import VAComplianceContext from 'src/contexts/vendor-admin/compliance/va-cc-context';

const useStyles = makeStyles((theme: Theme) => ({
  paperPadding: {
    padding: theme.spacing(2),
    height: '80vh',
  },
  compulsory: {
    color: 'red',
  },
  formControl: {
    minWidth: 250,
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
}));

const ComplianceForm = () => {
  const classes = useStyles();

  const {
    file,
    isLoading,
    handleDateChange,
    monthYear,
    handleDocumentTypeChange,
    currentDocumentType,
    submitDocumentUpload,
    documentTypes,
    handleFileUpload,
    clearForm,
  } = useContext(VAComplianceContext);

  return (
    <Fragment>
      <OPLoader isLoading={isLoading} />
      <Paper className={classes.paperPadding}>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <Typography
              variant='h6'
              color='initial'
              style={{ marginBottom: '1rem' }}>
              Select a month
              <span className={classes.compulsory}> *</span>
            </Typography>
            <Grid container direction='row' alignItems='center' spacing={1}>
              <Grid item>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    variant='inline'
                    openTo='year'
                    size='small'
                    views={['year', 'month']}
                    inputVariant='outlined'
                    value={monthYear.date}
                    onChange={handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Typography variant='h6' color='initial'>
              Document Type
              <span className={classes.compulsory}> *</span>
            </Typography>
            <p
              style={{
                margin: '0 0 1rem 0',
                fontSize: '0.9rem',
                color: 'darkgray',
                fontWeight: 'bold',
              }}>
              If you want to upload more than one file; Upload in ZIP format.
            </p>
            <FormControl
              variant='outlined'
              className={classes.formControl}
              size='small'>
              <Select
                value={currentDocumentType}
                onChange={(e) => handleDocumentTypeChange(e.target.value)}>
                <MenuItem value='SELECT'>
                  <i>Select</i>
                </MenuItem>
                {documentTypes.map((doc) => {
                  return <MenuItem value={doc}>{doc}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Typography
              variant='h6'
              color='initial'
              style={{ margin: '1rem 0 0 0' }}>
              Upload Document
            </Typography>
            <DropzoneAreaBase
              filesLimit={1}
              initialFiles={[]}
              showPreviewsInDropzone={false}
              onChange={(files) => handleFileUpload(files)}
            />
            {file.map((f) => {
              return (
                <Chip
                  style={{ marginTop: '0.5rem' }}
                  label={f.name}
                  onDelete={() => handleFileUpload([])}
                  color='secondary'
                />
              );
            })}
          </Grid>

          <Grid item>
            <Button
              onClick={submitDocumentUpload}
              variant='contained'
              color='primary'>
              Upload
            </Button>
            <Button
              variant='outlined'
              onClick={() => clearForm()}
              color='primary'
              style={{ marginLeft: '1rem' }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Fragment>
  );
};

export default ComplianceForm;
