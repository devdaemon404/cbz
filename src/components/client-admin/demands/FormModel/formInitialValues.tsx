import { demandFormModel } from './demandFormModel';
const {
  formField: {
    name,
    // profile_name,
    quantity,
    startDate,
    endDate,
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
    email_enabled,
    // request_id,
    status,
    location,
    shift,
    background_check_required,
    employment_type,
  },
} = demandFormModel;

// {"email_enabled":"false","team_member_info_access":"true","travel_expense_allowance":"2","status":"2","justification":"2","shift":"2","background_check_required":"false","employment_type":"PART_TIME"}
export default {
  [name.name]: '',
  // [profile_name.name]: '',
  [quantity.name]: 0,
  [startDate.name]: new Date(),
  [endDate.name]: new Date(),
  // [expense.name]: 0,
  // [duration.name]: 0,
  [primary_skills.name]: [],
  [secondary_skills.name]: [],
  // [additional_skills.name]: [],
  [relevant_experience.name]: 0,
  [total_experience.name]: 0,
  [hours_per_week.name]: 0,
  [job_description.name]: '',
  [file.name]: undefined,
  [email_enabled.name]: 'false',
  // [request_id.name]: '',
  [status.name]: 'OPEN',
  [location.name]: '',
  [shift.name]: 'ROTATION_SHIFT',
  [background_check_required.name]: 'false',
  [employment_type.name]: 'FULL_TIME',
};
