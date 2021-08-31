import React, { Fragment } from 'react';
import {
  Grid,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';

const RecruiterTab = () => {
  return (
    <Fragment>
      <Grid container spacing={3} direction='column'>
        <Grid item>
          <Typography>Select the Recruiter to share the Demand.</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant='outlined' size='small'>
            <Select
              // name={profile.id}
              // value={profile.profile_status}
              value='sekhar4'
              // onChange={(e) => handleStatusChange(e)}
            >
              <MenuItem value='sekhar4'>
                sekhar_recruiter--sekhar4@mailinator.com
              </MenuItem>
              <MenuItem value='sekhar5'>
                sekhar_recruiter1--sekhar5@mailinator.com
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default RecruiterTab;
