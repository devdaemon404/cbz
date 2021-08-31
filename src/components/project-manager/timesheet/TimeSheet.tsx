import React, { Fragment, useState, useContext, useEffect } from 'react';
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Grid,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import OPLoader from '../../common/OPLoader';
import PMBaseLayout from '../PMBaseLayout';
import TimeSheetTable from './TimeSheetTable';
import ManagerTimeSheetModal from './manager/ManagerTimeSheetModal';
import MGRTimesheetContext from '../../../contexts/project-manager/timesheet/manager/mgr-timesheet-context';
import { getWeekData } from 'src/components/common/OPWeekPicker';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    buttonBorder: {
      borderRadius: '40px',
      marginBottom: theme.spacing(2),
    },
    font: {
      fontWeight: 'bolder',
    },
  });
});

const TimeSheet = ({ userName }) => {
  const classes = useStyles();
  const [
    managerTimeSheetModalOpened,
    setManagerTimeSheetModalOpened,
  ] = useState<boolean>(false);

  const {
    isLoading,
    allProjects,
    selectedProject,
    setSelectedProject,
    fetchAllTasks,
    setSelectedWeekData,
  } = useContext(MGRTimesheetContext);

  const handleProjectChange = (event) => {
    const value = event.target.value;
    const project = allProjects.find((project) => project.id === value);
    if (project) setSelectedProject(project);
  };

  useEffect(() => {
    if (allProjects.length > 0) {
      const project = allProjects[0];
      if (project) setSelectedProject(project);
    }
  }, [allProjects]);

  return (
    <PMBaseLayout sidebarIndex={1} userName={userName}>
      <Fragment>
        <OPLoader isLoading={isLoading} />
        <Grid
          container
          spacing={2}
          item
          direction='row'
          justify='space-between'
          alignItems='flex-end'>
          <Grid item style={{ marginBottom: '0.5rem' }}>
            {/* <Button
              variant='contained'
              color='secondary'
              disableFocusRipple
              className={classes.buttonBorder}>
              Export
            </Button> */}
            <Typography
              variant='subtitle2'
              color='primary'
              style={{ width: '200px' }}>
              Select a project
            </Typography>
            <FormControl fullWidth size='small' variant='outlined'>
              <Select
                fullWidth
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                onChange={handleProjectChange}
                value={selectedProject.id}>
                {allProjects.length === 0 && (
                  <MenuItem value='123'>
                    <em>There are no projects</em>
                  </MenuItem>
                )}
                {allProjects.map((project) => (
                  <MenuItem value={project.id}>
                    {project.projectName}-{project.numeric_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<AddIcon />}
              disableFocusRipple
              onClick={async () => {
                fetchAllTasks();

                await setSelectedWeekData(getWeekData(new Date(), 7));

                await setManagerTimeSheetModalOpened(true);
              }}
              className={classes.buttonBorder}>
              Add a Task
            </Button>
          </Grid> */}
        </Grid>
        <TimeSheetTable />
        <ManagerTimeSheetModal
          isOpen={managerTimeSheetModalOpened}
          onClose={() => {
            setManagerTimeSheetModalOpened(false);
          }}
        />
      </Fragment>
    </PMBaseLayout>
  );
};

export default TimeSheet;
