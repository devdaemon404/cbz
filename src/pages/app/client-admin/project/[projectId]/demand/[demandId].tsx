import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { Fragment } from 'react';
import CABaseLayout from 'src/components/client-admin/CABaseLayout';
import PMSummary from 'src/components/client-admin/demands/PMSummary';
import {
  defaultUnauthorizedResponse,
  retrieveAuthHeader,
  verifyClientAdmin,
} from '../../../../../../utils/auth/verify-cookie';
import { OPHttpClient } from '../../../../../../utils/op-http-client';
import { CADemandApiService } from '../../../../../../apis/client-admin/ca-demands-api-service';
import { isException } from '../../../../../../utils/op-exception';
import { DemandDataType } from '../../../../../../types/project-manager/demand';
import CADemandState from 'src/contexts/client-admin/projects/demands/CADemandState';
import { GetServerSidePropsContext } from 'next';
import { render } from 'react-dom';

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { demandId, projectId } = context.query;
  const result = await verifyClientAdmin(context);
  console.log('Result: ', result);
  console.log('piyush');
  if ('redirect' in result) {
    return result;
  }
  const httpClient = new OPHttpClient('https://test.app.cloudsbuzz.in/', {
    action: 'Fetch Demand Info',
    customHeaders: retrieveAuthHeader(context),
  });
  const apiService = new CADemandApiService(httpClient);
  const res = await apiService.fetchDemandDetails(demandId as string);
  // const vendors = await apiService.getVendors(result.client)
  console.log('hhshshhsh', res);
  if (res) {
    if (!res.skills.relevant_experience) {
      res.skills.relevant_experience = 0;
    }
    if (!res.skills.total_experience) {
      res.skills.total_experience = 0;
    }
  }
  if (isException(res)) {
    // return defaultUnauthorizedResponse;
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
  // console.log({ props });
  return (
    <div className={classes.root}>
      <CADemandState demandId={props.data.id} projectId={props.data.project_id}>
        <CABaseLayout userName={props.userName} sidebarIndex={3}>
          <Fragment>
            <PMSummary demandData={props.data} />
          </Fragment>
        </CABaseLayout>
      </CADemandState>
    </div>
  );
};

export default DemandSummaryPage;
