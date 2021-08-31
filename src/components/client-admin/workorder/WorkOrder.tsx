import React, { Fragment, useEffect } from 'react';
import { useContext } from 'react';
import CAWorkorderContext from 'src/contexts/client-admin/workorder/ca-workorder-context';
import CABaseLayout from '../CABaseLayout';
import WorkOrderTable from './WorkOrderTable';
import WorkOrderTabs from './WorkOrderTabs';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import CreateWorkOrderTab from './CreateWorkOrderTab';
import CreateTabs from './create-workorder/Tabs';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    button: {
      margin: theme.spacing(1),
      borderRadius: 9999,
    },
  });
});
const WorkOrder = ({
  userName,
  page,
  userId,
  clientId,
  workorderId,
}: {
  userName: string;
  page: string;
  userId: string;
  clientId: string;
  workorderId: string;
}) => {
  const { createPageShow, role } = useContext(CAWorkorderContext);

  useEffect(() => {
    console.log('Changed: ', createPageShow);
  }, [createPageShow]);
  return (
    <CABaseLayout sidebarIndex={4} userName={userName} role={role}>
      {createPageShow ? (
        <CreateTabs />
      ) : (
        <Fragment>
          {page === 'workorder' ? (
            <WorkOrderTable userId={userId} clientId={clientId} />
          ) : (
            <WorkOrderTabs workorderId={workorderId} />
          )}
        </Fragment>
      )}
    </CABaseLayout>
  );
};

export default WorkOrder;
