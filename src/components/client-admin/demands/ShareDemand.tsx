import React, { useState, useContext, useEffect } from 'react';

import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import { Typography, Grid, Button } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import CADemandContext from 'src/contexts/client-admin/projects/demands/ca-demand-context';
import ShareIcon from '@material-ui/icons/Share';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      // padding: theme.spacing(10),
      minWidth: 600,
      maxWidth: 800,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // marginTop: '4rem',
      // width: '100%',
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ShareDemand = (props: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const [vendorId, setVendorId] = React.useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setVendorId(event.target.value as string[]);
  };

  const handleChangeMultiple = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const { options } = event.target as HTMLSelectElement;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setVendorId(value);
  };

  const [data, setData] = useState([{ label: '', value: '' }]);

  // @ts-ignore
  const { getVendors, demands, handleDemandShare } = useContext(
    CADemandContext,
  );

  const demandId = demands[demands.length - 1].id;

  useEffect(() => {
    getVendorList();
  }, []);

  const getVendorList = async () => {
    const vendorList = await getVendors();
    const list = vendorList.map((o, i) => {
      return {
        value: o.id,
        label: o.name,
      };
    });
    setData(list);
  };

  const getVendorName = (value: string) => {
    const tempVendorData = data.filter((vendor) => vendor.value === value);
    console.log({ tempVendorData });
    return tempVendorData[0]?.label;
  };

  console.log({ vendorName: vendorId });

  return (
    <div style={{ padding: '2rem' }}>
      <Grid
        container
        spacing={3}
        direction='column'
        justify='center'
        alignItems='flex-start'>
        <Grid item xs={12}>
          <Typography variant='body1' color='initial'>
            {'Select vendor(s) to share demand'}
          </Typography>
          <FormControl className={classes.formControl}>
            <Select
              labelId='demo-mutiple-chip-label'
              id='demo-mutiple-chip'
              multiple
              variant='outlined'
              value={vendorId}
              onChange={handleChange}
              input={<Input id='select-multiple-chip' />}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {(selected as string[]).map((value) => (
                    <Chip
                      key={value}
                      label={getVendorName(value)}
                      className={classes.chip}
                    />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}>
              {data.map((data) => (
                <MenuItem key={data.value} value={data.value}>
                  {data.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          {vendorId.length > 0 ? (
            <Button
              color='primary'
              variant='contained'
              onClick={() => handleDemandShare(demandId as string, vendorId)}
              startIcon={<ShareIcon />}
              // style={{ marginLeft: '10rem' }}
            >
              Share Demand
            </Button>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ShareDemand;
