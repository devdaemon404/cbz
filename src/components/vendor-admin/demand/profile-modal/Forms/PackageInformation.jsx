import React, { useContext } from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from '@material-ui/core';
import DatePickerField from 'src/components/common/FormFields/DatePickerField';
import InputField from 'src/components/common/FormFields/InputField';
import SelectField from 'src/components/common/FormFields/SelectField';
import FileField from 'src/components/common/FormFields/FileField';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import FileEditField from 'src/components/common/FormFields/FileEditField';

const currencies = [
  {
    value: 'INR',
    label: <>&#8377;</>,
  },
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: <>&#8364;</>,
  },
];

export default function PackageInformation(props) {
  const { modalMode, currentProfile } = useContext(VADemandContext);
  const {
    formField: {
      interview_date_time,
      rate_currency,
      rate,
      // currentCTC,
      doj,
      file,
    },
  } = props;

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {interview_date_time.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <DatePickerField
            name={interview_date_time.name}
            format='dd/MM/yy'
            size='small'
            fullWidth
            disabled={modalMode === 'View Profile'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {rate.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Grid container direction='row' wrap='nowrap' spacing={1}>
            <Grid item xs={2}>
              <SelectField
                name={rate_currency.name}
                data={currencies}
                size='small'
                disabled={modalMode === 'View Profile'}
              />
            </Grid>
            <Grid item xs={10}>
              <InputField
                type='number'
                name={rate.name}
                size='small'
                fullWidth
                disabled={modalMode === 'View Profile'}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <Typography variant="body1" color="initial">{currentCTC.label} <span style={{ color: 'red' }}>*</span></Typography>
          <InputField
            name={currentCTC.name}
            size='small'
            fullWidth
          />
        </Grid> */}
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {doj.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <DatePickerField
            name={doj.name}
            size='small'
            format='dd/MM/yy'
            fullWidth
            disabled={modalMode === 'View Profile'}
          />
        </Grid>
        <Grid item>
          <Typography variant='body1' color='initial'>
            {file.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          {modalMode === 'Edit Profile' ? (
            <FileEditField
              name={file.name}
              defaultValue={
                modalMode === 'Edit Profile'
                  ? currentProfile.profile_file_name
                  : undefined
              }
            />
          ) : (
            <FileField name={file.name}

              disabled={modalMode === 'View Profile'}
            />
            // <TextField
            //   variant='outlined'
            //   size='small'
            //   value={}
            //   // onChange={}
            //   disabled={modalMode === 'View Profile'}
            // />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
