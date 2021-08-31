import React, { useContext, useState } from 'react';
import { at } from 'lodash';
import { useField } from 'formik';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
} from '@material-ui/core';
import SAManageClientContext from 'src/contexts/super-admin/manage-clients/sa-mc-context';

export default function SwitchField(props) {
  const { label, ...rest } = props;
  const [field, meta, helper] = useField(props);
  const { setValue } = helper;
  const [currentValue, setCurrentValue] = useState(field.value);
  const { toggleActive } = useContext(SAManageClientContext);

  function _renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    if (touched && error) {
      return <FormHelperText>{error}</FormHelperText>;
    }
  }

  function _onChange(e) {
    toggleActive();
    setValue(e.target.checked);
    setCurrentValue(e.target.checked);
  }

  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={field.checked}
        checked={field.checked}
        control={
          <Switch {...field} checked={currentValue} onChange={_onChange} />
        }
        label={label}
      />
      {_renderHelperText()}
    </FormControl>
  );
}
