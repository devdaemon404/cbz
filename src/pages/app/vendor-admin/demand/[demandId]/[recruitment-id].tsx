import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { Fragment, useContext } from 'react';
import VABaseLayout from '../../../../../components/vendor-admin/VABaseLayout';
import { GetServerSidePropsContext } from 'next';
import {
  defaultUnauthorizedResponse,
  retrieveAuthHeader,
  UnauthorizedUserBaseType,
  verifyVendorAdmin,
} from '../../../../../utils/auth/verify-cookie';
import { OPHttpClient } from '../../../../../utils/op-http-client';
import VASummary from '../../../../../components/vendor-admin/demand/VASummary';
import VADemandState from '../../../../../contexts/vendor-admin/demand/VADemandState';
import { useRouter } from 'next/router';
import { VAApiService } from '../../../../../apis/vendor-admin/va-api-service';
import { DemandDataType } from '../../../../../types/project-manager/demand';
import { isException } from '../../../../../utils/op-exception';
import { VADemandApiService } from 'src/apis/vendor-admin/va-demand-api-service';

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext,
// ): Promise<UnauthorizedUserBaseType | { props: VADemandSummaryPropType }> => {
//   console.log('inside');
//   const { demandId } = context.query;
//   const result = await verifyVendorAdmin(context);
//   console.log('Result: ', result);
//   if ('redirect' in result) {
//     return result;
//   }
//   const httpClient = new OPHttpClient('https://test.app.cloudsbuzz.in', {
//     action: 'Fetch Demand Info',
//     customHeaders: retrieveAuthHeader(context),
//   });
//   // TODO: Create a Vendor Admin API Service
//   const apiService = new VAApiService(
//     httpClient,
//     result.props.id as string,
//     demandId as string,
//   );
//   const res = await apiService.fetchDemandDetails();
//   if (!res || isException(res)) {
//     return defaultUnauthorizedResponse;
//   }
//   console.log('Demand ID', demandId);
//   console.log('Vendor ID', result.props.id);
//   console.log('Recruitment ID', res.recruitmentId);
//   return {
//     props: {
//       demandData: res.demand,
//       recruitmentId: res.recruitmentId,
//       vendorId: result.props.id as string,
//       userName: result.props.userName,
//     },
//   };
// };

export async function getServerSideProps(context) {
  return await verifyVendorAdmin(context);
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      marginTop: -40,
    },
  }),
);

// type VADemandSummaryPropType = {
//   demandData: DemandDataType;
//   recruitmentId: string;
//   vendorId: string;
//   userName: string;
// };

const VADemandSummary = ({ userId, id, userName }) => {
  const classes = useStyles();
  const { query } = useRouter();

  console.log('req', query, query['recruitment-id']);

  return (
    <div className={classes.root}>
      <VADemandState
        demandId={query.demandId?.toString()}
        vendorId={userId}
        userId={id}
        recruitmentId={query['recruitment-id']?.toString()}>
        <VABaseLayout userName={userName} sidebarIndex={3}>
          <Fragment>
            <VASummary />
          </Fragment>
        </VABaseLayout>
      </VADemandState>
    </div>
  );
};

// const VADemandSummary = (props: VADemandSummaryPropType) => {
//   console.log('Props: ', props);
//   const classes = useStyles();
//   return (
//     <div className={classes.root}>
//       <VADemandState
//         demandId={props.demandData.id}
//         vendorId={props.vendorId}
//         recruitmentId={props.recruitmentId}>
//         <VABaseLayout userName={props.userName} sidebarIndex={0}>
//           <Fragment>
//             <VASummary demandData={props.demandData} />
//           </Fragment>
//         </VABaseLayout>
//       </VADemandState>
//     </div>
//   );
// };

export default VADemandSummary;
