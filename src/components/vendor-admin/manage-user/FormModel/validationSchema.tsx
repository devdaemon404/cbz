import * as Yup from 'yup';
import moment from 'moment';
import { manageUserFormModal } from './manageUserFormModel';
const {
  formField: { firstname, lastname, username, email, mobile, role },
} = manageUserFormModal;

const phoneNumberRegex = /^[6-9]\d{9}$/;
const nameRegex = /^[A-Za-z ]+$/;
const usernameRegex = /^[A-Za-z0-9_]+$/;

const roles = ['RC', 'ACC'];

export default Yup.object().shape({
  [firstname.name]: Yup.string()
    .required('Required')
    .matches(nameRegex, 'Please enter only alphabets'),
  [lastname.name]: Yup.string()
    .required('Required')
    .matches(nameRegex, 'Please enter only alphabets'),
  [email.name]: Yup.string().email('Email invalid').required('Required'),
  [username.name]: Yup.string()
    .required('Required')
    .matches(usernameRegex, 'User name is not valid'),
  [role.name]: Yup.string().oneOf(roles).required('Required'),
  [mobile.name]: Yup.string()
    .required(`${mobile.requiredErrorMsg}`)
    .matches(phoneNumberRegex, 'Phone number is not valid'),
});
