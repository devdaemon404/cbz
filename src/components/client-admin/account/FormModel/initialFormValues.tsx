import { accountFormModel } from './accountFormModel';
const {
  formField: {
    salutation,
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
    o_address_line_2,
    o_address_line_3,
    o_country,
    o_town_city,
    o_pin_code,
    a_address_line_1,
    a_address_line_2,
    a_address_line_3,
    a_country,
    a_pin_code,
    a_town_city,
    b_address_line_1,
    b_address_line_2,
    b_address_line_3,
    b_country,
    b_pin_code,
    b_town_city,
  },
} = accountFormModel;

export default {
  [salutation.name]: 'MR',
  [firstname.name]: '',
  [lastname.name]: '',
  [designation.name]: '',
  [official_email.name]: '',
  [critical_email.name]: '',
  [primary_phone_number.name]: '',
  [alternate_phone_number_1.name]: '',
  [alternate_phone_number_2.name]: '',
  [organization_name.name]: '',
  [o_address_line_1.name]: '',
  [o_address_line_2.name]: '',
  [o_address_line_3.name]: '',
  [o_town_city.name]: '',
  [o_country.name]: 'INDIA',
  [o_pin_code.name]: '',
  [a_address_line_1.name]: '',
  [a_address_line_2.name]: '',
  [a_address_line_3.name]: '',
  [a_town_city.name]: '',
  [a_country.name]: 'INDIA',
  [a_pin_code.name]: '',
  [b_address_line_1.name]: '',
  [b_address_line_2.name]: '',
  [b_address_line_3.name]: '',
  [b_town_city.name]: '',
  [b_country.name]: 'INDIA',
  [b_pin_code.name]: '',
};
