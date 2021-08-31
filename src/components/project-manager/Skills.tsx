import React, { useState, useContext } from 'react';
import ChipInput from 'material-ui-chip-input';
import PMDemandContext from '../../contexts/project-manager/demand/pm-demand-context';

import {
  Grid,
  Typography,
  TextField,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { add } from 'date-fns/esm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridPadding: {
      padding: theme.spacing(4),
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

const Skills = () => {
  const classes = useStyles();

  const {
    demandInfo,
    validation,
    handleExperienceChange,
    handleSkillsOnChange,
  } = useContext(PMDemandContext);

  const { skills } = demandInfo;
  console.log('***********demandInfo: ', demandInfo);
  const {
    total_experience,
    relevant_experience,
    primary_skills,
    secondary_skills,
    // additional_skills,
  } = skills;

  const {
    total_experience: total_experience_validation,
    relevant_experience: relevant_experience_validation,
  } = validation;

  console.log({ primary_skills }, { demandInfo });
  // const experienceValidation = validation.experience;
  // console.log(experienceValidation);

  interface SkillDataType {
    label: string;
    value: string[];
    level: number;
  }

  const skillData: SkillDataType[] = [
    {
      label: 'Primary Skills',
      value: primary_skills,
      level: 2,
    },
    {
      label: 'Secondary Skills',
      value: secondary_skills,
      level: 1,
    },
  ];

  interface ExperienceDataType {
    label: string;
    key: number;
    name: string;
    helperText: string;
    error: boolean;
  }

  const experienceData: ExperienceDataType[] = [
    {
      label: 'Total Experience (yrs)',
      key: total_experience,
      name: 'total_experience',
      helperText: total_experience_validation.helperText,
      error: total_experience_validation.error,
    },
    {
      label: 'Relevant Experience (yrs)',
      key: relevant_experience,
      name: 'relevant_experience',
      helperText: relevant_experience_validation.helperText,
      error: relevant_experience_validation.error,
    },
  ];

  const isError = (fieldName): boolean => {
    const validationArray = Object.keys(validation);
    let _error = false;
    validationArray.map((name) => {
      if (fieldName === name && validation[name].error) {
        _error = true;
      }
    });
    return _error;
  };

  const getHelperText = (fieldName): string => {
    const validationArray = Object.keys(validation);
    let _helperText = '';
    validationArray.map((name) => {
      if (fieldName === name && validation[name].error) {
        _helperText = validation[name].helperText;
      }
    });
    return _helperText;
  };

  return (
    <div>
      <Grid
        container
        direction='row'
        spacing={2}
        className={classes.gridPadding}>
        {skillData.map((data) => {
          console.log('SKill data', data);
          return (
            <Grid item xs={6}>
              <Typography>
                {data.label}
                <span className={classes.compulsory}>*</span>
              </Typography>
              <ChipInput
                fullWidth
                classes={{
                  inputRoot: classes.fixTopPadding,
                  input: classes.fixPadding,
                  chip: classes.fixMargin,
                }}
                size='small'
                newChipKeys={[',', '/']}
                placeholder='Enter comma seperated'
                variant='outlined'
                defaultValue={data.value.length > 0 ? data.value : []}
                // value={data.value}
                onChange={(chips) => handleSkillsOnChange(chips, data.level)}
                // onDelete={(chip, index) =>
                //   handleSkillsOnChange(
                //     data.value.filter((_, i) => i !== index),
                //     data.level,
                //   )
                // }
              />
            </Grid>
          );
        })}

        {experienceData.map((data) => (
          <Grid item xs={6}>
            <Typography>
              {data.label}
              <span className={classes.compulsory}>*</span>
            </Typography>
            <TextField
              error={isError(data.name)}
              fullWidth
              name={data.name}
              value={data.key}
              // type='number'
              size='small'
              variant='outlined'
              helperText={getHelperText(data.name)}
              onChange={(e) => handleExperienceChange(e)}
              placeholder={data.label}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Skills;
