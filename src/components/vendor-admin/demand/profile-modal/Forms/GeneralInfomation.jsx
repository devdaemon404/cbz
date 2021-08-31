import React, { useState, useContext, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import InputField from 'src/components/common/FormFields/InputField';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';

export default function GeneralInformation(props) {
  const { modalMode } = useContext(VADemandContext);

  const [profileStatuses, setProfileStatuses] = useState([]);

  useEffect(() => {
    if (modalMode === 'Create Profile') {
      setProfileStatuses([
        {
          value: 'SELECT',
          label: 'Select',
        },
        {
          value: 'LISTED',
          label: 'Listed',
        },
      ]);
    } else {
      setProfileStatuses([
        {
          value: 'SELECT',
          label: 'Select',
        },
        {
          value: 'LISTED',
          label: 'Listed',
        },
        {
          value: 'INTERESTED',
          label: 'Interested',
        },
        {
          value: 'INTERVIEW_IN_PROCESS',
          label: 'Interview in process',
        },
        {
          value: 'FILTERED',
          label: 'Filterd',
        },
        {
          value: 'READY_TO_SHARE',
          label: 'Ready to share',
        },
      ]);
    }
  }, [modalMode]);

  const {
    formField: {
      firstname,
      lastname,
      email,
      location,
      mobile,
      experience,
      // profileStatus,
      notice_period,
    },
  } = props;
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {firstname.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={firstname.name} fullWidth size='small' disabled={modalMode === 'View Profile'} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {lastname.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={lastname.name} fullWidth size='small' disabled={modalMode === 'View Profile'} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {email.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={email.name} fullWidth size='small' disabled={modalMode === 'View Profile'} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {location.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={location.name} fullWidth size='small' disabled={modalMode === 'View Profile'} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {mobile.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField name={mobile.name} fullWidth size='small' disabled={modalMode === 'View Profile'} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {experience.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField
            name={experience.name}
            fullWidth
            disabled={modalMode === 'View Profile'}
            size='small'
            type='number'
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <Typography variant="body1" color="initial">{profileStatus.label} <span style={{ color: 'red' }}>*</span></Typography>
          <SelectField
            name={profileStatus.name}
            data={profileStatuses}
            size='small'
            fullWidth
          />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Typography variant='body1' color='initial'>
            {notice_period.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField
            name={notice_period.name}
            fullWidth
            size='small'
            type='number'
            disabled={modalMode === 'View Profile'}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
