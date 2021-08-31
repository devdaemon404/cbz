import * as Yup from 'yup';
import { manageClientFormModal } from './manageClientFormModel';
const {
  formField: {
    firstName,
    lastName,
    username,
    mobile,
    currency,
    system_fees,
    name,
    client_fees,
  },
} = manageClientFormModal;

const phoneNumberRegex = /^[6-9]\d{9}$/;
const nameRegex = /^[A-Za-z ]+$/;
const number = /^[0-9]+$/;

const currencies = ['INR', 'USD', 'EUR'];

export default Yup.object().shape({
  [firstName.name]: Yup.string()
    .required(`${firstName.requiredErrorMsg}`)
    .matches(nameRegex, 'Please enter only alphabets'),
  [lastName.name]: Yup.string()
    .required(`${lastName.requiredErrorMsg}`)
    .matches(nameRegex, 'Please enter only alphabets'),
  [username.name]: Yup.string()
    .email('Email invalid')
    .required(`${username.requiredErrorMsg}`),
  [currency.name]: Yup.string()
    .oneOf(currencies)
    .required(`${currency.requiredErrorMsg}`),
  [mobile.name]: Yup.string()
    .required(`${mobile.requiredErrorMsg}`)
    .matches(phoneNumberRegex, 'Phone number is not valid'),
  [name.name]: Yup.string()
    .min(6, 'Minimum 6 charatcer needed')
    .max(100, 'Maximum 100 character allowed')
    .required(`${name.requiredErrorMsg}`),
  [system_fees.name]: Yup.string()
    .required(`${system_fees.requiredErrorMsg}`)
    .matches(number, 'Only numbers are allowed'),
  [client_fees.name]: Yup.string()
    .required(`${client_fees.requiredErrorMsg}`)
    .matches(number, 'Only numbers are allowed'),
});
