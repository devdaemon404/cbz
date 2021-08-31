import React, { useContext } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core';
import CAProjectsContext from 'src/contexts/client-admin/projects/ca-projects-context';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    typo: {
      fontWeight: 'bold',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },

    input: {
      width: '100%',
    },
  }),
);

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h5'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ProjectsModal() {
  const {
    modelOpen,
    setModelOpen,
    modalType,
    selectedRowData,
    addNewProjectData,
    setSelectedRowData,
    modalData,
    updateProject,
    setModalData,
    findPM,
    setFindPM,
  } = useContext(CAProjectsContext);
  const classes = useStyles();
  const handleClose = () => {
    setModelOpen(false);
  };

  const [pmData, setPmData] = React.useState<VDType[]>([]);
  const [vpData, setVpData] = React.useState<VDType[]>([]);
  const [vpDeptMap, setVpDeptMap] = React.useState({});
  interface VDType {
    id: string;
    name: string;
    department_name?: string;
  }

  React.useEffect(() => {
    let pd: VDType[] = [];
    let vd: VDType[] = [];
    let vpDeptMapper = {};

    findPM.forEach((o, i) => {
      if (o.roles[0].role === 'VICE_PRESIDENT') {
        let object = {
          id: o.id,
          name: `${o.firstname} ${o.lastname}`,
          department_name: o.department_name || 'Department Name',
        };
        vd.push(object);
        vpDeptMapper[o.id] = o.department_name;
      } else if (o.roles[0].role === 'PROJECT_MANAGER') {
        let object = {
          id: o.id,
          name: `${o.firstname} ${o.lastname}`,
          department_name: o.department_name,
        };
        pd.push(object);
      }
    });
    setPmData(pd);
    setVpData(vd);
    setVpDeptMap(vpDeptMapper);
  }, [findPM]);

  React.useEffect(() => {
    console.log(pmData, vpData, vpDeptMap);
  }, [vpDeptMap]);
  const formInputs = () => {
    if (modalType === 'new') {
      return [
        {
          label: 'Project Name',
          required: true,
          type: 'text',
          disabled: false,
          value: 'projectName',
          helpText: ' ',
        },
        // {
        //   label: 'Project Start date',
        //   helpText: ' ',
        //   type: 'date',
        //   disabled: false,
        //   value: 'startDate',
        //   required: true,
        // },
        {
          label: 'Project Manager Name',
          helpText: ' ',
          type: 'select',
          disabled: true,
          value: 'project_manager_user_id',
          required: true,
        },
        // {
        //   label: 'Project End date',
        //   helpText: ' ',
        //   type: 'date',
        //   disabled: false,
        //   value: 'endDate',
        //   required: true,
        // },
        {
          label: 'Vice President Name',
          value: 'vp_user_id',
          disabled: true,
          type: 'select',
          helpText: ' ',
          required: true,
        },
        {
          label: 'Department Name',
          value: 'department_name',
          disabled: true,
          type: 'text',
          helpText: ' ',
          required: true,
        },
      ];
    } else {
      return [
        {
          label: 'Project Name',
          required: true,
          type: 'text',
          disabled: true,
          value: 'projectName',
          helpText: ' ',
        },
        // {
        //   label: 'Project Start date',
        //   helpText: ' ',
        //   type: 'date',
        //   disabled: false,
        //   value: 'startDate',
        //   required: true,
        // },
        {
          label: 'Project Manager Name',
          helpText: ' ',
          type: 'select',
          disabled: false,
          value: 'pm_name',
          required: true,
        },
        // {
        //   label: 'Project End date',
        //   helpText: ' ',
        //   type: 'date',
        //   disabled: false,
        //   value: 'endDate',
        //   required: true,
        // },
        {
          label: 'Vice President Name',
          value: 'vp_name',
          disabled: true,
          type: 'text',
          helpText: ' ',
          required: true,
        },
        {
          label: 'Department Name',
          value: 'department_name',
          disabled: true,
          type: 'text',
          helpText: ' ',
          required: true,
        },
      ];
    }
  };

  React.useEffect(() => {
    console.log(modalData);
  }, [modalData]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (modalType === 'new') {
      addNewProjectData();
    } else {
      updateProject();
    }
    handleClose();
  };

  React.useEffect(() => {
    if (modalType === 'new') {
      if (modalData.vp_user_id) {
        // let a = vpDeptMap[modalData.vp_user_id.split(' ')[0]];
        setModalData({
          ...modalData,
          department_name: vpDeptMap[modalData.vp_user_id],
        });
      }
    }
  }, [modalData.vp_user_id]);

  const projectManagerSelect = (formInput, iterator) => {
    return (
      <Grid item lg={6} key={iterator}>
        <FormControl fullWidth>
          <Typography className={classes.typo}>
            {formInput.label}
            {formInput.required && <span style={{ color: 'red' }}> *</span>}
          </Typography>
          <TextField
            variant='outlined'
            margin='dense'
            select
            onChange={(e) => {
              if (modalType === 'edit') {
                setModalData({
                  ...modalData,
                  project_manager_user_id: e.target.value,
                });
              } else {
                setModalData({
                  ...modalData,
                  [formInput.value]: e.target.value,
                });
              }
            }}
            disabled={modalType === 'edit' && formInput.disabled}
            defaultValue={selectedRowData[formInput.value]}
            id={`my-input-${iterator}`}
            aria-describedby={`my-helper-text-${iterator}`}>
            {formInput.value === 'project_manager_user_id' ||
            formInput.value === 'pm_name' ? (
              pmData.map((o, i) => {
                return (
                  <MenuItem key={i} value={o?.id}>
                    {o?.name}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem></MenuItem>
            )}
            {formInput.value === 'vp_user_id' &&
              vpData.map((o, i) => {
                return (
                  <MenuItem key={i} value={o?.id}>
                    {o?.name}
                  </MenuItem>
                );
              })}
          </TextField>
        </FormControl>
      </Grid>
    );
  };

  const items = formInputs().map((formInput, iterator) => {
    if (formInput.type === 'select') {
      return projectManagerSelect(formInput, iterator);
    } else {
      return (
        <Grid item lg={6} key={iterator}>
          <FormControl fullWidth>
            <Typography className={classes.typo}>
              {formInput.label}
              {formInput.required && <span style={{ color: 'red' }}> *</span>}
            </Typography>
            <TextField
              variant='outlined'
              margin='dense'
              onChange={(e) => {
                setModalData({
                  ...modalData,
                  [formInput.value]: e.target.value,
                });
              }}
              {...(modalType === 'new' && {
                value: modalData[formInput.value],
              })}
              disabled={modalType === 'edit' && formInput.disabled}
              type={formInput.type}
              defaultValue={selectedRowData[formInput.value]}
              required={formInput.required}
              id={`my-input-${iterator}`}
              aria-describedby={`my-helper-text-${iterator}`}
            />
            <FormHelperText id={`my-helper-text-${iterator}`}>
              {formInput.helpText}
            </FormHelperText>
          </FormControl>
        </Grid>
      );
    }
  });

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='md'
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={modelOpen}>
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          {modalType == 'new' ? 'Add New Project' : 'Edit Project'}
        </DialogTitle>
        <form onSubmit={onSubmitHandler}>
          <DialogContent className={classes.form}>
            <Paper style={{ margin: '0 5', padding: 20 }} variant='outlined'>
              <Grid container item lg={12} spacing={3}>
                {items}

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid item lg={6}>
                    <Typography className={classes.typo}>
                      Start Date <span style={{ color: 'red' }}> *</span>
                    </Typography>
                    <KeyboardDatePicker
                      inputVariant='outlined'
                      {...(modalType === 'new'
                        ? {
                            value: modalData.startDate,
                          }
                        : { value: modalData.startDate })}
                      onChange={(e) => {
                        if (e) {
                          setModalData({
                            ...modalData,
                            startDate: e.toISOString(),
                          });
                        }
                      }}
                      disabled={modalType === 'edit'}
                      format='dd/MM/yy'
                      size='small'
                      fullWidth
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <Typography className={classes.typo}>
                      End Date <span style={{ color: 'red' }}> *</span>
                    </Typography>
                    <KeyboardDatePicker
                      inputVariant='outlined'
                      {...(modalType === 'new'
                        ? {
                            value: modalData.endDate,
                          }
                        : { value: modalData.endDate })}
                      onChange={(e) => {
                        if (e) {
                          setModalData({
                            ...modalData,
                            endDate: e.toISOString(),
                          });
                        }
                      }}
                      disabled={modalType === 'edit'}
                      format='dd/MM/yy'
                      size='small'
                      fullWidth
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant='contained'
              color='primary'
              type='submit'
              style={{ marginBottom: '1rem', marginRight: '1rem' }}>
              {modalType === 'new' ? 'Add Project' : 'Save changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
