import React from 'react';
import 'date-fns';
import { Grid, Typography } from '@material-ui/core';
import InputField from 'src/components/common/FormFields/InputField';
import DatePickerField from 'src/components/common/FormFields/DatePickerField';
import SelectField from 'src/components/common/FormFields/SelectField';

const AdditionalInformation = (props: any) => {
  const {
    formField: {
      email_enabled,
      team_member_info_access,
      // request_id,
      status,
      additional_supplier_info,
      location,
      shift,
      background_check_required,
      employment_type,
    },
  } = props;

  const emailEnabled = [
    {
      value: 'true',
      label: 'Yes',
    },
    {
      value: 'false',
      label: 'No',
    },
  ];
  const shift_data = [
    {
      value: 'ROTATION_SHIFT',
      label: 'Rotation Shift',
    },
    {
      value: 'GENERAL_SHIFT',
      label: 'General Shift',
    },
  ];

  const employmentType = [
    {
      value: 'PART_TIME',
      label: 'Contract To Hire',
    },
    {
      value: 'FULL_TIME',
      label: 'Contractor',
    },
  ];

  const statusData = [
    {
      value: 'OPEN',
      label: 'Open',
    },
    {
      value: 'CANCEL',
      label: 'Cancel',
    },

    {
      value: 'HOLD',
      label: 'Hold',
    },
    {
      value: 'FILLED',
      label: 'Filled',
    },
  ];

  const backgroundCheckRequired = [
    {
      value: 'true',
      label: 'Mandatory',
    },
    {
      value: 'false',
      label: 'Non-Mandatory',
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {request_id.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={request_id.name} fullWidth size='small' />
        </Grid> */}

        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {status.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <SelectField
            name={status.name}
            data={statusData}
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {employment_type.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <SelectField
            name={employment_type.name}
            data={employmentType}
            size='small'
            fullWidth
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {location.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={location.name} fullWidth size='small' />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {shift.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <SelectField
            data={shift_data}
            name={shift.name}
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {background_check_required.label}{' '}
            <span style={{ color: 'red' }}>*</span>
          </Typography>
          <SelectField
            name={background_check_required.name}
            data={backgroundCheckRequired}
            size='small'
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default AdditionalInformation;
