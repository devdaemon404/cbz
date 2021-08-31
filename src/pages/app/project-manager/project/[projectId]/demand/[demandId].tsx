import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { Fragment } from 'react';
import PMBaseLayout from 'src/components/project-manager/PMBaseLayout';
import PMSummary from 'src/components/project-manager/demand/PMSummary';
import {
  defaultUnauthorizedResponse,
  retrieveAuthHeader,
  verifyProjectManager,
} from '../../../../../../utils/auth/verify-cookie';
import { OPHttpClient } from '../../../../../../utils/op-http-client';
import { ProjectManagerAPIService } from '../../../../../../apis/project-manager/pm-api-service';
import { isException } from '../../../../../../utils/op-exception';
import { DemandDataType } from '../../../../../../types/project-manager/demand';
import PMDemandState from 'src/contexts/project-manager/demand/PMDemandState';
import { GetServerSidePropsContext } from 'next';
import { render } from 'react-dom';

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { demandId } = context.query;
  const result = await verifyProjectManager(context);
  console.log('Result: ', result);
  if ('redirect' in result) {
    return result;
  }
  const httpClient = new OPHttpClient('https://test.app.cloudsbuzz.in/', {
    action: 'Fetch Demand Info',
    customHeaders: retrieveAuthHeader(context),
  });
  const apiService = new ProjectManagerAPIService(httpClient);
  const res = await apiService.fetchDemandDetails(demandId as string);
  if (res) {
    if (res.skills && !res.skills.relevant_experience) {
      res.skills.relevant_experience = 0;
    }
    if (res.skills && !res.skills.total_experience) {
      res.skills.total_experience = 0;
    }
  }
  if (isException(res)) {
    return defaultUnauthorizedResponse;
  }
  return {
    props: {
      ...result.props,
      data: res,
    },
  };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      marginTop: -40,
    },
  }),
);

type DemandSummaryPageProps = {
  data: DemandDataType;
  userName: string;
};

const DemandSummaryPage = (props: DemandSummaryPageProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PMDemandState demandId={props.data.id}>
        <PMBaseLayout userName={props.userName} sidebarIndex={3}>
          <Fragment>
            <PMSummary demandData={props.data} />
          </Fragment>
        </PMBaseLayout>
      </PMDemandState>
    </div>
  );
};

export default DemandSummaryPage;
