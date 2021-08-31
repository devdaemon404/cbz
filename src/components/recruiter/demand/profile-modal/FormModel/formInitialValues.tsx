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

export default {
  [firstname.name]: '',
  [lastname.name]: '',
  [email.name]: '',
  [location.name]: '',
  [mobile.name]: '',
  [experience.name]: '',
  // [profileStatus.name]: '',
  [notice_period.name]: '',
  [interview_date_time.name]: new Date(),
  [rate_currency.name]: 'INR',
  [rate.name]: '',
  // [currentCTC.name]: '',
  [doj.name]: new Date(),
  [file.name]: undefined,
};
