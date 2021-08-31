import { HttpClient } from '../../utils/op-http-client';
import {
  DemandDataType,
  InterviewSlotInformationType,
  ProfileDataType,
  VAProfileDataType,
  VendorDemandDataType,
} from '../../types/project-manager/demand';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';
import {
  ComplianceDocumentsType,
  FreezeSlotRequestType,
  ProfileDetailsDataType,
} from '../../types/vendor-admin/demand';
import {
  DemandDetailsResponseType,
  FetchComplianceDocumentResponseType,
  FetchDemandProfilesResponseType,
  FetchVAProfilesResponseType,
  FetchVAProfileResponseType,
  VendorDemandDetailsResponseType,
  RecrutierIdResponseType,
} from '../../types/response-types/vendor-admin/demand';
import { PMInterviewApiService } from '../project-manager/pm-interview-api-service';
import {
  FetchDemandResponseType,
  FetchInterviewProfilesResponseType,
  FetchVendorDemandResponseType,
} from 'src/types/response-types/project-manager/demand';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { file } from 'jszip';
import { profile } from 'winston';
import { RDemandType } from 'src/types/recruiter/demand';
import { FetchRecruiterDemandResponseType } from 'src/types/response-types/recruiter/demand';

export class RDemandApiService {
  constructor(
    private httpClient: HttpClient,
    private vendorId: string,
    private demandId: string,
    private recruitmentId?: string,
    private userId?: string,
  ) {}

  // Fetch all demands for a logged in user
  fetchAllDemands = async (): Promise<RDemandType[] | undefined> => {
    const res = await this.httpClient.get<FetchRecruiterDemandResponseType>(
      `apis/v1/demand/recruitment/list/recruiter/${this.userId}`,
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

  // Fetch all demands for a logged in user
  fetchAllProfiles = async (): Promise<ProfileDataType[] | undefined> => {
    const res = await this.httpClient.get<FetchInterviewProfilesResponseType>(
      `apis/v1/demand/recruitment/${this.recruitmentId}/profile`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching profile. Try again', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      console.log(res.message);
      return;
    }
    return res.data;
  };

  // Fetch demand details for a particular ID
  fetchDemandDetails = async (): Promise<DemandDataType | null> => {
    console.log('Demand ID', this.demandId);
    console.log('Vendor ID', this.vendorId);
    console.log('Recruitment ID', this.recruitmentId);
    const res = await this.httpClient.get<VendorDemandDetailsResponseType>(
      `/apis/v1/demand/${this.demandId}`,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show('Error fetching Demand Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }
    return res.data;
    // return null;
  };

  checkRecruitment = async () => {
    await this.httpClient.post(`apis/v1/demand/${this.demandId}/recruitment`, {
      recruiter_manager_user_id: this.userId,
      vendor_id: this.vendorId,
    });
  };

  // Fetch Recruiter Id
  fetchRecruiterID = async (): Promise<string | null> => {
    const res = await this.httpClient.get<RecrutierIdResponseType>(
      `/apis/v1/demand/recruitment/vendor/${this.vendorId}/demand/${this.demandId}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching Recruiter ID', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }
    return res.data.id;
  };

  // Fetch profiles
  fetchProfiles = async (): Promise<VAProfileDataType[] | undefined> => {
    const res = await this.httpClient.get<FetchVAProfilesResponseType>(
      `/apis/v1/demand/recruitment/${this.recruitmentId}/profile`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching profiles', {
        variant: ToastVariant.ERROR,
      });
      return;
    }
    return res.data;
  };

  // Fetching single profile

  fetchProfile = async (profileId): Promise<VAProfileDataType | undefined> => {
    const res = await this.httpClient.get<FetchVAProfileResponseType>(
      `/apis/v1/demand/profile/${profileId}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching profile', {
        variant: ToastVariant.ERROR,
      });
      return;
    }
    return res.data;
  };

  // Freeze slots for a given profile ID
  freezeSlots = async (data: FreezeSlotRequestType) => {
    const res = await this.httpClient.put(
      `/apis/v1/interview/profile/${data.profileId}/freeze/slot`,
      {
        round: data.roundNumber,
        slot_id: data.slotId,
        round_description: data.roundDescription,
        notes: 'Notes',
      },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  shareProfiles = async (profiles) => {
    const res = await this.httpClient.put(
      `/apis/v1/demand/recruitment/${this.recruitmentId}/share/profiles`,
      {
        recruitment_id: this.recruitmentId,
        profile_ids: profiles,
      },
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  // Freeze slots for a given profile ID
  addProfile = async (data, recruiterId) => {
    console.log('Data inside API', data);
    const profileData = {
      ...data,
      doj: moment(data.doj).format('YYYY-MM-DD'),
      interview_date_time: moment(data.interview_date_time).format(
        'YYYY-MM-DD',
      ),
      rate: parseInt(data.rate),
      recruiter_user_id: this.userId,
      experience: parseInt(data.experience),
      note: 'Notes',
    };

    const formData = new FormData();
    formData.append(
      'profile',
      new Blob([JSON.stringify(profileData)], { type: 'application/json' }),
    );
    formData.append('file', profileData.file);
    profileData.file = undefined;

    const res = await this.httpClient.put(
      `/apis/v1/demand/recruitment/${recruiterId}`,
      // { profile: profileData },
      formData,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  updateProfile = async (data, recruiterId, profileId) => {
    console.log('Data inside API', data);
    const profileData = {
      ...data,
      doj: moment(data.doj).format('YYYY-MM-DD'),
      interview_date_time: moment(data.interview_date_time).format(
        'YYYY-MM-DD',
      ),
      rate: parseInt(data.rate),
      recruiter_user_id: this.userId,
      experience: parseInt(data.experience),
      note: 'Notes',
      profileStatus: undefined,
    };

    const formData = new FormData();
    formData.append(
      'profileRequest',
      new Blob([JSON.stringify(profileData)], { type: 'application/json' }),
    );
    if (profileData.file.type) formData.append('file', profileData.file);
    profileData.file = undefined;

    const res = await this.httpClient.put(
      `apis/v1/demand/recruitment/${recruiterId}/profile/${profileId}`,
      formData,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    OPToast.show(`Successfully Added`, {
      variant: ToastVariant.SUCCESS,
    });
    return true;
  };

  // Fetch the interview rounds for a given Profile ID
  fetchInterviewRounds = async (
    profileId: string,
    profileStatus: string,
  ): Promise<InterviewSlotInformationType[] | null> => {
    const service = new PMInterviewApiService(
      this.httpClient,
      profileId,
      '',
      profileStatus,
    );
    return await service.fetchInterviewRounds();
  };

  getComplianceDocuments = async (
    clientId,
    month,
    year,
  ): Promise<ComplianceDocumentsType[] | null> => {
    const response = await this.httpClient.get<
      FetchComplianceDocumentResponseType
    >(
      `/apis/v1/docs/client/${clientId}/vendor/${this.vendorId}?month=${month}&year=${year}`,
    );
    if (isException(response)) {
      OPToast.show(`${response.message}`, {
        variant: ToastVariant.ERROR,
      });
      return null;
    }
    return response.data;
  };

  submitComplianceDocuments = async (month, year, documentType, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.httpClient.post(
      `apis/v1/docs/${this.vendorId}?document_type=${documentType}&month=${month}&year=${year}`,
      formData,
    );
    if (isException(response)) {
      OPToast.show(`${response.message}`, {
        variant: ToastVariant.ERROR,
      });
    } else {
      OPToast.show(`Successfully Uploaded`, {
        variant: ToastVariant.SUCCESS,
      });
    }
  };

  downloadDocument = async (month, year, doctype) => {
    // const response: any = await this.httpClient.get(
    //   `apis/v1/docs/vendor/${this.vendorId}?document_type=${doctype}&month=${month}&year=${year}`,
    // );
    // window.open(
    //   `http://test.app.cloudsbuzz.in/apis/v1/docs/vendor/${this.vendorId}?document_type=${doctype}&month=${month}&year=${year}`,
    // );
    saveAs(
      `http://test.app.cloudsbuzz.in/apis/v1/docs/vendor/${this.vendorId}?document_type=${doctype}&month=${month}&year=${year}`,
    );
    // if (response) { console.log(response);
    // }
  };
}
