import * as Yup from 'yup';
import moment from 'moment';
import { profileFormModel } from './profileFormModel';
const {
  formField: {
    firstname,
    lastname,
    email,
    location,
    mobile,
    experience,
    // profileStatus,
    notice_period,
    interview_date_time,
    rate_currency,
    rate,
    // currentCTC,
    doj,
    file,
  },
} = profileFormModel;

const phoneNumberRegex = /^[6-9]\d{9}$/;
const nameRegex = /^[A-Za-z ]+$/;

const statuses = [
  'LISTED',
  'INTERESTED',
  'FILTERED',
  'READY_TO_SHARE',
  'INTERVIEW_IN_PROCESS',
];

export default [
  Yup.object().shape({
    [firstname.name]: Yup.string()
      .required(`${firstname.requiredErrorMsg}`)
      .matches(nameRegex, 'Please enter only alphabets'),
    [lastname.name]: Yup.string().required(`${lastname.requiredErrorMsg}`),
    [email.name]: Yup.string()
      .email('Not a valid email')
      .required(`${email.requiredErrorMsg}`),
    [location.name]: Yup.string()
      .nullable()
      .required(`${location.requiredErrorMsg}`),
    [mobile.name]: Yup.string()
      .required(`${mobile.requiredErrorMsg}`)
      .matches(phoneNumberRegex, 'Phone number is not valid'),
    [experience.name]: Yup.string()
      .nullable()
      .required(`${experience.requiredErrorMsg}`),
    // [profileStatus.name]: Yup.string()
    //   .oneOf(statuses, profileStatus.requiredErrorMsg)
    //   .required(`${profileStatus.requiredErrorMsg}`),
    [notice_period.name]: Yup.number()
      .required(`${notice_period.requiredErrorMsg}`)
      .min(1, 'Notice period must be atleast 1 day'),
  }),
  Yup.object().shape({
    [interview_date_time.name]: Yup.string().required(
      `${interview_date_time.requiredErrorMsg}`,
    ),
    [rate_currency.name]: Yup.string().required(
      `${rate_currency.requiredErrorMsg}`,
    ),
    // .matches(visaRegEx, cardNumber.invalidErrorMsg),
    [rate.name]: Yup.string().nullable().required(`${rate.requiredErrorMsg}`),
    // .test('expDate', expiryDate.invalidErrorMsg, (val) => {
    //   if (val) {
    //     const startDate = new Date();
    //     const endDate = new Date(2050, 12, 31);
    //     if (moment(val, moment.ISO_8601).isValid()) {
    //       return moment(val).isBetween(startDate, endDate);
    //     }
    //     return false;
    //   }
    //   return false;
    // }),
    // [currentCTC.name]: Yup.string()
    //   .nullable()
    //   .required(`${currentCTC.requiredErrorMsg}`),
    [doj.name]: Yup.string().required(`${doj.requiredErrorMsg}`),
    [file.name]: Yup.mixed().test((file) => {
      if (!file) {
        return new Yup.ValidationError('File required', undefined, 'file');
      }
      return true;
    }),
    // .required(`${file.requiredErrorMsg}`),
  }),
];
