import React, { useEffect, useState } from 'react';
import CADemandContext, { CADemandContextDataType } from './ca-demand-context';
import { CADemandContextDefault } from './ca-demand-context';
import { OPHttpClient } from 'src/utils/op-http-client';
import { CADemandApiService } from 'src/apis/client-admin/ca-demands-api-service';
import {
  DemandDataType,
  ProfileDataType,
} from 'src/types/project-manager/demand';
import { CreateDemandRequestType } from 'src/types/response-types/project-manager/demand';
import validator from 'validator';
import moment from 'moment';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import OPLoader from 'src/components/common/OPLoader';

const CADemandState = (props) => {
  // console.log({ props });
  const projectId = props.projectId;
  // instantiate api service
  const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in', {
    action: 'Project Manager Demand Management',
  });

  const httpsClient = OPHttpClient.init('', {
    action: 'Demand Management',
  });

  const apiService = new CADemandApiService(httpClient);
  const apiServices = new CADemandApiService(httpsClient);
  // for loading indicator()
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // all demands
  const [demands, setDemands] = useState<DemandDataType[]>(
    CADemandContextDefault.demands,
  );
  // const [demandsForProject, setDemandsForProject] = useState(
  //   CADemandContextDefault.demands,
  // );
  const [editDemandModalOpened, setEditDemandModalOpened] = useState<boolean>(
    false,
  );

  const [currentDemandId, setCurrentDemandId] = useState<string>();

  const [currentDemand, setCurrentDemand] = useState<DemandDataType>(
    CADemandContextDefault.currentDemand,
  );

  // demand info state
  const [demandInfo, setDemandInfo] = useState<CreateDemandRequestType>(
    CADemandContextDefault.demandInfo,
  );

  // Profile Info State
  const [profiles, setProfiles] = useState(CADemandContextDefault.profiles);

  // checking validation for form fields
  const [validation, setValidation] = useState(
    CADemandContextDefault.validation,
  );

  // disable the next botton if there's an error
  const [disabled, setDisabled] = useState<boolean>(
    CADemandContextDefault.disabled,
  );

  // file state
  const [file, setFile] = useState(CADemandContextDefault.file);
  const [fileName, setFileName] = useState(CADemandContextDefault.fileName);

  // file loading and success indicator
  const [success, setSuccess] = useState(CADemandContextDefault.success);
  const [loading, setLoading] = useState(CADemandContextDefault.loading);

  const [initialModalValues, setInitialModalValues] = useState(
    CADemandContextDefault.initialModalValues,
  );

  // Demand shared or not
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const [editMode, setEditMode] = useState(false);

  const updateDemandList = async () => {
    setIsLoading(true);
    const res = await apiService.fetchDemandsForProject(projectId);

    let demands: DemandDataType[] = [];
    if (res)
      demands = res.map((demand) => {
        if (!demand.skills.relevant_experience) {
          demand.skills.relevant_experience = 0;
        }
        if (!demand.skills.total_experience) {
          demand.skills.total_experience = 0;
        }
        return demand;
      });
    setDemands([...demands]);
    console.log('Update demand list', res);
    setIsLoading(false);
  };

  // fetch all demands
  useEffect(() => {
    // updateDemandList();
    setCurrentDemandId(props.demandId);
  }, []);

  const handleDateChange = (date) => {
    const selectedDate = moment(date).format('YYYY-MM-DD');
    setDemandInfo({ ...demandInfo, startDate: selectedDate });
  };

  const getDemandsForProject = async () => {
    setIsLoading(true);
    const res = await apiService.fetchDemandsForProject(projectId);
    console.log('Response from server: ', res);

    let demands: DemandDataType[] = [];
    if (res)
      demands = res.map((demand) => {
        if (!demand.skills.relevant_experience) {
          demand.skills.relevant_experience = 0;
        }
        if (!demand.skills.total_experience) {
          demand.skills.total_experience = 0;
        }
        return demand;
      });
    setDemands([...demands]);
    setIsLoading(false);
  };

  const sendAdditionalData = async (values) => {
    setIsLoading(true);
    const demandId = demands[demands.length - 1].id;
    await apiService.sendAdditionalData(values, demandId);
    setIsLoading(false);
  };

  const getDemandData = async (demandId) => {
    setIsLoading(true);
    const res = await apiService.fetchDemandData(demandId);
    console.log('Response from server: ', res);
    if (res) {
      if (!res.skills.relevant_experience) {
        res.skills.relevant_experience = 0;
      }
      if (!res.skills.total_experience) {
        res.skills.total_experience = 0;
      }
      setCurrentDemand({ ...res });
    }
    setIsLoading(false);
  };

  // updating a demand status

  const updateDemandStatus = async (id: string, status: string | unknown) => {
    console.log('ID and STATUS', id, status);
    const tempStatus = String(status);
    const tempDemand = demands.map((demand) =>
      demand.id === id ? { ...demand, status: tempStatus } : demand,
    );

    console.log('TEMP DEMAND', tempDemand);

    setDemands([...tempDemand]);

    setIsLoading(true);
    const data = tempDemand.find((demand) => demand.id === id);
    console.log('Edit Demand Data', data);
    //@ts-ignore
    if (data) await apiService.updateDemand(id, data, file);
    const res = await apiService.fetchDemandsForProject(projectId);
    if (res) setDemands([...res]);
    console.log('Demands for project: ', res);
    setIsLoading(false);
  };

  // creating a demand
  const handleDemandFormSubmission = async (values) => {
    setIsLoading(true);
    const demandInfo = {
      name: values.name,
      quantity: values.quantity,
      startDate: moment(values.startDate).format('YYYY-MM-DD'),
      endDate: moment(values.endDate).format('YYYY-MM-DD'),
      // duration: values.duration,
      duration: Math.round(
        moment(new Date(values.endDate)).diff(
          new Date(values.startDate),
          'months',
          true,
        ),
      ),
      expense: '0',
      skills: {
        primary_skills: values.primary_skills,
        secondary_skills: values.secondary_skills,
        additional_skills: ['no data'],
        relevant_experience: values.relevant_experience,
        total_experience: values.total_experience,
      },
      profile_name: 'something',
      hours_per_week: values.hours_per_week,
      po_number: '',
      job_description: values.job_description,
      location: values.location,
      // jd_file_name: '',
      additional_info: {
        request_id: values.request_id,
        email_enabled: values.email_enabled === 'true' ? true : false,
        team_member_info_access: values.team_member_info_access,
        travel_expense_allowance: values.travel_expense_allowance,
        additional_supplier_info: values.additional_supplier_info,
        justification: values.justification,
        shift: values.shift,
        background_check_required:
          values.background_check_required === 'true' ? true : false,
        employment_type: values.employment_type,
      },
      status: values.status,
    };

    console.log('Demand Info and Project Id: ', demandInfo, projectId);
    await apiService.createDemand(demandInfo, values.file, projectId);
    const res = await apiService.fetchDemandsForProject(projectId);
    console.log('Fetch all demands response: ', res);
    if (res) setDemands([...res]);
    // setDemandInfo(DemandContextDefaultValue.demandInfo);
    clearDemandFields();
    setInitialModalValues(CADemandContextDefault.initialModalValues);
    setIsLoading(false);
  };

  /**
   * Demand Information states and functions
   *
   *
   */

  const setDisabledButtonFalse = () => {
    const validationArray = Object.keys(validation);
    let _error = false;
    validationArray.map((name) => {
      if (validation[name].error) {
        _error = true;
      }
    });

    if (_error === false) setDisabled(false);
  };

  // demand info onchange handler
  const handleDemandInfoChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name === 'name' || name === 'profile_name') {
      if (value === '') {
        console.log('value is empty');
      } else if (!value.match(/^[a-zA-Z ]+$/)) {
        console.log('inside', value);
        OPToast.show(`Only alphabets are allowed`, {
          variant: ToastVariant.INFO,
          duration: 1000,
        });
        return;
      } else {
        console.log('else', value);
      }
    }
    // tslint:disable-next-line:radix

    if (!value) {
      await setDemandInfo({
        ...demandInfo,
        [name]: value,
      });
      await setValidation({
        ...validation,
        [name]: {
          ...validation[name],
          fieldName: name,
          helperText: `This field cannot be empty.`,
          error: true,
        },
      });
      await setDisabled(true);
    } else if (type === 'number') {
      const numValue = parseInt(value);
      if (numValue < 0) {
        console.log('Inside a invalid number field');
        await setDemandInfo({
          ...demandInfo,
          [name]: numValue,
        });
        await setValidation({
          ...validation,
          [name]: {
            ...validation[name],
            fieldName: name,
            helperText: `Please enter a valid number for ${name}`,
            error: true,
          },
        });
        await setDisabled(true);
      } else if (numValue > 168 && name === 'hours_per_week') {
        await setDemandInfo({
          ...demandInfo,
          [name]: numValue,
        });
        await setValidation({
          ...validation,
          [name]: {
            ...validation[name],
            fieldName: name,
            helperText: `Hours per week should not be greater than 168`,
            error: true,
          },
        });
        await setDisabled(true);
      } else {
        await setDemandInfo({
          ...demandInfo,
          [name]: numValue,
        });
        await setValidation({
          ...validation,
          [name]: {
            ...validation[name],
            fieldName: name,
            helperText: '',
            error: false,
          },
        });
      }
      await setDisabledButtonFalse();
    } else {
      await setDemandInfo({
        ...demandInfo,
        [name]: value,
      });
      await setValidation({
        ...validation,
        [name]: {
          ...validation[name],
          fieldName: name,
          helperText: '',
          error: false,
        },
      });
      await setDisabledButtonFalse();
    }
    // console.log(isError());
  };

  // Handle demand skills on change
  const handleSkillsOnChange = async (_skills: string[], level: number) => {
    switch (level) {
      case 2:
        console.log({ _skills });
        await setDemandInfo({
          ...demandInfo,
          skills: { ...demandInfo.skills, primary_skills: _skills },
        });
        break;
      case 1:
        await setDemandInfo({
          ...demandInfo,
          skills: { ...demandInfo.skills, secondary_skills: _skills },
        });
        break;
      case 0:
        await setDemandInfo({
          ...demandInfo,
          skills: { ...demandInfo.skills, additional_skills: _skills },
        });
        break;
    }
  };

  // // Handle experience on change for demand
  // const handleExperienceChange = async (
  //   e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  // ) => {
  //   const name = e.target.name;
  //   // tslint:disable-next-line:radix
  //   const length = e.target.value.length;
  //   const value = parseInt(e.target.value);
  //   if (length == 0) {
  //     await setDemandInfo({
  //       ...demandInfo,
  //       skills: {
  //         ...demandInfo.skills,
  //         [name]: value,
  //       },
  //     });
  //     await setValidation({
  //       ...validation,
  //       [name]: {
  //         ...validation[name],
  //         fieldName: name,
  //         helperText: 'This field cannot be empty.',
  //         error: true,
  //       },
  //     });
  //     console.log(validation);
  //   } else if (value < 0 || value > 50) {
  //     await setDemandInfo({
  //       ...demandInfo,
  //       skills: {
  //         ...demandInfo.skills,
  //         [name]: value,
  //       },
  //     });
  //     await setValidation({
  //       ...validation,
  //       [name]: {
  //         ...validation[name],
  //         fieldName: name,
  //         helperText: `Please enter a valid number for ${name
  //           .split('_')
  //           .join(' ')} (less than 51)`,
  //         error: true,
  //       },
  //     });
  //     console.log(validation);
  //   } else {
  //     await setDemandInfo({
  //       ...demandInfo,
  //       skills: {
  //         ...demandInfo.skills,
  //         [name]: value,
  //       },
  //     });
  //     await setValidation({
  //       ...validation,
  //       [name]: {
  //         ...validation[name],
  //         fieldName: name,
  //         helperText: '',
  //         error: false,
  //       },
  //     });
  //   }
  // };

  // Handle experience on change for demand
  const handleExperienceChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const name = e.target.name;
    // tslint:disable-next-line:radix
    const value = parseInt(e.target.value);
    setDemandInfo({
      ...demandInfo,
      skills: {
        ...demandInfo.skills,
        [name]: value,
      },
    });
  };

  const updateProfileStatus = async (
    profile: ProfileDataType,
    status: string,
    demandId: string,
  ) => {
    const _demandId = currentDemandId ? currentDemandId : demandId;
    setIsLoading(true);
    await apiService.changeProfileStatus(profile.id, {
      status,
      profileRecruitmentId: profile.recruitment_id,
      note: 'Status changed',
    });
    await getAllProfilesForDemand(_demandId);

    setIsLoading(false);
  };

  /**
   * System access file handler states and function
   *
   *
   */

  // File handle function
  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setLoading(true);
    setFile(e.target.files![0]);
    setFileName(e.target.files![0].name);
    setSuccess(true);
    setLoading(false);
  };

  // Set the current demand in the state to be edited
  const setEditableDemand = (demand) => {
    setCurrentDemandId(demand.id);
    setInitialModalValues({
      ...initialModalValues,
      name: demand.name,
      quantity: demand.quantity,
      startDate: moment(demand.startDate).format('YYYY-MM-DD'),
      endDate: moment(demand.endDate).format('YYYY-MM-DD'),
      duration: demand.duration,
      expense: demand.expense,
      primary_skills: demand.skills.primary_skills,
      secondary_skills: demand.skills.secondary_skills,
      additional_skills: demand.skills.additional_skills,
      status: demand.status,
      request_id: demand.request_id,
      location: demand.location,
      relevant_experience: demand.skills.relevant_experience,
      total_experience: demand.skills.total_experience,
      profile_name: demand.profile_name,
      hours_per_week: demand.hours_per_week,
      po_number: '',
      job_description: demand.job_description,
      jd_file_name: '',
      file: {
        name: demand.jd_file_name,
      },
      email_enabled: demand.additional_info
        ? demand.additional_info.email_enabled
        : 'false',
    });
    // setDemandInfo(demand);
  };

  // Submitting the Edit Demand Modal
  const editDemandOnSubmit = async (values) => {
    setIsLoading(true);
    const demandInfo = {
      name: values.name,
      quantity: values.quantity,
      startDate: moment(values.startDate).format('YYYY-MM-DD'),
      endDate: moment(values.endDate).format('YYYY-MM-DD'),

      duration: values.duration,
      expense: values.expense,
      skills: {
        primary_skills: values.primary_skills,
        secondary_skills: values.secondary_skills,
        additional_skills: [''],
        relevant_experience: values.relevant_experience,
        total_experience: values.total_experience,
      },
      profile_name: values.profile_name,
      hours_per_week: values.hours_per_week,
      po_number: '',
      job_description: values.job_description,
      jd_file_name: '',
      additional_info: {
        email_enabled: values.email_enabled,
        team_member_info_access: values.team_member_info_access,
        travel_expense_allowance: values.travel_expense_allowance,
        additional_supplier_info: values.additional_supplier_info,
        justification: values.justification,
        shift: values.shift,
        background_check_required: values.background_check_required,
        employment_type: values.employment_type,
      },
    };
    await apiService.updateDemand(
      currentDemandId ?? '',
      demandInfo,
      values.file.type ? values.file : undefined,
    );
    await updateDemandList();
    setIsLoading(false);
    clearDemandFields();
  };

  // Get all profiles for a demand
  const getAllProfilesForDemand = async (demandId: string) => {
    setIsLoading(true);
    console.log('ID', demandId);
    if (demandId) await setCurrentDemandId(demandId);
    const cDemandId = currentDemandId ? currentDemandId : demandId;
    const res = await apiService.fetchProfiles(cDemandId);
    if (res) setProfiles([...res]);
    console.log('PROFILES', res);
    setIsLoading(false);
  };

  // Get vendors
  const [vendors, setVendors] = useState([]);
  const getVendors = async (clientid) => {
    const res = await apiService.getVendors(props?.clientId);
    if (res) setProfiles([...res]);
    console.log('Vendors', res);
    setIsLoading(false);
    setVendors(res.data);
    return res;
  };

  // Delete a particular demand
  const deleteDemand = async (demandId: string) => {
    setIsLoading(true);
    await apiService.deleteDemand(demandId);
    const res = await apiService.fetchDemandsForProject(projectId);
    if (res) setDemands([...res]);
    setIsLoading(false);
  };

  const clearDemandFields = () => {
    setDemandInfo(CADemandContextDefault.demandInfo);
    setFile(CADemandContextDefault.file);
    setFileName(CADemandContextDefault.fileName);
    setSuccess(false);
    setLoading(false);
    clearValidations();
  };

  const clearValidations = () => {
    setValidation(CADemandContextDefault.validation);
  };

  const checkData = (): boolean => {
    console.log('***Demand Info***', demandInfo);
    if (demandInfo.duration == 0) {
      OPToast.show(`Enter duration greater than 0`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    // if (demandInfo.expense === '0') {
    //   OPToast.show(`Please enter expense`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }
    if (demandInfo.hours_per_week <= 1 || demandInfo.hours_per_week > 168) {
      OPToast.show(`Hours per week should be between 1 and 168`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    if (!file && demandInfo.jd_file_name?.trim().length === 0) {
      console.log(demandInfo.jd_file_name);
      OPToast.show(`Please upload a file.`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    if (demandInfo.job_description.trim().length === 0) {
      OPToast.show(`Please enter a description`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    if (demandInfo.name.trim().length === 0) {
      OPToast.show(`Please enter name.`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    // if (demandInfo.po_number.trim().length === 0) {
    //   OPToast.show(`Please enter PO number.`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }
    if (demandInfo.profile_name.trim().length === 0) {
      OPToast.show(`Please enter profile name.`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    if (demandInfo.quantity <= 0) {
      OPToast.show(`Please enter quantity greater than 0`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    // if (demandInfo.skills.total_experience === 0) {
    //   OPToast.show(`Please enter total experience`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }
    // if (demandInfo.skills.relevant_experience === 0) {
    //   OPToast.show(`Please enter relevant experience`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }
    if (demandInfo.skills.additional_skills.length === 0) {
      OPToast.show(`Please enter atleast one additional skill`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    if (demandInfo.skills.primary_skills.length === 0) {
      OPToast.show(`Please enter atleast one primary skill`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    if (demandInfo.skills.secondary_skills.length === 0) {
      OPToast.show(`Please enter atleast one secondary skill`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }
    return true;
  };

  const handleDemandShare = async (demandId: string, vendor_ids: string[]) => {
    setIsLoading(true);
    let body = JSON.stringify({
      vendor_ids,
    });
    const res = await apiService.shareDemand(demandId, body);
    if (res) setShareSuccess(res);
    setIsLoading(false);
  };

  const addRequestIdToDemand = async (demandId: string) => {
    setIsLoading(true);
    const body = JSON.stringify({
      demandId,
      clientId: props.clientId,
    });
    await apiServices.addRequestIdToDemand(body);
    const res = await apiService.fetchDemandsForProject(projectId);
    console.log('Fetch all demands response: ', res);
    if (res) setDemands([...res]);

    setIsLoading(false);
  };

  return (
    <CADemandContext.Provider
      value={{
        demands,
        getDemandsForProject,
        // demandsForProject,
        getDemandData,
        currentDemand,
        handleDateChange,
        profiles,
        demandInfo,
        validation,
        disabled,
        file,
        fileName,
        loading,
        success,
        editDemandModalOpened,
        setEditDemandModalOpened,
        isLoading,
        setDemandInfo,
        updateDemandStatus,
        handleFileOnChange,
        handleDemandInfoChange,
        handleSkillsOnChange,
        handleExperienceChange,
        handleDemandFormSubmission,
        setEditableDemand,
        editDemandOnSubmit,
        getAllProfilesForDemand,
        clearDemandFields,
        updateProfileStatus,
        deleteDemand,
        checkData,
        initialModalValues,
        setInitialModalValues,
        editMode,
        setEditMode,
        handleDemandShare,
        shareSuccess,
        addRequestIdToDemand,
        sendAdditionalData,
        // @ts-ignore
        getVendors,
      }}>
      <OPLoader isLoading={isLoading} />

      {props.children}
    </CADemandContext.Provider>
  );
};

export default CADemandState;
