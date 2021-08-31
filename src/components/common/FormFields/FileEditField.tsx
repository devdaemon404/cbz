import React, { useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import {
  CloudUpload as CloudUploadIcon,
  DoneAll as DoneIcon,
} from '@material-ui/icons';
import { Button, Typography } from '@material-ui/core';

const FileEditField = ({ name }: { name: string }) => {
  const {
    setFieldValue,
    values,
  }: { setFieldValue: any; values: any } = useFormikContext();

  const [field, meta] = useField(name);

  const handleChange = (e) => {
    const currentFile = e.currentTarget.files[0]
      ? e.currentTarget.files[0]
      : undefined;

    if (currentFile) {
      console.log('Yes file', values);
      setFieldValue(name, currentFile);
    } else {
      console.log('No file', values);
      setFieldValue(name, undefined);
    }
  };

  return (
    <>
      <label htmlFor={name}>
        <input
          type='file'
          id={name}
          name={name}
          onChange={handleChange}
          hidden
        />
        <Button
          color={values.file && values.file.name ? 'secondary' : 'primary'}
          variant={values.file && values.file.name ? 'outlined' : 'contained'}
          component='span'
          startIcon={
            values.file && values.file.name ? <DoneIcon /> : <CloudUploadIcon />
          }>
          {values.file && values.file.name ? values.file.name : 'Upload'}
        </Button>
      </label>
      <Typography
        component='div'
        variant='caption'
        style={{ color: '#B33044' }}>
        {meta.touched && meta.error}
        {/* {defaultValue && !values.file && 'File required'}
        {defaultValue ? (values.file ? '' : '') : 'File required'} */}
      </Typography>
    </>
  );
};

export default FileEditField;
