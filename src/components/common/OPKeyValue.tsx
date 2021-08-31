import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textBackground: {
      backgroundColor: '#DBE2E7',
      padding: theme.spacing(1),
    },
    boldFont: {
      fontWeight: theme.typography.fontWeightMedium,
    },
  }),
);

type Props = {
  label: string;
  value: any;
  color?: string;
};

const OPKeyValue = ({ label, value, color }: Props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction='row'
      spacing={2}
      item
      xs={12}
      alignItems='center'>
      <Grid
        item
        //  lg={6} md={6}
        xs={5}>
        <Paper elevation={0} className={classes.textBackground}>
          <Typography
            variant='body2'
            color={color === undefined ? 'initial' : 'textPrimary'}
            align='right'
            className={classes.boldFont}>
            {label}
          </Typography>
        </Paper>
      </Grid>
      <Grid
        item
        //  lg={6} md={6}
        xs={7}>
        <Typography variant='body2' color='initial'>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OPKeyValue;
