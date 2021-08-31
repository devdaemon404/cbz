import { createContext, ChangeEvent } from 'react';
import {
  AcademicInfoType,
  ContactInformationType,
  DocumentDataType,
  FamilyInfoType,
  SkillType,
  WorkHistoryType,
} from '../../types/employee/onboarding';

export interface OnboardingContextDataType {
  handleWorkHistoryOnChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string,
    i: number,
  ) => void;

  handleAcadInfoOnChange: (
    e: ChangeEvent<{ name?: string | undefined; value: unknown }>,
    fieldName: string,
    i: number,
  ) => void;

  addNewWork: () => void;
  addNewAcadInfo: () => void;

  deleteWork: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => void;

  deleteAcadInfo: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => void;

  workHistory: WorkHistoryType[];

  skills: SkillType;

  contactInfo: ContactInformationType;

  familyInfo: FamilyInfoType[];

  academicInfo: AcademicInfoType[];

  isLoading: boolean;

  handleSkillsOnChange: (skills: string[], level: number) => void;

  handleOnboardingOtp: (mentionedReason: string) => void;

  handleFormSubmission: (otp: string) => void;

  addDocument: (data: DocumentDataType) => void;

  removeDocument: (data: DocumentDataType) => void;

  deleteFamilyInfo: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => void;

  uploadDocument: (documentKey: string) => void;

  documents: DocumentDataType[];

  addNewFamilyInfo: () => void;

  checkData: () => boolean;

  handleDateChange: (dateValue: any, fieldName: string, i: number) => void;

  handleFamilyInfoOnChange: (
    value: string,
    fieldName: string,
    i: number,
  ) => void;

  downloadFile: (s3Key: any) => Promise<void>;
}

export const OnboardingContextDefaultValue: OnboardingContextDataType = {
  workHistory: [],
  skills: {
    expert: [],
    intermediate: [],
    beginner: [],
  },
  contactInfo: {
    fullName: '',
    emailAddress: '',
    permanentAddress: '',
    phoneNumber: '',
  },
  academicInfo: [],
  familyInfo: [],
  isLoading: false,
  handleWorkHistoryOnChange: () => null,
  addNewFamilyInfo: () => null,
  handleFamilyInfoOnChange: (value: string, fieldName: string, i: number) =>
    null,
  deleteFamilyInfo: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => null,

  handleOnboardingOtp: () => null,
  handleFormSubmission: () => null,
  handleAcadInfoOnChange: () => null,
  addNewWork: () => null,
  addNewAcadInfo: () => null,
  deleteWork: () => null,
  deleteAcadInfo: () => null,
  handleSkillsOnChange: () => null,
  addDocument: () => null,
  uploadDocument: () => null,
  removeDocument: () => null,
  checkData: () => false,
  documents: [],
  handleDateChange: () => null,
  downloadFile: (s3Key: any) => Promise.resolve(),
};

const EmployeeContext = createContext<OnboardingContextDataType>(
  OnboardingContextDefaultValue,
);

export default EmployeeContext;
