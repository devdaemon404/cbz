import * as Yup from 'yup';
import moment from 'moment';
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
    estimatedTotalSpend,
    allowExpenses,
    cvLink,
    rate,
  },
} = workorderFormModel;

const nameRegex = /^[A-Za-z ]+$/;

const currencies = ['INR', 'USD', 'EUR'];
const _rate = ['per_hour', 'per_month'];

export default Yup.object().shape({
  [requestedResource.name]: Yup.string().required(`This field is required`),
  // .matches(nameRegex, 'Please enter only alphabets'),
  // [workId.name]: Yup.string().required(`This field is required`),
  [officialEmail.name]: Yup.string()
    .email('Not a valid email')
    .required(`This field is required`),
  [posId.name]: Yup.string().required(`This field is required`),
  [posReportsTo.name]: Yup.string().required(`This field is required`),
  [posTitle.name]: Yup.string().required(`This field is required`),
  [rateType.name]: Yup.number()
    .typeError('Must be a number')
    .required(`This field is required`),
  [rate.name]: Yup.string().oneOf(_rate).required(''),
  [currency.name]: Yup.string()
    .oneOf(currencies)
    .required(`This field is required`),
  [startDate.name]: Yup.string().required(`This field is required`),
  [endDate.name]: Yup.string().required(`This field is required`),
  // [duration.name]: Yup.string().required(`This field is required`),
  [jobType.name]: Yup.string().required(`This field is required`),
  [estimatedTotalSpend.name]: Yup.string(),
  [estimatedRemainingBudget.name]: Yup.string(),
  [assignmentDesc.name]: Yup.string(),
  [cvLink.name]: Yup.string(),
  [allowExpenses.name]: Yup.string(),
});
