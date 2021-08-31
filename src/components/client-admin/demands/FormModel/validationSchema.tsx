import * as Yup from 'yup';
import { demandFormModel } from './demandFormModel';
const {
  formField: {
    name,
    // profile_name,
    quantity,
    startDate,
    // expense,
    primary_skills,
    secondary_skills,
    // additional_skills,
    relevant_experience,
    total_experience,
    hours_per_week,
    job_description,
    // duration,
    file,
    location,
    email_enabled,
    endDate,
    // request_id,
    travel_expense_allowance,
    status,
    shift,
    background_check_required,
    employment_type,
  },
} = demandFormModel;

const nameRegex = /^[A-Za-z ]+$/;

export default [
  Yup.object().shape({
    [name.name]: Yup.string()
      .required(`${name.requiredErrorMsg}`)
      .matches(nameRegex, 'Please enter only alphabets'),
    [quantity.name]: Yup.number()
      .min(1)
      .required(`${quantity.requiredErrorMsg}`),
    [startDate.name]: Yup.string().required(`${startDate.requiredErrorMsg}`),
    [endDate.name]: Yup.string().required(`${endDate.requiredErrorMsg}`),
    [location.name]: Yup.string().required(`${location.requiredErrorMsg}`),
    // [duration.name]: Yup.number()
    //   .min(1)
    //   .required(`${duration.requiredErrorMsg}`),
    [hours_per_week.name]: Yup.number()
      .min(1)
      .required(`${hours_per_week.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [primary_skills.name]: Yup.mixed().test((primary_skills) => {
      if (primary_skills.length === 0)
        return new Yup.ValidationError(
          'At least one primary skill required',
          undefined,
          'primary_skills',
        );
      return true;
    }),
    [secondary_skills.name]: Yup.mixed().test((secondary_skills) => {
      if (secondary_skills.length === 0)
        return new Yup.ValidationError(
          'At least one secondary skill required',
          undefined,
          'secondary_skills',
        );
      return true;
    }),
    [relevant_experience.name]: Yup.string().required(
      `${relevant_experience.requiredErrorMsg}`,
    ),
    [total_experience.name]: Yup.string().required(
      `${total_experience.requiredErrorMsg}`,
    ),
  }),
  Yup.object().shape({
    [job_description.name]: Yup.string().required(
      `${job_description.requiredErrorMsg}`,
    ),
    [file.name]: Yup.mixed()
      .test((file) => {
        if (!file) {
          return new Yup.ValidationError('File required', undefined, 'file');
        }
        return true;
      })
      .required(`${file.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    // [request_id.name]: Yup.string().required(`${request_id.requiredErrorMsg}`),

    [email_enabled.name]: Yup.string().required(
      `${email_enabled.requiredErrorMsg}`,
    ),

    [status.name]: Yup.string().required(`${status.requiredErrorMsg}`),
    [location.name]: Yup.string().required(`${location.requiredErrorMsg}`),
    [shift.name]: Yup.string().required(`${shift.requiredErrorMsg}`),
    [background_check_required.name]: Yup.string().required(
      `${background_check_required.requiredErrorMsg}`,
    ),
    [employment_type.name]: Yup.string().required(
      `${employment_type.requiredErrorMsg}`,
    ),
  }),
  Yup.object().shape({}),
];
