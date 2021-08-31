import { manageClientFormModal } from './manageClientFormModel';
const {
  formField: {
    firstName,
    lastName,
    username,
    mobile,
    currency,
    system_fees,
    client_fees,
    name,
    enabled,
  },
} = manageClientFormModal;

export default {
  [firstName.name]: '',
  [lastName.name]: '',
  [username.name]: '',
  [mobile.name]: '',
  [currency.name]: 'INR',
  [system_fees.name]: '',
  [client_fees.name]: '',
  [name.name]: '',
  [enabled.name]: true,
};
