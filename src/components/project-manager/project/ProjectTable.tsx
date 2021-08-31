import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
// React Components Imports
import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableRow,
  Typography,
  createStyles,
  makeStyles,
  Theme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
} from '@material-ui/core';
import useTable from '../../common/useTable';
import { OPHttpClient } from 'src/utils/op-http-client';
import moment from 'moment';
import OPLoader from 'src/components/common/OPLoader';
import { PMTimesheetApiService } from 'src/apis/project-manager/pm-timesheet-api-service';
import { ProjectType } from 'src/types/project-manager/timesheet';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '100%',
    },
    hoverUnderline: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    font: {
      fontWeight: 'bold',
    },
    margin: {
      margin: theme.spacing(2, 0),
    },
    tableRowHover: {
      '&:hover': {
        // backgroundImage:
        // 'linear-gradient(to right top, #ffffff, #f9f9fc, #f2f4f9, #eaf0f6, #e1ebf2);',
        backgroundColor: '#f5f5f5',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    paperPadding: {
      padding: theme.spacing(2),
    },
  });
});

const ProjectTable = ({
  clientId,
  userId,
}: {
  clientId: string;
  userId: string;
}) => {
  const classes = useStyles();
  const router = useRouter();

  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getProjects = async () => {
    setIsLoading(true);
    const v1URL = 'https://test.app.cloudsbuzz.in/apis/v1/';
    const httpClientV1 = OPHttpClient.init(v1URL, {
      action: 'Project Manager Projects',
    });
    const _apiServiceV1 = new PMTimesheetApiService(httpClientV1);
    _apiServiceV1.setClientId(clientId);
    _apiServiceV1.setUserId(userId);
    const res = await _apiServiceV1.fetchAllProjects();
    if (res) setAllProjects([...res]);
    setIsLoading(false);
  };

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    //@ts-ignore
    setRecords(createTableData());
  }, [allProjects]);
  // Table Data

  interface Data {
    // id: string;
    projectName: string;
    numeric_id: number;
    startDate: string;
    endDate: string;
  }

  // Function to reverse string
  function reverseString(str) {
    return str.split('-').reverse().join('-');
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    align?: string;
  }

  const headCells: HeadCell[] = [
    // {
    //   id: 'id',
    //   numeric: false,
    //   disablePadding: true,
    //   label: 'Id',
    // },
    {
      id: 'projectName',
      numeric: false,
      disablePadding: false,
      label: 'Project Name',
      align: 'left',
    },
    {
      id: 'numeric_id',
      numeric: false,
      disablePadding: false,
      label: 'Project Id',
    },
    {
      id: 'startDate',
      numeric: false,
      disablePadding: false,
      label: 'Start Date',
    },
    { id: 'endDate', numeric: false, disablePadding: false, label: 'End Date' },
  ];

  const createTableData = () => {
    return allProjects
      .map((project) => {
        return {
          id: project.id,
          projectName: project.projectName,
          startDate: project.startDate,
          endDate: project.endDate,
          numeric_id: project.numeric_id,
        };
      })
      .reverse();
  };

  const [filterTerm, setFilterTerm] = useState('projectName');
  const [records, setRecords] = useState<Data[]>([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headCells, filterFn, 15);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == '') return items;
        else
          return items.filter((x) =>
            x[filterTerm].toString().toLowerCase().includes(target.value),
          );
      },
    });
  };

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterTerm(event.target.value as string);
    const searchElement = document.getElementById('search-field');
    if (searchElement) {
      searchElement.focus();
    }
  };

  return (
    <div className={classes.root}>
      <OPLoader isLoading={isLoading} />
      <Paper variant='outlined' className={classes.paperPadding}>
        <Grid container direction='column' spacing={2}>
          <Grid
            item
            container
            direction='row'
            alignItems='center'
            justify='center'>
            <Grid item xs={3}>
              <Typography variant='h5' color='initial' className={classes.font}>
                Select a Project
              </Typography>
            </Grid>
            <Grid item xs={5}></Grid>
            <Grid item xs={2}>
              <TextField
                variant='outlined'
                id='search-field'
                label='Search'
                size='small'
                onChange={handleSearch}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl
                variant='outlined'
                size='small'
                className={classes.formControl}>
                <InputLabel id='demo-simple-select-outlined-label'>
                  Filter
                </InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={filterTerm}
                  onChange={handleFilterChange}
                  label='Filter'>
                  {headCells.map((headCell) => (
                    <MenuItem value={headCell.id}>{headCell.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TblHead />
                {records.length > 0 ? (
                  <TblContainer>
                    {recordsAfterPagingAndSorting().map((item, index) => (
                      <TableRow className={classes.tableRowHover} key={item.id}>
                        <TableCell align='left'>{index + 1}</TableCell>
                        <TableCell align='left'>
                          <Typography
                            color='primary'
                            variant='body1'
                            onClick={async () => {
                              await router.push(
                                `/app/project-manager/project/${item.id}/manage-demand`,
                              );
                            }}>
                            <span
                              style={{
                                cursor: 'pointer',
                              }}
                              className={classes.hoverUnderline}>
                              {item.projectName}
                            </span>
                          </Typography>
                        </TableCell>
                        {/* <TableCell align='center'>{item.projectName}</TableCell> */}
                        <TableCell align='center'>{item.numeric_id}</TableCell>
                        <TableCell align='center'>
                          {moment(item.startDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell align='center'>
                          {moment(item.endDate).format('DD MMM YYYY')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TblContainer>
                ) : (
                  <Typography
                    variant='h6'
                    color='primary'
                    style={{ padding: '1rem' }}>
                    No Data Available
                  </Typography>
                )}

                <TblPagination />
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default ProjectTable;
