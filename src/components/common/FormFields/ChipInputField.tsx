import React, { useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { at } from 'lodash';
import {
  CloudUpload as CloudUploadIcon,
  DoneAll as DoneIcon,
} from '@material-ui/icons';
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';

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

const ChipInputField = ({ name }: { name: string }) => {
  const {
    setFieldValue,
    values,
  }: { setFieldValue: any; values: any } = useFormikContext();

  const classes = useStyles();
  const [field, meta] = useField(name);
  // console.log('meta', meta);

  const handleChange = (value) => {
    setFieldValue(name, value);
  };

  function _renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    if (touched && error) {
      return error;
    }
  }

  return (
    <>
      <ChipInput
        fullWidth
        classes={{
          inputRoot: classes.fixTopPadding,
          input: classes.fixPadding,
          chip: classes.fixMargin,
        }}
        id={name}
        // name={name}
        size='small'
        newChipKeys={[',', '/']}
        placeholder='Enter comma seperated'
        variant='outlined'
        defaultValue={values[name].length > 0 ? values[name] : []}
        // value={data.value}
        onChange={(chips) => setFieldValue(name, chips)}
        // helperText={_renderHelperText()}
        // onDelete={(chip, index) =>
        //   handleSkillsOnChange(
        //     data.value.filter((_, i) => i !== index),
        //     data.level,
        //   )
        // }
      />
      <Typography
        component='div'
        variant='caption'
        style={{ color: '#B33044' }}>
        {meta.touched && meta.error}
      </Typography>
    </>
  );
};

export default ChipInputField;
