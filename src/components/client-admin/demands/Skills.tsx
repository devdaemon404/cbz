import React, { useState, useContext } from 'react';
import ChipInput from 'material-ui-chip-input';
import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';

import {
  Grid,
  Typography,
  TextField,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { add } from 'date-fns/esm';
import InputField from 'src/components/common/FormFields/InputField';
import ChipInputField from 'src/components/common/FormFields/ChipInputField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridPadding: {
      padding: theme.spacing(4),
      flexGrow: 1,
    },
    compulsory: {
      color: theme.palette.error.main,
    },
    fixTopPadding: {
      paddingTop: '0 !important',
    },
    fixPadding: {
      padding: '0 !important',
    },
    fixMargin: {
      margin: '0 8px 0 0 !important',
    },
  }),
);

const Skills = (props: any) => {
  const classes = useStyles();

  const {
    formField: {
      primary_skills,
      secondary_skills,
      // additional_skills,
      relevant_experience,
      total_experience,
    },
  } = props;

  return (
    <div style={{ padding: '2rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {primary_skills.label} <span style={{ color: 'red' }}>*</span>
          </Typography>

          <ChipInputField name={primary_skills.name} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {secondary_skills.label} <span style={{ color: 'red' }}>*</span>
          </Typography>

          <ChipInputField name={secondary_skills.name} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {relevant_experience.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField
            // type='number'
            name={relevant_experience.name}
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='body1' color='initial'>
            {total_experience.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputField
            // type='number'
            name={total_experience.name}
            size='small'
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Skills;
