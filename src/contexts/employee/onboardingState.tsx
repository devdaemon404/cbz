import React, { useState, ChangeEvent, useEffect } from 'react';
import OnboardingContext from './onboardingContext';
import { useRouter } from 'next/router';
import { OnboardingAPIService } from '../../apis/employee/onboarding';
import {
  AcademicInfoType,
  ContactInformationType,
  DocumentDataType,
  FamilyInfoType,
  SkillType,
  WorkHistoryType,
} from '../../types/employee/onboarding';
import { OPHttpClient } from '../../utils/op-http-client';
import { Constants } from '../../utils/constants';
import { OPToast, ToastVariant } from 'src/utils/op-toast';
import saveAs from 'file-saver';
import WorkHistory from 'src/components/employee/onboarding/WorkHistory';

const OnboardingState = (props) => {
  const router = useRouter();
  // For Loading Indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const httpClient = OPHttpClient.init(Constants.API_V2_URL, {
    action: 'Employee Onboarding',
    customHeaders: {
      'x-onboarding-token': router.query.onboardingToken,
    },
  });
  const apiService = new OnboardingAPIService(httpClient);

  useEffect(() => {
    const requiredFiles = [
      'Aadhar / PAN / Passport / Voter ID',
      'Educational Certificates - 10th, 12th, Higher AcademicInfo',
      'Offer Letters of Last 2 Employers',
      'Relieving Letters of the Last 2 Employers',
      'Six Month Pay Slip',
      'Six Month Bank Statement',
      'Affidavit for AcademicInformation / Experience Gap',
      'Passport Size Photo With White Background',
      'Cancelled Check',
    ];
    const tempDocuments: DocumentDataType[] = requiredFiles.map((label) => ({
      files: [],
      s3FileKeys: [],
      documentKey: label,
      label,
    }));
    setContactInfo(props.contactInformation);
    setDocuments([...tempDocuments]);
    if (localStorage.getItem('workHistory')) {
      setWorkHistory(JSON.parse(localStorage.getItem('workHistory') ?? '[]'));
    }
    if (localStorage.getItem('academicInformation')) {
      setAcademicInfo(
        JSON.parse(localStorage.getItem('academicInformation') ?? '[]'),
      );
    }
    if (localStorage.getItem('skills')) {
      setSkills(
        JSON.parse(
          localStorage.getItem('skills') ??
            '{"expert": [], "intermediate": [], "beginner": []}',
        ),
      );
    }
  }, []);

  /**
   * Data and Functions for Document Upload
   */

  // Initial state
  const [documents, setDocuments] = useState<DocumentDataType[]>([]);

  // Add a new document to the list of documents
  const addDocument = (data: DocumentDataType) => {
    const { documentKey } = data;
    const temp = [...documents];
    const index = temp.map((doc) => doc.documentKey).indexOf(documentKey);
    // If the document already exists, replace it
    if (index !== -1) {
      temp.splice(index, 1, data);
      // Else add it
    } else {
      temp.push(data);
    }
    setDocuments([...temp]);
  };

  // Remove a document from an existing list of documents
  const removeDocument = (data: DocumentDataType) => {
    const { documentKey } = data;
    const temp = [...documents];
    const index = temp.map((doc) => doc.documentKey).indexOf(documentKey);
    // If the document already exists, replace it
    if (index !== -1) {
      temp.splice(index, 1);
      // Else error out
    } else {
      console.log('Cannot delete non-existing documents');
    }
  };

  // Upload all the files in a document and update the s3keys for the same
  const uploadDocument = async () => {
    const documentFiles = [...documents];

    for (const document of documentFiles) {
      document.s3FileKeys = [];
      for (const file of document.files) {
        const res = await apiService.uploadFile(file);
        if (res) {
          const {
            data: { fileKey, url },
          } = res;
          await apiService.awsDocumentUpload(url, file);
          document.s3FileKeys.push(fileKey);
        }
      }
    }
    setDocuments([...documentFiles]);
  };

  /**
   * Data and Functions (if any) Related to WorkHistory.tsx
   */

  // state for workHistory work tab form fields
  const blankWorkHistory = {
    companyName: '',
    endDate: new Date().toISOString(),
    jobTitle: '',
    responsibilities: '',
    startDate: new Date().toISOString(),
  };

  const [workHistory, setWorkHistory] = useState<WorkHistoryType[]>([
    {
      ...blankWorkHistory,
    },
  ]);

  // Function to add new workHistory
  const addNewWork = () => {
    setWorkHistory([...workHistory, { ...blankWorkHistory }]);
  };

  const deleteWork = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => {
    workHistory.splice(index, 1);
    setWorkHistory([...workHistory]);
  };

  // Function to handle work field changes
  const handleWorkHistoryOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string,
    i: number,
  ) => {
    const temp = {
      ...workHistory[i],
      [fieldName]: e.target.value,
    };
    const tempArr = [...workHistory];
    tempArr.splice(i, 1, temp);
    setWorkHistory([...tempArr]);
    localStorage.setItem('workHistory', JSON.stringify(tempArr));
  };

  // state for workHistory skill tab form fields
  const [skills, setSkills] = useState<SkillType>({
    expert: [],
    intermediate: [],
    beginner: [],
  });

  // Handle chips on change
  const handleSkillsOnChange = (_skills: string[], level: number) => {
    switch (level) {
      case 2:
        setSkills({ ...skills, expert: [..._skills] });
        break;
      case 1:
        setSkills({ ...skills, intermediate: [..._skills] });
        break;
      case 0:
        setSkills({ ...skills, beginner: [..._skills] });
        break;
    }
    // localStorage.setItem('skills', JSON.stringify(skills));
  };

  /**
   * Data and Functions (if any) Related to AcademicInformation.tsx
   */

  // Type for Academic Information

  // Blank value of AcademicInfoType for Initialization of state.
  const blankAcademicInfoType = {
    qualification: '',
    schoolCollegeName: '',
    specialization: '',
    yearOfPassing: '',
    percentage: '',
  };

  // Academic Information State
  const [academicInfo, setAcademicInfo] = useState<AcademicInfoType[]>([
    {
      ...blankAcademicInfoType,
    },
  ]);

  // Function for adding a new academic information
  const addNewAcadInfo = () => {
    setAcademicInfo([...academicInfo, { ...blankAcademicInfoType }]);
  };

  // Function for deleting academic information
  const deleteAcadInfo = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => {
    academicInfo.splice(index, 1);
    setAcademicInfo([...academicInfo]);
  };

  // Handling all the changes on inputs of Academic Information
  const handleAcadInfoOnChange = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
    fieldName: string,
    i: number,
  ) => {
    const temp = {
      ...academicInfo[i],
      [fieldName]: e.target.value,
    };
    const tempArr = [...academicInfo];
    tempArr.splice(i, 1, temp);
    setAcademicInfo([...tempArr]);
    localStorage.setItem('academicInformation', JSON.stringify(tempArr));
  };

  const handleDateChange = (dateValue, fieldName: string, i: number) => {
    const temp = {
      ...workHistory[i],
      [fieldName]: dateValue,
    };
    const tempArr = [...workHistory];
    tempArr.splice(i, 1, temp);
    setWorkHistory([...tempArr]);
    localStorage.setItem('workHistory', JSON.stringify(tempArr));
  };

  /**
   * Data and Functions (if any) Related to FamilyInfo.tsx
   */

  // Type for Family Information

  // Blank value of FamilyInfo for Initialization of state.
  const blankFamilyInfoType = {
    familyMemberName: '',
    relationship: '',
    familyMemberDob: '',
    bloodGroup: '',
    occupation: '',
  };

  // Academic Information State
  const [familyInfo, setFamilyInfo] = useState<FamilyInfoType[]>([
    {
      ...blankFamilyInfoType,
    },
  ]);

  // Function for adding a new family information
  const addNewFamilyInfo = () => {
    setFamilyInfo([...familyInfo, { ...blankFamilyInfoType }]);
  };

  // Function for deleting family information
  const deleteFamilyInfo = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => {
    familyInfo.splice(index, 1);
    setFamilyInfo([...familyInfo]);
  };

  // Handling all the changes on inputs of Academic Information
  const handleFamilyInfoOnChange = (
    value: string,
    fieldName: string,
    i: number,
  ) => {
    const temp = {
      ...familyInfo[i],
      [fieldName]: value,
    };
    const tempArr = [...familyInfo];
    tempArr.splice(i, 1, temp);
    setFamilyInfo([...tempArr]);
    localStorage.setItem('familyInformation', JSON.stringify(tempArr));
  };
  /**
   * Data and Functions (if any) Related to OnboardingSubmission
   */

  const [contactInfo, setContactInfo] = useState<ContactInformationType>({
    fullName: '',
    emailAddress: '',
    permanentAddress: '',
    phoneNumber: '',
  });

  const [mentionedReason, setMentionedReason] = useState('');

  const handleOnboardingOtp = async (mentionReason: string) => {
    setIsLoading(true);
    const tempDoc = documents.map((doc) => {
      return {
        label: doc.label,
        s3FileKeys: doc.s3FileKeys,
        documentKey: doc.documentKey,
      };
    });
    const body = JSON.stringify({
      otp: '123143',
      onboardingData: {
        updatedAt: new Date().toISOString(),
        // skills,
        workHistory,
        academicInfo,
        familyInfo,
        reasonsForNotUploading: mentionedReason,
        documents: tempDoc,
      },
    });
    console.log('Body: ', body);
    setMentionedReason(mentionReason);
    const res = await apiService.sendOTP();
    setIsLoading(false);
  };

  const handleFormSubmission = async (otp: string) => {
    setIsLoading(true);

    await uploadDocument();
    const tempDoc = documents.map((doc) => {
      return {
        label: doc.label,
        s3FileKeys: doc.s3FileKeys,
        documentKey: doc.documentKey,
      };
    });
    const body = JSON.stringify({
      otp,
      onboardingData: {
        updatedAt: new Date().toISOString(),
        // skills,
        workHistory,
        academicInfo,
        familyInfo,
        reasonsForNotUploading: mentionedReason,
        documents: tempDoc,
      },
    });

    const res = await apiService.submitData(body);
    setIsLoading(false);
    if (res) {
      localStorage.clear();
      location.href = '/app/employee/onboarding/success';
    }
  };

  const downloadFile = async (s3Key) => {
    const res = await apiService.awsDownloadFile(s3Key);
    saveAs(res);
    console.log(res);
  };

  const checkData = (): boolean => {
    // oDocument Upload Validation
    const uploadedDocuments = documents.filter((document) => {
      return document.files.length > 0;
    });
    if (uploadedDocuments.length === 0) {
      OPToast.show(`Please upload atleast 1 document.`, {
        variant: ToastVariant.ERROR,
      });
      return false;
    }

    // Work history validation
    console.log('Workhistory: ', workHistory);
    workHistory.map((work) => {
      if (work.companyName.trim().length === 0) {
        OPToast.show(`Please fill company name in work history.`, {
          variant: ToastVariant.ERROR,
        });
        return false;
      }

      if (work.jobTitle.trim().length === 0) {
        OPToast.show(`Please fill job title in work history.`, {
          variant: ToastVariant.ERROR,
        });
        return false;
      }

      if (work.responsibilities.trim().length === 0) {
        OPToast.show(`Please fill responsibilities title in work history.`, {
          variant: ToastVariant.ERROR,
        });
        return false;
      }
    });

    // // Skills Validations
    // console.log('Skills', skills);

    // if (skills.beginner.length === 0) {
    //   OPToast.show(`Please fill atleast 1 beginner skill.`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }

    // if (skills.expert.length === 0) {
    //   OPToast.show(`Please fill atleast 1 expert skill.`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }

    // if (skills.intermediate.length === 0) {
    //   OPToast.show(`Please fill atleast 1 intermediate skill.`, {
    //     variant: ToastVariant.ERROR,
    //   });
    //   return false;
    // }

    //Academic Information Validation
    console.log('Ac', academicInfo);
    academicInfo.map((info) => {
      if (info.percentage.trim().length === 0) {
        OPToast.show(`Please fill percentage field in academic information.`, {
          variant: ToastVariant.ERROR,
        });
        return false;
      }

      if (info.qualification.trim().length === 0) {
        OPToast.show(
          `Please fill qualification field in academic information.`,
          {
            variant: ToastVariant.ERROR,
          },
        );
        return false;
      }

      if (info.schoolCollegeName.trim().length === 0) {
        OPToast.show(
          `Please fill school/college field in academic information.`,
          {
            variant: ToastVariant.ERROR,
          },
        );
        return false;
      }
      if (info.specialization.trim().length === 0) {
        OPToast.show(
          `Please fill specialization field in academic information.`,
          {
            variant: ToastVariant.ERROR,
          },
        );
        return false;
      }
      if (info.yearOfPassing.trim().length === 0) {
        OPToast.show(
          `Please fill yearOfPassing field in academic information.`,
          {
            variant: ToastVariant.ERROR,
          },
        );
        return false;
      }
    });

    return true;
  };

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

  return (
    <OnboardingContext.Provider
      value={{
        skills,
        workHistory,
        academicInfo,
        familyInfo,
        contactInfo,
        documents,
        isLoading,
        handleAcadInfoOnChange,
        handleFamilyInfoOnChange,
        handleDateChange,
        handleWorkHistoryOnChange,
        addNewWork,
        addNewFamilyInfo,
        addNewAcadInfo,
        deleteWork,
        deleteAcadInfo,
        deleteFamilyInfo,
        handleSkillsOnChange,
        addDocument,
        removeDocument,
        uploadDocument,
        handleOnboardingOtp,
        handleFormSubmission,
        checkData,
        downloadFile,
      }}>
      {props.children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingState;
