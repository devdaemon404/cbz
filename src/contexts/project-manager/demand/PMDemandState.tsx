import React, { useEffect, useState } from 'react';
import PMDemandContext, { PMDemandContextDataType } from './pm-demand-context';
import { PMDemandContextDefault } from './pm-demand-context';
import { OPHttpClient } from '../../../utils/op-http-client';
import { ProjectManagerAPIService } from '../../../apis/project-manager/pm-api-service';
import {
  DemandDataType,
  ProfileDataType,
} from 'src/types/project-manager/demand';
import { CreateDemandRequestType } from '../../../types/response-types/project-manager/demand';
import validator from 'validator';
import moment from 'moment';
import { OPToast, ToastVariant } from 'src/utils/op-toast';

const PMDemandState = (props) => {
  const projectId = props.projectId;
  // instantiate api service
  const httpClient = OPHttpClient.init('https://test.app.cloudsbuzz.in', {
    action: 'Project Manager Demand Management',
  });

  const apiService = new ProjectManagerAPIService(httpClient);
  // for loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // all demands
  const [demands, setDemands] = useState<DemandDataType[]>(
    PMDemandContextDefault.demands,
  );
  // const [demandsForProject, setDemandsForProject] = useState(
  //   PMDemandContextDefault.demands,
  // );

  const [currentDemandId, setCurrentDemandId] = useState<string>();

  const [currentDemand, setCurrentDemand] = useState<DemandDataType>(
    PMDemandContextDefault.currentDemand,
  );

  // demand info state
  const [demandInfo, setDemandInfo] = useState<CreateDemandRequestType>(
    PMDemandContextDefault.demandInfo,
  );

  // Profile Info State
  const [profiles, setProfiles] = useState(PMDemandContextDefault.profiles);

  // checking validation for form fields
  const [validation, setValidation] = useState(
    PMDemandContextDefault.validation,
  );

  // disable the next botton if there's an error
  const [disabled, setDisabled] = useState<boolean>(
    PMDemandContextDefault.disabled,
  );

  // file state
  const [file, setFile] = useState(PMDemandContextDefault.file);
  const [fileName, setFileName] = useState(PMDemandContextDefault.fileName);

  // file loading and success indicator
  const [success, setSuccess] = useState(PMDemandContextDefault.success);
  const [loading, setLoading] = useState(PMDemandContextDefault.loading);

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

  const handleDateChange = (date, name) => {
    const selectedDate = moment(date).format('YYYY-MM-DD');
    if (name === 'startDate') {
      setDemandInfo({ ...demandInfo, startDate: selectedDate });
    } else if (name === 'endDate') {
      setDemandInfo({ ...demandInfo, endDate: selectedDate });
    }
  };

  const getDemandsForProject = async (projectId) => {
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
  const handleDemandFormSubmission = async () => {
    setIsLoading(true);
    console.log('Demand Info and Project Id: ', demandInfo, projectId);
    await apiService.createDemand(demandInfo, file, projectId);
    const res = await apiService.fetchDemandsForProject(projectId);
    console.log('Fetch all demands response: ', res);
    if (res) setDemands([...res]);
    // setDemandInfo(DemandContextDefaultValue.demandInfo);
    clearDemandFields();
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

  // Handle experience on change for demand
  const handleExperienceChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const name = e.target.name;
    // tslint:disable-next-line:radix
    // const value = parseInt(e.target.value);
    setDemandInfo({
      ...demandInfo,
      skills: {
        ...demandInfo.skills,
        [name]: e.target.value,
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
  const setEditableDemand = (demand: CreateDemandRequestType) => {
    setCurrentDemandId(demand.id);
    setDemandInfo(demand);
  };

  // Submitting the Edit Demand Modal
  const editDemandOnSubmit = async () => {
    setIsLoading(true);
    await apiService.updateDemand(currentDemandId ?? '', demandInfo, file);
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

  // Delete a particular demand
  const deleteDemand = async (demandId: string) => {
    setIsLoading(true);
    await apiService.deleteDemand(demandId);
    const res = await apiService.fetchDemandsForProject(projectId);
    if (res) setDemands([...res]);
    setIsLoading(false);
  };

  const clearDemandFields = () => {
    setDemandInfo(PMDemandContextDefault.demandInfo);
    setFile(PMDemandContextDefault.file);
    setFileName(PMDemandContextDefault.fileName);
    setSuccess(false);
    setLoading(false);
    clearValidations();
  };

  const clearValidations = () => {
    setValidation(PMDemandContextDefault.validation);
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
    // if (demandInfo.profile_name.trim().length === 0) {
    //   OPToast.show(`Please enter profile name.`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }
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
    // if (demandInfo.skills.additional_skills.length === 0) {
    //   OPToast.show(`Please enter atleast one additional skill`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }
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

  return (
    <PMDemandContext.Provider
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
        isLoading,
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
      }}>
      {props.children}
    </PMDemandContext.Provider>
  );
};

export default PMDemandState;
