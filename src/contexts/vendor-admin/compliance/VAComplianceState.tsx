import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { OPToast } from 'src/utils/op-toast';
import { getWeekData } from 'src/components/common/OPWeekPicker';
import { OPHttpClient } from 'src/utils/op-http-client';

import VAComplianceContext from './va-cc-context';
import { VAApiService } from 'src/apis/vendor-admin/va-api-service';
import { ComplianceDocumentsType } from 'src/types/vendor-admin/demand';

const VAComplianceState = (props) => {
  // API URLs
  const v1URL = 'https://test.app.cloudsbuzz.in/';
  const v2URL = `${process.env.V2_API_URL}/api/v2`;

  const httpClientV1 = OPHttpClient.init(v1URL, {
    action: 'Vendor Admin Complaince Check',
  });

  const clientId = props.clientId;
  const userId = props.userId;

  const apiService = new VAApiService(httpClientV1, userId, '', '');
  const [monthYear, setMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    date: new Date(),
  });
  const [documents, setDocuments] = useState<ComplianceDocumentsType[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [currentDocumentType, setCurrentDocumentType] = useState<string>(
    'SELECT',
  );
  const [file, setFile] = useState([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDateChange = (date) => {
    setMonthYear({
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
      date: new Date(date),
    });
    clearForm();
  };

  const getDocuments = async () => {
    setIsLoading(true);
    if (monthYear.date) {
      const response = await apiService.getComplianceDocuments(
        clientId,
        monthYear.month,
        monthYear.year,
      );
      if (response) {
        setDocuments(response);
        const documentTypeArray: string[] = [];
        response.map((data) => {
          if (data.document_status !== 'APPROVED') {
            documentTypeArray.push(data.document_type);
          }
          setDocumentTypes(documentTypeArray);
          // if (documentTypeArray.length > 0) {
          //   setCurrentDocumentType(documentTypeArray[0]);
          // }
          setCurrentDocumentType('SELECT');
        });
      }
    }
    setIsLoading(false);
  };

  const handleDocumentTypeChange = (value) => {
    setCurrentDocumentType(value);
  };

  const handleFileUpload = (files) => {
    setFile(files);
  };

  const submitDocumentUpload = async () => {
    setIsLoading(true);
    const month = monthYear.month;
    const year = monthYear.year;
    const docType = currentDocumentType;
    if (docType === 'SELECT') {
      OPToast.show('Please select a document type.');
    } else if (!file[0]) {
      OPToast.show('Please upload a file.');
    } else {
      await apiService.submitComplianceDocuments(month, year, docType, file[0]);
      await setFile([]);
      await getDocuments();
    }
    setIsLoading(false);
  };

  const downloadDocument = async (docType) => {
    setIsLoading(true);
    await apiService.downloadDocument(monthYear.month, monthYear.year, docType);
    setIsLoading(false);
  };

  const clearForm = async () => {
    await setCurrentDocumentType('SELECT');
    await setFile([]);
  };

  useEffect(() => {
    console.log(monthYear);
    getDocuments();
  }, [monthYear]);

  return (
    <VAComplianceContext.Provider
      value={{
        isLoading,
        file,
        handleDateChange,
        currentDocumentType,
        handleDocumentTypeChange,
        handleFileUpload,
        submitDocumentUpload,
        documentTypes,
        monthYear,
        documents,
        clearForm,
        downloadDocument,
      }}>
      {props.children}
    </VAComplianceContext.Provider>
  );
};

export default VAComplianceState;
