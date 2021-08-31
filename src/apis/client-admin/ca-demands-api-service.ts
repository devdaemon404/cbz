/**

 * API Service for all the API's to be made by the Project Manager
 */
import { HttpClient } from '../../utils/op-http-client';
import {
  CreateDemandRequestType,
  FetchAllProjectResponseType,
  FetchDemandDataResponseType,
  FetchDemandDetailsResponseType,
  FetchDemandProfilesResponseType,
  FetchDemandResponseType,
  FetchInterviewProfilesResponseType,
} from '../../types/response-types/project-manager/demand';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import {
  DemandDataType,
  NotificationType,
  ProfileDataType,
} from '../../types/project-manager/demand';
import { ProjectType } from 'src/types/project-manager/timesheet';
import { ToggleButton } from '@material-ui/lab';
import ResponseBaseV1 from 'src/types/response-types/response-base-v1';
import responseBaseV2 from 'src/types/response-types/response-base-v2';
import moment from 'moment';

export class CADemandApiService {
  private clientId;
  private userId;
  constructor(private httpClient: HttpClient) {}
  public setClientId(clientId: string) {
    this.clientId = clientId;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  // Fetch all demands for a logged in user
  fetchAllDemands = async (): Promise<DemandDataType[] | undefined> => {
    const res = await this.httpClient.get<FetchDemandResponseType>(
      '/apis/v1/demand',
    );
    if (isException(res)) {
      OPToast.show('Error fetching demands. Try again');
      return;
    }
    return res.data;
  };

  fetchDemandsForProject = async (
    projectId,
  ): Promise<DemandDataType[] | undefined> => {
    const res = await this.httpClient.get<FetchDemandResponseType>(
      `/apis/v1/project/${projectId}/demands`,
    );

    // const res = await this.httpClient.get<FetchDemandResponseType>(
    //   '/apis/v1/demand',
    // );
    // console.log('response from api: ', res);
    if (isException(res)) {
      OPToast.show(`Error fetching demands. Try again (${res.message})`);
      return;
    }
    return res.data;
  };

  fetchDemandData = async (demandId): Promise<DemandDataType | undefined> => {
    const res = await this.httpClient.get<FetchDemandDataResponseType>(
      `/apis/v1/demand/${demandId}`,
    );

    // console.log('response from api: ', res);
    if (isException(res)) {
      OPToast.show(`Error fetching demands. Try again (${res.message})`);
      return;
    }
    return res.data;
  };

  // Create a new demand for the given Project Manager and project
  createDemand = async (
    data: CreateDemandRequestType,
    file: File | null,
    projectId: string,
  ): Promise<boolean> => {
    data.duration = Math.round(
      moment(new Date(data.endDate)).diff(
        new Date(data.startDate),
        'months',
        true,
      ),
    );
    const formData = new FormData();
    console.log('Data: ', data);
    formData.append(
      'demand',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );
    if (file) formData.append('file', file, file.name);

    // console.log('FormData demand: ', formData.get('demand'));
    // console.log('FormData file: ', formData.get('file'));
    const res = await this.httpClient.post(
      `/apis/v1/demand?project_id=${projectId}`,
      formData,
    );
    if (isException(res)) {
      // console.log(res);
      OPToast.show('Error Creating Demand. Try Again', {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show('Created Demand Successfully', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  // Get All Projects
  // /apis/v1/project/client/{client_id}/manager/{user_id}

  fetchAllProjectManagers = async (clientId) => {
    const res = await this.httpClient.get(
      `${process.env.V1_API_URL}/apis/v1/${clientId}/user/by/role?roles=PROJECT_MANAGER&show_all=true`,
    );

    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    // @ts-ignore
    return res.data;
  };

  // Fetch demand details for a particular ID
  fetchDemandDetails = async (
    demandId: string,
  ): Promise<DemandDataType | undefined> => {
    const res = await this.httpClient.get<FetchDemandDetailsResponseType>(
      `/apis/v1/demand/${demandId}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching Demand Information');
      return;
    }
    // console.log(res.data);
    return res.data;
  };

  sendAdditionalData = async (body, demand_id) => {
    // const rbody = {
    //   name: 'string',
    //   quantity: 0,
    //   startDate: '2021-07-11',
    //   duration: 0,
    //   expense: 'string',
    //   skills: {
    //     primary_skills: ['string'],
    //     secondary_skills: ['string'],
    //     relevant_experience: 0,
    //     total_experience: 0,
    //     additional_skills: ['string'],
    //   },
    //   enabled: true,
    //   deleted: true,
    //   profile_name: 'string',
    //   hours_per_week: 0,
    //   po_number: 'string',
    //   job_description: 'string',
    //   summary: {
    //     assignments: true,
    //     request_type: 'string',
    //     sub_status: 'string',
    //     geography: 'string',
    //     submitted_on: '2021-07-11',
    //     labor_category: 'string',
    //     procurement_type: 'string',
    //   },
    //   additional_info: {
    //     email_enabled: true,
    //     team_member_info_access: true,
    //     travel_expense_allowance: 'string',
    //     additional_supplier_info: 'string',
    //     justification: 'string',
    //     shift: 'string',
    //     background_check_required: true,
    //     employment_type: 'FULL_TIME',
    //   },
    // };
    const {
      primary_skills,
      secondary_skills,
      additional_skills,
      relevant_experience,
      total_experience,
      email_enabled,
      // request_id,
      background_check_required,
      shift,
      status,
      employment_type,
    } = body;

    // demand = {
    //   name: '',
    //   profile_name: '',
    //   hours_per_week: '',
    //   quantity: '',
    //   expense: '',
    //   duration: '',
    //   startDate: '',
    //   job_description: '',
    //   status: 'OPEN',
    //   skills: {},
    //   summary: {},
    //   additional_info: {},
    // };
    // skills = {
    //   relevant_experience: '',
    //   total_experience: '',
    //   primary_skills: [],
    //   secondary_skills: [],
    //   additional_skills: [],
    // };
    // summary = {
    //   assignments: 'true',
    //   request_type: '',
    //   sub_status: '',
    //   geography: '',
    //   labor_category: '',
    //   procurement_type: '',
    // };
    // additional_info = {
    //   email_enabled: 'true',
    //   team_member_info_access: 'false',
    //   travel_expense_allowance: '',
    //   additional_supplier_info: '',
    //   justification: '',
    //   shift: '',
    //   background_check_required: 'true',
    //   employment_type: '',
    // };

    const newBody = {
      ...body,
      duration: Math.round(
        moment(new Date(body.endDate)).diff(
          new Date(body.startDate),
          'months',
          true,
        ),
      ),
      expense: '2',
      profile_name: 'xxx',
      status: 'OPEN',

      skills: {
        primary_skills,
        secondary_skills,
        relevant_experience,
        total_experience,
        additional_skills: ['xxx'],
      },
      additional_info: {
        email_enabled,
        shift,
        background_check_required,
        status,
        employment_type,
      },
      summary: {
        assignments: 'true',
        request_type: 'xxx',
        sub_status: 'xxx',
        geography: 'xxx',
        labor_category: 'xxx',
        procurement_type: 'xxx',
      },
    };
    let formData: FormData = new FormData();
    formData.append(
      'demand',
      new Blob([JSON.stringify(newBody)], { type: 'application/json' }),
    );
    const res = await this.httpClient.put<ResponseBaseV1>(
      `/apis/v1/demand/summarize/${demand_id}`,
      formData,
    );
    if (isException(res)) {
      OPToast.show('Error Adding Additional Data', {
        variant: ToastVariant.ERROR,
      });
      return false;
    } else {
      OPToast.show('Additional Data Added Successfully', {
        variant: ToastVariant.SUCCESS,
      });
      return true;
    }
  };

  // Update a demand with a given demand ID
  /**
   * TODO
   *
   * file is stored as string on the server
   *
   */
  updateDemand = async (
    demandId: string,
    data: DemandDataType,
    file: File | null,
  ): Promise<boolean> => {
    console.log('DATA TO THE API IS SENT' + { data });
    const formData = new FormData();
    formData.append(
      'demand',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );
    if (file) formData.append('file', file, file.name);

    // console.log({ formData });
    console.log('demandId', demandId);
    const res = await this.httpClient.put(
      `/apis/v1/demand/${demandId}`,
      formData,
    );
    if (isException(res)) {
      // console.log(res.message);
      OPToast.show('Error updating demand. Try again', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return false;
    }
    OPToast.show('Updated Demand Successfully', {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  // Given a demand ID, fetch the list of profiles for the same
  fetchProfiles = async (
    demandId: string,
  ): Promise<ProfileDataType[] | undefined> => {
    const res = await this.httpClient.get<FetchDemandProfilesResponseType>(
      `/apis/v1/demand/${demandId}/profiles`,
    );
    if (isException(res)) {
      return;
    }
    return res.data.profiles;
  };

  // Change the status of a particular profile
  changeProfileStatus = async (
    profileId: string,
    {
      profileRecruitmentId,
      status,
      note,
    }: { profileRecruitmentId: string; status: string; note?: string },
  ): Promise<boolean> => {
    const res = await this.httpClient.put(
      `/apis/v1/demand/recruitment/${profileRecruitmentId}/profile/${profileId}/status`,
      {
        note,
        profileStatus: status,
        vendor_note: false,
      },
    );
    if (isException(res)) {
      OPToast.show('Error updating status', {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  // API Call to fetch profiles which are in process
  // /apis/v1/demand/client/profiles?client_id=${clientId}&statuses=INTERVIEW_IN_PROCESS
  fetchAllOnGoingInterviews = async (): Promise<ProfileDataType[] | null> => {
    const res = await this.httpClient.get<FetchInterviewProfilesResponseType>(
      `/apis/v1/demand/manager/profiles/detailed/all?manager_user_id=${this.userId}&statuses=INTERVIEW_IN_PROCESS`,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      // console.log('MESSAGE', res.message);
      return null;
    }
    return res.data;
  };

  /**
   * Delete a demand
   *
   */
  deleteDemand = async (demandId) => {
    const body = { op: 'toggle', path: 'deleted' };
    const reqData = JSON.stringify(body);
    const res = await this.httpClient.patch<ResponseBaseV1>(
      `/apis/v1/demand/${demandId}`,
      reqData,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show('Demand deleted Successfully', {
        variant: ToastVariant.SUCCESS,
      });
    }
  };

  getVendors = async (Id) => {
    const res = await this.httpClient.get(
      `/apis/v1/client/${Id}/vendors?show_all=true`,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      // console.log('MESSAGE', res.message);
      return null;
    }
    // @ts-ignore
    return res.data;
  };

  shareDemand = async (demandId, body): Promise<boolean> => {
    const res = await this.httpClient.put<ResponseBaseV1>(
      `/apis/v1/demand/${demandId}/workflow/accessibility`,
      body,
    );
    if (isException(res)) {
      OPToast.show('Error Sharing Demand', {
        variant: ToastVariant.ERROR,
      });
      return false;
    } else {
      OPToast.show('Demand Shared Successfully', {
        variant: ToastVariant.SUCCESS,
      });
      return true;
    }
  };

  addRequestIdToDemand = async (body: any) => {
    const res = await this.httpClient.post<responseBaseV2>(
      `/api/v2/demand/requestId`,
      body,
    );
    if (isException(res)) {
      OPToast.show('Error Adding Request ID', {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };
}
