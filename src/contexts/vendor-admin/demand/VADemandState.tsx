import React, { ReactElement, useEffect, useState } from 'react';
import VADemandContext, { vaDemandContextDefault } from './va-demand-context';
import { VAApiService } from '../../../apis/vendor-admin/va-api-service';
import { OPHttpClient } from '../../../utils/op-http-client';
import { Constants } from '../../../utils/constants';
import {
  FreezeSlotRequestType,
  ProfileDetailsDataType,
} from '../../../types/vendor-admin/demand';
import {
  DemandDataType,
  InterviewSlotInformationType,
  ProfileDataType,
  VAProfileDataType,
  VendorDemandDataType,
} from '../../../types/project-manager/demand';
import { PMInterviewApiService } from '../../../apis/project-manager/pm-interview-api-service';
import { VADemandApiService } from 'src/apis/vendor-admin/va-demand-api-service';
import { OPToast, ToastVariant } from 'src/utils/op-toast';

const VADemandState = ({
  vendorId,
  recruitmentId,
  demandId,
  userId,
  children,
}: {
  vendorId: string;
  recruitmentId?: string;
  userId?: string;
  demandId?: string;
  children: ReactElement;
}) => {
  // HTTP Client
  const httpClient = OPHttpClient.init(`${Constants.API_V1_URL}`, {
    action: 'Vendor Admin Demand Management',
  });
  // Show loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const demandApiService = new VADemandApiService(
    httpClient,
    vendorId,
    demandId ? demandId : '',
    recruitmentId ? recruitmentId : '',
    userId ? userId : '',
  );

  // // all demands
  const [demands, setDemands] = useState<VendorDemandDataType[]>(
    vaDemandContextDefault.demands,
  );

  // // all demands
  const [profiles, setProfiles] = useState<VAProfileDataType[]>([]);
  // // current Profile
  const [currentProfile, setCurrentProfile] = useState<
    VAProfileDataType | undefined
  >();

  // demand details
  const [demandData, setDemandData] = useState<DemandDataType>(
    vaDemandContextDefault.demandData,
  );

  const [initialModalValues, setInitialModalValues] = useState(
    vaDemandContextDefault.initialModalValues,
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<string>('');
  const [modalState, setModalState] = useState(
    vaDemandContextDefault.modalState,
  );
  // file state
  const [file, setFile] = useState(vaDemandContextDefault.file);
  const [fileName, setFileName] = useState(vaDemandContextDefault.fileName);

  // file loading and success indicator
  const [success, setSuccess] = useState(vaDemandContextDefault.success);
  const [loading, setLoading] = useState(vaDemandContextDefault.loading);

  // Recruiter ID state
  const [recruiterId, setRecruiterId] = useState<string | null>(null);

  const handleModal = async (open: boolean, mode?: string) => {
    if (open) {
      console.log('Open Modal');
    } else {
      setModalState(vaDemandContextDefault.modalState);
    }

    if (mode) {
      if (mode === 'Create Profile') {
        await setInitialModalValues(vaDemandContextDefault.initialModalValues);
      }
      await setModalMode(mode);
    }
    await setOpenModal(open);
  };

  useEffect(() => {
    console.log('Modal value', openModal);
  }, [openModal]);

  const startCalls = async () => {
    if (demandId) {
      // if (recruitmentId === 'false') await checkRecruitment();
      await fetchProfiles();
      await fetchDemandDetails();
      await fetchRecruiterID();
    } else {
      await getAllDemands();
    }
  };

  // Run on init
  useEffect(() => {
    startCalls();
  }, []);

  const checkRecruitment = async (demandId) => {
    setIsLoading(true);
    await demandApiService.checkRecruitment(demandId);
    await getAllDemands();
    setIsLoading(false);
  };

  // Fetch the profiles associated with the current demand
  const fetchProfiles = async () => {
    setIsLoading(true);
    const res = await demandApiService.fetchProfiles();
    if (res) {
      setProfiles([...res]);
    }
    setIsLoading(false);
  };

  const fetchDemandDetails = async () => {
    setIsLoading(true);
    const res = await demandApiService.fetchDemandDetails();
    console.log('Response from server: ', res);
    if (res) setDemandData(res);
    setIsLoading(false);
  };

  // Fetch Recruiter Details
  const fetchRecruiterID = async () => {
    setIsLoading(true);
    const res = await demandApiService.fetchRecruiterID();
    console.log('Response from server: ', res);
    if (res) setRecruiterId(res);
    setIsLoading(false);
  };

  const getAllDemands = async () => {
    setIsLoading(true);
    const res = await demandApiService.fetchAllDemands();
    console.log('Response from server: ', res);
    if (res) setDemands([...res]);
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setLoading(true);
    setFile(e.target.files![0]);
    setFileName(e.target.files![0].name);
    setSuccess(true);
    setLoading(false);
  };

  const addProfile = async (profile) => {
    const res = await demandApiService.addProfile(profile, recruiterId);
    if (res) {
      await fetchProfiles();
    }
  };

  const updateProfile = async (profile) => {
    if (currentProfile) {
      const res = await demandApiService.updateProfile(
        profile,
        recruiterId,
        currentProfile.id,
      );
      if (res) {
        await fetchProfiles();
      }
    }
  };

  const handleEdit = async (id) => {
    setIsLoading(true);
    const res = await demandApiService.fetchProfile(id);
    console.log('Result of single profile: ', res);
    if (res) {
      await setCurrentProfile(res);
      const initialProfileData = {
        ...initialModalValues,
        firstname: res.firstname,
        lastname: res.lastname,
        experience: res.experience,
        rate: res.rateCard,
        rate_currency: res.rate_currency,
        interview_date_time: res.interview_date_time,
        location: res.location,
        mobile: res.mobile,
        doj: res.doj,
        email: res.email,
        profileStatus: res.profile_status,
        // currentCTC: res.currentCTC,
        notice_period: res.notice_period,
        file: { name: res.profile_file_name },
      };
      await setInitialModalValues(initialProfileData);

      await setIsLoading(false);
      handleModal(true, 'View Profile');
    }
  };

  const shareProfiles = async (selectedProfiles) => {
    setIsLoading(true);

    console.log('profiele befoer: ', selectedProfiles);
    const allSharedProfileIds = profiles
      .filter((p) => p.shared)
      .map((p) => p.id);
    console.log('All shared Profiles: ', allSharedProfileIds);
    selectedProfiles = [...selectedProfiles, ...allSharedProfileIds];
    console.log('Profiles: ', selectedProfiles);
    selectedProfiles = selectedProfiles.filter((v, i, a) => a.indexOf(v) === i);
    console.log('Profiles after: ', selectedProfiles);

    const res = await demandApiService.shareProfiles(selectedProfiles);
    if (res) {
      OPToast.show('Successfully shared profiles', {
        variant: ToastVariant.SUCCESS,
        duration: 2000,
      });
    }
    await fetchProfiles();
    setIsLoading(false);
  };

  return (
    <VADemandContext.Provider
      value={{
        isLoading,
        currentProfile,
        openModal,
        modalMode,
        file,
        fileName,
        loading,
        initialModalValues,
        handleFileChange,
        success,
        handleEdit,
        setOpenModal,
        addProfile,
        updateProfile,
        modalState,
        handleModal,
        demands,
        profiles,
        shareProfiles,
        checkRecruitment,
        demandData,
      }}>
      {children}
    </VADemandContext.Provider>
  );
};

export default VADemandState;
