import { HttpClient } from '../../utils/op-http-client';
import {
  DemandDataType,
  InterviewSlotInformationType,
  ProfileDataType,
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
} from '../../types/response-types/vendor-admin/demand';
import { PMInterviewApiService } from '../project-manager/pm-interview-api-service';
import { FetchInterviewProfilesResponseType } from 'src/types/response-types/project-manager/demand';
import { saveAs } from 'file-saver';

export class VAApiService {
  constructor(
    private httpClient: HttpClient,
    private vendorId: string,
    private demandId?: string,
    private recruitmentId?: string,
  ) {}

  // Fetch demand details for a particular ID
  fetchDemandDetails = async (): Promise<
    { demand: DemandDataType; recruitmentId: string } | undefined
  > => {
    console.log('Demand ID', this.demandId);
    console.log('Vendor ID', this.vendorId);
    const res = await this.httpClient.get<DemandDetailsResponseType>(
      `/apis/v1/demand/${this.demandId}/vendor/${this.vendorId}`,
    );
    console.log(res);
    if (isException(res)) {
      OPToast.show('Error fetching Demand Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return;
    }
    const { demand, recruitment } = res.data;
    return {
      demand,
      recruitmentId: recruitment.id,
    };
  };

  // Fetch profiles
  fetchProfiles = async (): Promise<ProfileDetailsDataType[] | undefined> => {
    const res = await this.httpClient.get<FetchDemandProfilesResponseType>(
      `/apis/v1/demand/recruitment/${this.recruitmentId}/profile`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching profiles', {
        variant: ToastVariant.ERROR,
      });
      return;
    }
    for (const profile of res.data) {
      if (profile.interview_slots) {
        // @ts-ignore
        profile.interviewSlotsArr = [...Object.values(profile.interview_slots)];
      }
      if (profile.interview_rounds) {
        // @ts-ignore
        profile.interviewRoundsArr = [
          ...Object.values(profile.interview_rounds),
        ];
      }
      for (const slot of profile.interviewSlotsArr) {
        for (const round of profile.interviewRoundsArr) {
          if (slot.round === round.round) {
            slot.selectedSlotId = round.slot_id;
          }
        }
      }
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
