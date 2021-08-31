import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { WorkOrderStatuses, Roles } from '../models/WorkOrder';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { pmURL } from '../config/keys';

function sanitize(str: string) {
  console.log(str);
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/gi;
  return str.replace(reg, (match) => map[match]);
}

import WorkOrder from '../models/WorkOrder';
import Profile from '../models/Profile';
import WorkOrderCount from '../models/workOrderCount';
import Employees from '../models/Employees';

/**
 * @desc   Create a work order
 * @route  POST /api/v2/work-order
 * @access Private Role = Project manager
 *
 */

const notifBaseUrl = 'http://test.app.cloudsbuzz.in/apis/v1/notification/user';

const sendNotif = async (userId, event, workOrderID, cookie) => {
  const url = `${notifBaseUrl}/${userId}`;

  const body = {
    event_id: event,
    content: [
      {
        name: 'work_order_id',
        value: workOrderID,
      },
    ],
  };

  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie}`,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  console.log(data);
};

export const createWorkOrder = asyncHandler(async (req, res, next) => {
  const { clientId, vendorId, profileId, demandId } = req.query;

  const { user_id } = req.user;

  const getCount = await WorkOrderCount.findOneAndUpdate(
    { clientId },
    {
      $inc: { count: 1 },
    },
  ).lean();

  let countOfWorkOrders = 8100000;

  if (getCount === null) {
    await WorkOrderCount.create({
      clientId,
    });
  } else {
    countOfWorkOrders = getCount.count;
  }

  const id = `WO${countOfWorkOrders}`;

  const data = await WorkOrder.create({
    data: {
      ...req.body,
      id,
      client: mongoose.Types.ObjectId(clientId),
      vendor: mongoose.Types.ObjectId(vendorId),
      demand: mongoose.Types.ObjectId(demandId),
      profile: mongoose.Types.ObjectId(profileId),
    },
  });

  await Profile.findByIdAndUpdate(profileId, {
    $set: { workOrderId: data._id },
  });

  await sendNotif(
    user_id,
    'WORK_ORDER_CREATED',
    data._id,
    req.cookies['access_token'],
  );

  res.status(201).json({
    success: true,
    message: 'Work order created',
    // cook: req.cookies['access_token'],
  });
});

/**
 * @desc   Make Changes to work order
 * @route  PUT /api/v2/work-order/:id
 * @access Private
 *
 */

export const addChangesToWorkOrder = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { role } = req.body;

    if (!(role in Roles))
      return next(new ErrorResponse(`No such roles exist`, 400));

    const keyArr = Object.keys(req.body);

    // check if request object is empty or not
    if (!keyArr.length)
      return next(new ErrorResponse(`No field specified for updates`, 400));

    // sanitize input since it cannot be sanitize at route
    // as we dont know what will the name of the key
    keyArr.forEach((f) => {
      req.body[f] = sanitize(req.body[f]);
    });

    const workOrderData = await WorkOrder.findById(id);

    if (!workOrderData)
      return next(new ErrorResponse(`No such work order exists`, 400));

    if (role !== Roles.CLIENT_MANAGER)
      return next(
        new ErrorResponse(
          `Role not authorized to change the work-order Only Client Manager can change work-order details`,
          400,
        ),
      );

    workOrderData.status = WorkOrderStatuses.REVIEW;
    workOrderData.role = Roles.PROJECT_MANAGER;

    workOrderData.data.changes.push({
      ...req.body,
      version: workOrderData.data.changes.length + 1,
    });

    await workOrderData.save();

    await sendNotif(
      req.user.user_id,
      'WORK_ORDER_UPDATED',
      id,
      req.cookies['access_token'],
    );

    res.status(200).json({
      success: true,
      message: 'Work order has been updated',
    });
  },
);

/**
 * @desc   Get all work order of a client
 * @route  GET /api/v2/work-order
 * @access Private
 *
 */

export const getAllWorkOrderData = asyncHandler(
  async (req, res: Response, next: NextFunction) => {
    const { clientId } = req.params;

    // console.log(req.user.user_id);

    const workOrderData: any = await WorkOrder.find({
      'data.client': mongoose.Types.ObjectId(clientId),
    })
      .populate('data.client')
      .populate('data.vendor');

    res.status(200).json({
      success: true,
      message: 'All work order data has been fetched',
      workOrderData,
    });
  },
);

export const checkIfWorkOrderExists = asyncHandler(async (req, res, next) => {
  const { profileIdArr } = req.body;
  let doesWorkOrderExist;
  const responseArr: any = [];
  for (const profileId of profileIdArr) {
    doesWorkOrderExist = await Profile.findById(profileId).lean();
    responseArr.push({
      profileId: profileId,
      workOrderExists: doesWorkOrderExist.hasOwnProperty('workOrderId'),
    });
  }

  res.status(200).json({
    success: true,
    message: 'Checked for all profileIds',
    data: responseArr,
  });
});

export const getClientCount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { clientId } = req.params;

    const workOrderData: any = await WorkOrder.find({
      'data.client': mongoose.Types.ObjectId(clientId),
    });

    res.status(200).json({
      success: true,
      message: 'All work order data has been fetched',
      count: workOrderData.length,
    });
  },
);

export const getWorkOrderForProfile = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;
  const workOrderData = await WorkOrder.find({
    'data.profile': mongoose.Types.ObjectId(profileId),
  })
    .populate('data.profile')
    .populate('data.client')
    .populate('data.vendor')
    .populate('data.demand');

  workOrderData.forEach((d) => {
    //console.log(d);
    d.data.changes.forEach((c) => {
      d.data = { ...d.data, ...c };
    });
    delete d.data.changes;
    delete d.data['$init'];
  });

  res.status(200).json({
    success: true,
    message: 'All work-orders for a profile fetched',
    workOrderData,
  });
});

/**
 * @desc   Get all work order of a vendor
 * @route  GET /api/v2/work-order
 * @access Private
 *
 */

export const getAllWorkOrderDataOfVendor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { vendorId } = req.params;

    const workOrderData: any = await WorkOrder.find({
      'data.vendor': mongoose.Types.ObjectId(vendorId),
    })
      .populate('data.client')
      .populate('data.vendor');

    res.status(200).json({
      success: true,
      message: 'All work order data has been fetched related to vendor',
      workOrderData,
    });
  },
);

export const getVendorCount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { vendorId } = req.params;

    const workOrderData: any = await WorkOrder.find({
      'data.vendor': mongoose.Types.ObjectId(vendorId),
    });

    res.status(200).json({
      success: true,
      message: 'All work order data has been fetched related to vendor',
      cound: workOrderData.length,
    });
  },
);
/**
 * @desc   Make Changes to status of work order
 * @route  PATCH /api/v2/work-order/status/:id
 * @access Private
 *
 */

export const updateWorkOrderStatus = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { user_id, role } = req.body;

    const { status, suggestion } = req.body;

    if (
      status !== WorkOrderStatuses.APPROVED &&
      status !== WorkOrderStatuses.DROPPED &&
      status !== WorkOrderStatuses.AMEND
    )
      return next(
        new ErrorResponse(
          `Status can either be APPROVED, DROPPED or AMEND`,
          400,
        ),
      );

    const doesWorkOrderExist = await WorkOrder.findById(id);

    if (!doesWorkOrderExist)
      return next(
        new ErrorResponse(`No work order exists for this client`, 400),
      );

    if (doesWorkOrderExist.currentRole !== Roles[role])
      return next(
        new ErrorResponse(`Current role cannot change the status`, 400),
      );

    const nextRole = Roles.getNextRole(role);

    // Expect status to be only approved or rejected
    if (status === WorkOrderStatuses.APPROVED && nextRole !== null) {
      doesWorkOrderExist.currentRole = nextRole;
      doesWorkOrderExist.status = WorkOrderStatuses.REVIEW;

      const roleInitial = Roles.parse(doesWorkOrderExist.currentRole);
      await sendNotif(
        user_id,
        `WORK_ORDER_APPROVED_${roleInitial}`,
        id,
        req.cookies['access_token'],
      );
    } else if (status === WorkOrderStatuses.AMEND && suggestion.length !== 0) {
      doesWorkOrderExist.status = status;
      doesWorkOrderExist.suggestions = [
        {
          ...doesWorkOrderExist.suggestions,
          id: user_id,
          suggestion,
        },
      ];

      await sendNotif(
        user_id,
        'WORK_ORDER_AMENDED',
        id,
        req.cookies['access_token'],
      );
    } else if (status === WorkOrderStatuses.DROPPED) {
      doesWorkOrderExist.status = status;
      const roleInitial = Roles.parse(doesWorkOrderExist.currentRole);
      await sendNotif(
        user_id,
        `WORK_ORDER_REJECTED_${roleInitial}`,
        id,
        req.cookies['access_token'],
      );
    } else {
      doesWorkOrderExist.status = status;
    }

    await doesWorkOrderExist.save();

    res.status(200).json({
      success: true,
      message: 'Status for the requested work order has been updated',
    });
  },
);

/**
 * @desc   Get a work order
 * @route  GET /api/v2/work-order/:workOrderId
 * @access Private
 *
 */
export const getWorkOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { workOrderId } = req.params;

    const workOrder = await WorkOrder.findById(workOrderId)
      .populate('data.client')
      .populate('data.vendor');
    if (workOrder === null)
      return next(
        new ErrorResponse(`No work order exists with the given ID`, 400),
      );

    res.status(200).json({
      success: true,
      message: 'Status for the requested work order has been updated',
      data: workOrder,
    });
  },
);

/**
 * @desc get all work orders for project manager
 * @route GET /api/v2/work-order/pm
 * @access Private
 */

export const getWorkOrderForPM = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  // console.log(req.user);
  const url = `${pmURL}=${user_id}&statuses=ALL`;
  // console.log(req.cookies['access_token']);
  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.cookies['access_token']}`,
    },
  }).then((res) => res.json());

  const allWorkOrderData = [];

  for (const profileData of data.data) {
    const workOrderData = await WorkOrder.find({
      'data.profile': profileData.id,
    })
      .populate('data.client')
      .populate('data.vendor')
      .lean();

    //@ts-ignore
    allWorkOrderData.push(...workOrderData);
  }

  // console.log(allWorkOrderData);

  res.status(200).json({
    message: 'All work orders fetched',
    success: true,
    allWorkOrderData,
  });
});

export const getWorkOrderForEmployee = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  console.log(req.user);
  // const profileData = await Employees.findById(userId);
  res.end();
});
