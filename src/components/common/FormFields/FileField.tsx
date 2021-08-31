import React, { useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import {
  CloudUpload as CloudUploadIcon,
  DoneAll as DoneIcon,
} from '@material-ui/icons';
import { Button, Typography } from '@material-ui/core';

const FileField = ({ name, ...rest }) => {
  const {
    setFieldValue,
    values,
  }: { setFieldValue: any; values: any } = useFormikContext();

  const [_, meta] = useField(name);

  const handleChange = (e) => {
    const currentFile = e.currentTarget.files[0]
      ? e.currentTarget.files[0]
      : undefined;
    setFieldValue(name, currentFile);
  };

  const isFile: boolean = values.file && values.file.name;

  return (
    <>
      <label htmlFor={name}>
        <input
          type='file'
          id={name}
          name={name}
          onChange={handleChange}
          disabled={rest.disabled}
          hidden
        />
        <Button
          color={isFile ? 'secondary' : 'primary'}
          variant={isFile ? 'outlined' : 'contained'}
          disabled={rest.disabled}
          component='span'
          startIcon={isFile ? <DoneIcon /> : <CloudUploadIcon />}>
          {isFile ? values.file.name : 'Upload'}
        </Button>
      </label>
      <Typography
        component='div'
        variant='caption'
        style={{ color: '#B33044' }}>
        {meta.touched && meta.error}
      </Typography>
    </>
  );
};

export default FileField;
