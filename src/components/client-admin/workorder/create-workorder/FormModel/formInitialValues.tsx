import { workorderFormModel } from './workorderFormModel';
const {
  formField: {
    requestedResource,
    officialEmail,
    // workId,
    posId,
    posReportsTo,
    posTitle,
    rateType,
    currency,
    startDate,
    endDate,
    // duration,
    jobType,
    assignmentDesc,
    estimatedRemainingBudget,
    rate,
    estimatedTotalSpend,
    allowExpenses,
    cvLink,
  },
} = workorderFormModel;

export default {
  [requestedResource.name]: '',
  [officialEmail.name]: '',
  // [workId.name]: '',
  [posId.name]: '',
  [posReportsTo.name]: '',
  [posTitle.name]: '',
  [rateType.name]: '',
  [rate.name]: 'per_hour',
  [currency.name]: 'INR',
  [startDate.name]: new Date(),
  // [duration.name]: '0',
  [endDate.name]: new Date(),
  [jobType.name]: '',
  [assignmentDesc.name]: '',
  [estimatedRemainingBudget.name]: '',
  [estimatedTotalSpend.name]: '',
  [allowExpenses.name]: '',
  [cvLink.name]: '',
};
