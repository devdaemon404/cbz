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

export class ProjectManagerAPIService {
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
      OPToast.show('Error fetching demands. Try again', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
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
      OPToast.show(`Error fetching demands. Try again (${res.message})`, {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
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
      OPToast.show(`Error fetching demands. Try again (${res.message})`, {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
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
    const formData = new FormData();
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

  // fetchAllProjects = async (): Promise<ProjectType[] | null> => {
  //   const res = await this.httpClient.get<FetchAllProjectResponseType>(
  //     `project/client/${this.clientId}/manager/${this.userId}`,
  //   );
  //   if (isException(res)) {
  //     OPToast.show(`${res.message}`, {
  //       variant: ToastVariant.ERROR,
  //     });
  //     return null;
  //   }
  //   return res.data;
  // };

  // Fetch demand details for a particular ID
  fetchDemandDetails = async (
    demandId: string,
  ): Promise<DemandDataType | undefined> => {
    const res = await this.httpClient.get<FetchDemandDetailsResponseType>(
      `/apis/v1/demand/${demandId}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching Demand Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return;
    }
    // console.log(res.data);
    return res.data;
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
    data: CreateDemandRequestType,
    file: File | null,
  ): Promise<boolean> => {
    // console.log({ data });
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
      // `/apis/v1/demand/manager/profiles/detailed/all?manager_user_id=${this.userId}&statuses=INTERVIEW_IN_PROCESS`,
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
}
