import * as Yup from 'yup';
import { accountFormModel } from './accountFormModel';
const {
  formField: {
    firstname,
    lastname,
    designation,
    official_email,
    critical_email,
    primary_phone_number,
    alternate_phone_number_1,
    alternate_phone_number_2,
    organization_name,
    o_address_line_1,
    o_country,
    o_town_city,
    o_pin_code,
    b_address_line_1,
    b_country,
    b_pin_code,
    b_town_city,
  },
} = accountFormModel;

const phoneNumberRegex = /^[6-9]\d{9}$/;
const nameRegex = /^[A-Za-z ]+$/;

export default Yup.object().shape({
  [firstname.name]: Yup.string()
    .required('Required')
    .matches(nameRegex, 'Please enter only alphabets'),
  [lastname.name]: Yup.string()
    .required('Required')
    .matches(nameRegex, 'Please enter only alphabets'),
  [designation.name]: Yup.string().required(`${designation.requiredErrorMsg}`),
  [organization_name.name]: Yup.string().required(
    `${organization_name.requiredErrorMsg}`,
  ),
  [official_email.name]: Yup.string()
    .email('Email invalid')
    .required('Required'),
  [critical_email.name]: Yup.string().email('Email invalid'),
  [o_address_line_1.name]: Yup.string().required(
    `${o_address_line_1.requiredErrorMsg}`,
  ),
  [o_town_city.name]: Yup.string().required(`${o_town_city.requiredErrorMsg}`),
  [o_pin_code.name]: Yup.string().required(`${o_pin_code.requiredErrorMsg}`),
  [o_country.name]: Yup.string().required(`${o_country.requiredErrorMsg}`),
  [primary_phone_number.name]: Yup.string()
    .required(`${primary_phone_number.requiredErrorMsg}`)
    .matches(phoneNumberRegex, 'Phone number is not valid'),
  [alternate_phone_number_2.name]: Yup.string().matches(
    phoneNumberRegex,
    'Phone number is not valid',
  ),
  [alternate_phone_number_1.name]: Yup.string().matches(
    phoneNumberRegex,
    'Phone number is not valid',
  ),
  [b_address_line_1.name]: Yup.string().required(
    `${b_address_line_1.requiredErrorMsg}`,
  ),
  [b_town_city.name]: Yup.string().required(`${b_town_city.requiredErrorMsg}`),
  [b_pin_code.name]: Yup.string().required(`${b_pin_code.requiredErrorMsg}`),
  [b_country.name]: Yup.string().required(`${b_country.requiredErrorMsg}`),
});
