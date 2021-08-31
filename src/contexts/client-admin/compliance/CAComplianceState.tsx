import React, { useEffect, useState } from 'react';
import { OPHttpClient } from 'src/utils/op-http-client';

import CAComplianceContext, {
  caComplianceContextDefault,
} from './ca-cc-context';
import { CAComplainceApiService } from 'src/apis/client-admin/ca-complaince-api-service';
import {
  ComplianceType,
  VendorComplianceType,
  VendorDocumentType,
} from 'src/types/client-admin/compliance';

const CAComplianceState = (props) => {
  // API URLs
  const v1URL = 'https://test.app.cloudsbuzz.in/';
  const v2URL = `${process.env.V2_API_URL}/api/v2`;

  // const httpClientV1 = OPHttpClient.init(v1URL, {
  //   action: 'Vendor Admin Complaince Check',
  // });

  const httpClient = OPHttpClient.init(v1URL, {
    action: 'Client Admin/Manager Complaince Check',
  });

  const clientId = props.clientId;
  const userId = props.userId;

  const apiService = new CAComplainceApiService(httpClient, clientId, userId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialFormValues, setInitialFormValues] = useState(
    caComplianceContextDefault.initialFormValues,
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [allCompliance, setAllCompliance] = useState<ComplianceType[]>([]);
  const [allVendors, setAllVendors] = useState<VendorComplianceType[]>([]);
  const [allVendorDocuments, setAllVendorDocuments] = useState<
    VendorDocumentType[]
  >([]);
  const [currentVendors, setCurrentVendors] = useState<VendorComplianceType[]>(
    [],
  );

  const [editMode, setEditMode] = useState<boolean>(false);
  const [currenDocumentId, setCurrentDocumentId] = useState<string>('');
  const [currentTableStatus, setCurrentTableStatus] = useState<string>(
    'PENDING',
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleMonthChange = (month) => {
    console.log('month', month);
    setCurrentMonth(month);
  };
  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  const handleDateChange = (d) => {
    console.log(d);
    setSelectedDate(d);
  };

  useEffect(() => {
    console.log('Month Year', currentMonth, currentYear);
    getAllCompliance();
  }, [currentMonth, currentYear]);

  const handleEdit = async (data) => {
    setEditMode(true);
    setCurrentDocumentId(data.id);
    setInitialFormValues({
      ...initialFormValues,
      document_type: data.document_type,
      document_name: data.document_name,
    });
  };

  const handleTableStatusChange = (value) => {
    setCurrentTableStatus(value);
  };

  const resetForm = async () => {
    await setEditMode(false);
    setInitialFormValues(caComplianceContextDefault.initialFormValues);
    setCurrentDocumentId('');
  };

  const getAllCompliance = async () => {
    setIsLoading(true);
    const res = await apiService.fetchAllCompliance({
      month: currentMonth,
      year: currentYear,
    });
    if (res) await setAllCompliance(res);
    setIsLoading(false);
  };

  const getAllVendors = async () => {
    setIsLoading(true);
    const res = await apiService.fetchAllVendors({
      month: currentMonth,
      year: currentYear,
    });
    if (res) {
      await setAllVendors(res);
    }
    setIsLoading(false);
  };

  const getAllVendorDocuments = async (vendorId) => {
    setIsLoading(true);
    const res = await apiService.fetchAllVendorDocuments(
      { month: currentMonth, year: currentYear },
      vendorId,
    );
    if (res) {
      await setAllVendorDocuments(res);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentTableStatus === 'PENDING') {
      setCurrentVendors(allVendors.filter((d) => !d.compliant));
    } else {
      setCurrentVendors(allVendors.filter((d) => d.compliant));
    }
  }, [currentTableStatus, allVendors]);

  const addCompliance = async (values) => {
    setIsLoading(true);
    const res = await apiService.createCompliance(values, {
      month: currentMonth,
      year: currentYear,
    });
    if (res) await getAllCompliance();
    resetForm();
    setIsLoading(false);
  };

  const updateCompliance = async (values) => {
    setIsLoading(true);
    values.document_id = currenDocumentId;
    const res = await apiService.updateCompliance(values, {
      month: currentMonth,
      year: currentYear,
    });
    setCurrentDocumentId('');
    if (res) await getAllCompliance();
    resetForm();
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    const res = await apiService.deleteCompliance(id);
    if (res) await getAllCompliance();
    setIsLoading(false);
  };

  const getPrevMonthDocs = async () => {
    setIsLoading(true);
    const res = await apiService.getPrevMonthDocs({
      month: currentMonth,
      year: currentYear,
    });
    if (res) await getAllCompliance();
    setIsLoading(false);
  };

  const handleDocumentRequest = async (document_type, vendorId) => {
    setIsLoading(true);
    const res = await apiService.documentRequest(
      document_type,
      { month: currentMonth, year: currentYear },
      vendorId,
    );
    if (res) await getAllVendors();
    if (res) await getAllVendorDocuments(vendorId);
    setIsLoading(false);
  };

  const handleDocumentApprove = async (document_id, vendorId) => {
    setIsLoading(true);
    const res = await apiService.documentApprove(document_id, vendorId);
    if (res) await getAllVendors();
    if (res) await getAllVendorDocuments(vendorId);
    setIsLoading(false);
  };

  const downloadFile = async (document_type, vendorId, filename) => {
    setIsLoading(true);
    await apiService.downloadFile(
      document_type,
      vendorId,
      {
        month: currentMonth,
        year: currentYear,
      },
      filename,
    );
    setIsLoading(false);
  };

  useEffect(() => {
    getAllCompliance();
    getAllVendors();
  }, []);

  return (
    <CAComplianceContext.Provider
      value={{
        isLoading,
        initialFormValues,
        handleDateChange,
        handleMonthChange,
        handleYearChange,
        selectedDate,
        currentMonth,
        currentYear,
        allCompliance,
        addCompliance,
        editMode,
        modalOpen,
        setModalOpen,
        handleEdit,
        getPrevMonthDocs,
        updateCompliance,
        resetForm,
        handleDelete,
        currentVendors,
        currentTableStatus,
        handleTableStatusChange,
        allVendorDocuments,
        getAllVendorDocuments,
        handleDocumentRequest,
        handleDocumentApprove,
        downloadFile,
      }}>
      {props.children}
    </CAComplianceContext.Provider>
  );
};

export default CAComplianceState;
