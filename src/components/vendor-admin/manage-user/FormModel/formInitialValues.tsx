import { manageUserFormModal } from './manageUserFormModel';
const {
  formField: { firstname, lastname, username, email, mobile, role },
} = manageUserFormModal;

export default {
  [firstname.name]: '',
  [lastname.name]: '',
  [email.name]: '',
  [username.name]: '',
  [mobile.name]: '',
  [role.name]: 'SELECT',
};
