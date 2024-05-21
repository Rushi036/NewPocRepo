"use client"
import { Stepper, Step, StepLabel, Input, dialogClasses } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
// import InfoOutlinedIcon from '@mui/icons-material/InfoRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Truculenta } from "next/font/google";
import { fileURLToPath } from "url";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { finopsServerBaseUrl } from "@/const";

import Table from "../../Components/CloudProject/table";
import AdminDocumentDialog from "../../Components/CloudProject/AdminDocumentDialog";
import ViewRequest from "../../Components/CloudProject/ViewRequest";
import FilterBox from "../../Components/CloudProject/FilterBox";
import { useRouter } from "next/router";

import { sendRequest } from "@/pages/api/CloudProjectsApi/sendRequest";
import { getRequestTableData } from "@/pages/api/CloudProjectsApi/getRequestTableData";
import { getRequestByRequestId } from "@/pages/api/CloudProjectsApi/getRequestByRequestId";
import { getCloudSubscriptions } from "@/pages/api/CloudProjectsApi/getCloudSubscriptions";
import { sendAdminCloudDocuments } from "@/pages/api/CloudProjectsApi/sendAdminCloudDocuments";
import { approveAdminCloudDocuments } from "@/pages/api/CloudProjectsApi/approveAdminCloudDocument";

function Request() {

  const router = useRouter();
  // state for storing access to user
  const [access, setAccess] = useState<Boolean>(false);

  // state for stroring the user role
  const [userRole, setUserRole] = useState<any>('');
  // state for opening and closing the modal
  const [isOpen, setIsOpen] = useState(false);

  // state for openeing and closing the upload document for admin for uploading the document
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // state for opening and closing view request info modal
  const [isViewOpen, setIsViewOpen] = useState(false);

  // state for storing the name of file selected to upload
  const [excelArray, setExcelArray] = useState(['']);

  // state for stepper active state // 10 is active step for preview of all the form
  const [activeStep, setActiveStep] = useState(0);

  // state for storing search (filter)
  const [searchQuery, setSearchQuery] = useState<any>('')

  // state for storing subscritptions 
  const [subs, setSubs] = useState<any>([]);

  // state for storing request information
  const [requestInformation, setRequestInformation] = useState<any>(null);

  // states for storing table data
  const [tableData, setTableData] = useState<any>({});
  const [tableArray, setTableArray] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState<any>(1);
  const [itemsPerPage] = useState<any>(5);

  // states setting loading on and off
  const [isLoading, setIsLoading] = useState<any>(false);

  // states for buton loader
  const [buttonLoader, setButtonLoader] = useState<any>(false);

  // filtering the data based on search query
  const filteredData =
    tableArray && tableArray.filter((d: any, i: any) => {
      let str = "";
      str = str + d[1] + " "
      str = str + d[2] + " "
      str = str + d[3] + " "
      str = str + d[4] + " "

      return str.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // calculations for pages
  const totalItems = filteredData && filteredData.length;
  const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData

  interface InformatioGathering {
    nameOfRequester: string,
    nameOfSponsor: string,
    businessName: string,
    currentModeOfOperation: string,
    cspSelection: string,
    workDescription: string
    subscriptionName: string
  }


  // states for storing the data (Information Gathering)
  const [informationGathering, setInformationGathering] = useState<InformatioGathering>({
    nameOfRequester: "",
    nameOfSponsor: "",
    businessName: "",
    currentModeOfOperation: "",
    cspSelection: "",
    workDescription: "",
    subscriptionName: ""
  });

  // states for storing the data (Application Details)
  const [applicationDetails, setApplicationDetails] = useState({
    // preferredCloudProvider:"",
    applicationName: "",
    purposeOfTheApplication: "",
    // applicationVersionExisting:"",
    // applicationVersionNew:"",
    applicationCriticality: "",
    natureOfTheApplication: "",
    // modulesOfApplication:""
  });


  // data type of DeploymentArchitectureOfTheApplication useState
  interface DeploymentArchitectureOfTheApplication {
    applicationInternetExposed: string,
    environmentOfApplication: string,
    highAvailabilityRequired: string,
    highAvailabilityRequiredText: string,
    disasterRecoveryRequirement: string,
    accessManagement: string,
    futureModeOfOperation: string,
    additionalComments: string,
    virtualNetworkName: string,
    attachments: { name: string, type: string, fileString: string },
    excelFile: { name: string, fileString: string }[]
  }

  // states for storing the data 
  const [deploymentArchitectureOfTheApplication, setDeploymentArchitectureOfTheApplication] = useState<DeploymentArchitectureOfTheApplication>(
    {
      applicationInternetExposed: "",
      environmentOfApplication: "",
      highAvailabilityRequired: "",
      highAvailabilityRequiredText: "",
      disasterRecoveryRequirement: "",
      accessManagement: "",
      futureModeOfOperation: "",
      additionalComments: "",
      virtualNetworkName: "",
      attachments: { name: "", type: "", fileString: "" },
      excelFile: [] = new Array(20)
    }
  );


  interface NetworkInfraConnectivityState {
    cidrRange: string;
    excelFile: { name: string, fileString: string }[];
  }

  // state for storing the data (network infra connectivity)
  const [networkInfraConnectivity, setNetworkInfraConnectivity] = useState<NetworkInfraConnectivityState>({
    cidrRange: "",
    excelFile: [] = new Array(1)
  })


  // states for storing the data (application implementation)
  const [applicationImplementation, setApplicationImplementation] = useState({
    customDomainURL: "",
    applySSLCertificate: "",
    sslCertificateInfo: ""
    // dnsMapping:""
  })


  interface EnterpriseBackupConfiguration {
    // numberOfServersDatabases:string,
    excelFile: { name: string, fileString: string }[];
  }

  // state for storing data (enterprise Backup Configuration)
  const [enterpriseBackupConfiguration, setEnterpriseBackupConfiguration] = useState<EnterpriseBackupConfiguration>({
    // numberOfServersDatabases:"",
    excelFile: [] = new Array(1)
  })

  interface zPAVPNOnboarding {
    excelFile: { name: string, fileString: string }[];
  }
  // state for storing data (ZPA VPN Onboarding)
  const [ZPAVPNOnboarding, setZPAVPNOnboarding] = useState<zPAVPNOnboarding>({
    excelFile: [] = new Array(1)
  })

  // state for the storing design document and more
  interface CloudDocuments {
    requestId?: string,
    designDocument: { name: string, fileString: string },
    anotherDocument: { name: string, fileString: string },
    comment: string
  }

  const [adminCloudDocuments, setAdminCloudDocuments] = useState<CloudDocuments>({
    requestId: "",
    designDocument: { name: "", fileString: "" },
    anotherDocument: { name: "", fileString: "" },
    comment: ""
  });


  // code for use effects
  // use effect for getting cloud subscriptions
  useEffect(() => {
    getSubs();
    setInformationGathering((prevState) => ({
      ...prevState,
      subscriptionName: ""
    }));

  }, [informationGathering.cspSelection]);

  // useEffect for assigning all the initial values for required string
  useEffect(() => {
    console.log(sessionStorage.getItem('userRole'));
    let name = sessionStorage.getItem("userName");
    let businessName = sessionStorage.businessName;
    setUserRole(sessionStorage.getItem('userRole'));

    setInformationGathering((prevData) => ({
      ...prevData,
      nameOfRequester: name || ""
    }));

    setInformationGathering((prevData) => ({
      ...prevData,
      businessName: businessName || ""
    }));

  }, []);

  // useEffect for fetching request data when a page loads
  useEffect(() => {
    fetchCloudServiceSheetTable();
  }, []);

  // useEffect for checking the access control
  useEffect(() => {
    if (sessionStorage.getItem("access") == "SSP" || sessionStorage.getItem("access") == "FinopsSSP") {
      setAccess(true);
    }
    else {
      setAccess(false);
      router.replace("/page/Errors");
    }
  },[]);


  // function for getting extension of the file
  const downloadFile = (fileName: any, fileString: any) => {
    const fileParts = fileName.split('.').pop();

    console.log(fileName);
    switch (fileParts) {
      case "xlsx":
        handleFileDownload(fileString, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        break;

      case "xlsm":
        handleFileDownload(fileString, fileName, 'application/vnd.ms-excel.sheet.macroEnabled.12');
        break;

      case "pdf":
        handleFileDownload(fileString, fileName, 'ata:application/pdf;base64');
        break;

      case "png":
        handleFileDownload(fileString, fileName, 'ata:application/png;base64');
        break;
    }
  }

  // function to change the state of cloudDocments
  const handleAdminCloudDocuments = (e: any) => {
    const { name, value } = e.target;

    setAdminCloudDocuments((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // function to handle the upload documents of admin cloud documents
  const handleFileUploadAdminCloudDocuments = (e: any) => {

    const name = e.target.name;
    const selectedFile = e.target.files && e.target.files[0];
    const fileName = selectedFile && selectedFile.name;

    if (selectedFile) {
      console.log("converting");
      let base64String: any;
      const reader = new FileReader();
      reader.onload = () => {
        base64String = reader.result?.toString().split(',')[1];

        let object = { name: fileName, fileString: base64String }
        console.log(base64String);

        setAdminCloudDocuments((prevData) => ({
          ...prevData,
          [name]: object
        }))

      };
      reader.readAsDataURL(selectedFile);
    }

  }


  const closeAdminDocumentModal = () => {
    setIsUploadOpen(false);
    const obj: CloudDocuments =
    {
      requestId: "",
      designDocument: { name: "", fileString: "" },
      anotherDocument: { name: "", fileString: "" },
      comment: ""
    }

    setAdminCloudDocuments(obj);
  }

  // funcion to change state of intomation gathering change
  const handleInformationGatheringChange = (e: any) => {
    const { name, value } = e.target;
    setInformationGathering((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // function to change the state of application details
  const handleApplicationDetailsChange = (e: any) => {
    const { name, value } = e.target;
    setApplicationDetails((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // function to change deployement architecture details
  const handleDeploymentArchitectureChange = (e: any) => {
    const { name, value } = e.target;
    setDeploymentArchitectureOfTheApplication((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleNetworkInfraConnectivityChange = (e: any) => {
    const { name, value } = e.target;
    setNetworkInfraConnectivity((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // function to change application implementation
  const handleApplicationImplementationChange = (e: any) => {
    const { name, value } = e.target;
    setApplicationImplementation((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // function for uploading excel file (firewallChangeRequestFile)
  const handleFireWallChangeRequestFileUpload = (event: any) => {
    const selectedFile = event.target.files && event.target.files[0];

    let array = [...networkInfraConnectivity.excelFile];

    if (selectedFile) {
      let base64String: any;
      const reader = new FileReader();
      reader.onload = () => {
        base64String = reader.result?.toString().split(',')[1];

        array = array.map((record, i) => {

          if (i == 0) {
            console.log("yes")
            return { name: "fireWallChangeRequestFile", fileString: base64String }
          }
          else {
            return record;
          }
        });

        setNetworkInfraConnectivity(prevState => ({
          ...prevState,
          excelFile: array
        }));

        //  setFileString(base64String || '');
      };

      reader.readAsDataURL(selectedFile);
    }

  }

  // function to handle file upload of zpa vpn file
  const handleZPAVPNOnboardingFileUpload = (event: any) => {
    const selectedFile = event.target.files && event.target.files[0];

    let array = [...ZPAVPNOnboarding.excelFile];

    if (selectedFile) {
      console.log("converting");
      let base64String: any;
      const reader = new FileReader();
      reader.onload = () => {
        base64String = reader.result?.toString().split(',')[1];

        array = array.map((record, i) => {

          if (i == 0) {
            console.log("yes")
            return { name: "zpaVpnFile", fileString: base64String }
          }
          else {
            return record;
          }
        });

        setZPAVPNOnboarding(prevState => ({
          ...prevState,
          excelFile: array
        }));

        //  setFileString(base64String || '');
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  // function to handle file upload of back up request excel file
  const handleEnterpriseBackupConfigurationFileUpload = (event: any) => {
    const selectedFile = event.target.files && event.target.files[0];

    let array = [...enterpriseBackupConfiguration.excelFile];

    if (selectedFile) {
      console.log("converting");
      let base64String: any;
      const reader = new FileReader();
      reader.onload = () => {
        base64String = reader.result?.toString().split(',')[1];

        array = array.map((record, i) => {

          if (i == 0) {
            console.log("yes")
            return { name: "backupRequestFile", fileString: base64String }
          }
          else {
            return record;
          }
        });

        setEnterpriseBackupConfiguration(prevState => ({
          ...prevState,
          excelFile: array
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  // function to handle file upload of cloud provisioning (multiple files)
  const handleDeploymentArchitectureOfTheApplicationFileUpload = (event: any, index: number) => {
    const selectedFile = event.target.files && event.target.files[0];

    let array = [...deploymentArchitectureOfTheApplication.excelFile];

    const regex = /\.[^.]*$/;

    if (selectedFile) {
      console.log("converting");
      let base64String: any;
      const reader = new FileReader();
      reader.onload = () => {
        base64String = reader.result?.toString().split(',')[1];

        array = array.map((record, i) => {

          if (i == index) {
            return { name: selectedFile.name.replace(regex, ''), fileString: base64String }
          }
          else {
            return record;
          }
        });

        setDeploymentArchitectureOfTheApplication(prevState => ({
          ...prevState,
          excelFile: array
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  // function to increase exelfile array
  const incrementFileCount = () => {
    if (excelArray.length < 20) {
      setExcelArray(prev => [...prev, ""]);
    }
  }

  const decrementFileCount = (index: any) => {
    let array = [...excelArray];

    // array = array.filter((i) =>
    // {
    //   if(index == i)
    //     return false;
    //   else
    //     return true;
    // });

    array.splice(index, 1);

    // console.log(array);

    setExcelArray([...array]);

    let temp = [...deploymentArchitectureOfTheApplication.excelFile];

    console.log(temp);

    temp.splice(index, 1);

    console.log(temp);

    let newArray = new Array(20);

    for (let i = 0; i < temp.length; i++) {
      newArray[i] = temp[i];
    }

    setDeploymentArchitectureOfTheApplication((prevState) => (
      {
        ...prevState,
        excelFile: newArray
      }
    ));
  }

  // function for handling change in the select of excel file in DeploymentArchitectureOfTheApplication
  function handleExcelSelectChange(e: any, index: number) {
    let name = e.target.value;
    let array = [...excelArray];
    array[index] = name;
    setExcelArray(array);
  }

  function handleAttachmentChange(event: any) {
    const selectedFile = event.target.files && event.target.files[0];

    let obj = { ...deploymentArchitectureOfTheApplication.attachments };
    obj.name = selectedFile.name;
    const fileNameParts = selectedFile.name.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
    obj.type = fileExtension;

    if (selectedFile) {
      console.log("converting");
      let base64String: any;
      const reader = new FileReader();
      reader.onload = () => {
        base64String = reader.result?.toString().split(',')[1];

        obj.fileString = base64String;


        setDeploymentArchitectureOfTheApplication(prevState => ({
          ...prevState,
          attachments: obj
        }));
      };

      reader.readAsDataURL(selectedFile);
    }

  }


  function forward() {
    if (activeStep < 6)
      setActiveStep(prev => prev + 1);
  }

  function backward() {
    if (activeStep > 0)
      setActiveStep(prev => prev - 1);
  }

  const refreshDialog = () => {
    setActiveStep(0);
    setExcelArray(['']);

    setInformationGathering({
      nameOfRequester: sessionStorage.getItem("userName") || "",
      nameOfSponsor: "",
      businessName: sessionStorage.getItem("businessName") || "",
      currentModeOfOperation: "",
      cspSelection: "",
      workDescription: "",
      subscriptionName: ""
    })

    setApplicationDetails({
      // preferredCloudProvider:"",
      applicationName: "",
      purposeOfTheApplication: "",
      // applicationVersionExisting:"",
      // applicationVersionNew:"",
      applicationCriticality: "",
      natureOfTheApplication: "",
      // modulesOfApplication:""
    });

    setDeploymentArchitectureOfTheApplication({
      applicationInternetExposed: "",
      environmentOfApplication: "",
      highAvailabilityRequired: "",
      highAvailabilityRequiredText: "",
      disasterRecoveryRequirement: "",
      accessManagement: "",
      futureModeOfOperation: "",
      additionalComments: "",
      virtualNetworkName: "",
      attachments: { name: "", type: "", fileString: "" },
      excelFile: [] = new Array(20)
    })

    setNetworkInfraConnectivity({
      cidrRange: "",
      excelFile: [] = new Array(1)
    });

    setApplicationImplementation({
      customDomainURL: "",
      applySSLCertificate: "",
      sslCertificateInfo: ""
      // dnsMapping:""
    });

    setEnterpriseBackupConfiguration({
      // numberOfServersDatabases:"",
      excelFile: [] = new Array(1)
    });

    setZPAVPNOnboarding({
      excelFile: [] = new Array(1)
    });

    setSubs([]);
  }

  const closeDailog = () => {
    setIsOpen(false);
    refreshDialog();
  }

  // function to validate the required validations
  const validate = () => {
    let isNameOfRequester = informationGathering.nameOfRequester.trim();
    let isBusinessName = informationGathering.businessName.trim();
    let isCurrentModeOfOperation = informationGathering.currentModeOfOperation.trim();
    let iscspSelection = informationGathering.cspSelection.trim();
    let isworkDescription = informationGathering.workDescription.trim();
    let isSubscriptionName = informationGathering.subscriptionName;

    // let preferredCloudProvider = applicationDetails.preferredCloudProvider.trim();
    let isApplicationName = applicationDetails.applicationName.trim();
    let isNatureOfTheApplication = applicationDetails.natureOfTheApplication.trim();
    // let isModulesOfApplication = applicationDetails.modulesOfApplication.trim();

    let isapplicationInternetExposed = deploymentArchitectureOfTheApplication.applicationInternetExposed.trim();
    let environmentOfApplication = deploymentArchitectureOfTheApplication.environmentOfApplication.trim();
    let highAvailabilityRequired = deploymentArchitectureOfTheApplication.highAvailabilityRequired.trim();
    let isAccessManagment = deploymentArchitectureOfTheApplication.accessManagement.trim();
    let isDeploymentArchitectureOfTheApplicationFile = false;

    let isCidrRange = networkInfraConnectivity.cidrRange.trim();
    let isnetworkInfraConnectivityFile = false;

    let isZPAVPNOnboardingFile = false;

    let isBackUpRequestFile = false;


    if (deploymentArchitectureOfTheApplication.excelFile[0] == undefined)
      isDeploymentArchitectureOfTheApplicationFile = false;
    else
      isDeploymentArchitectureOfTheApplicationFile = true;

    if (networkInfraConnectivity.excelFile.length == 1) {
      if (networkInfraConnectivity.excelFile[0] == undefined)
        isnetworkInfraConnectivityFile = false;
      else
        isnetworkInfraConnectivityFile = true;
    }

    if (ZPAVPNOnboarding.excelFile.length == 1) {
      if (ZPAVPNOnboarding.excelFile[0] == undefined)
        isZPAVPNOnboardingFile = false;
      else
        isZPAVPNOnboardingFile = true;
    }


    if (applicationDetails.applicationCriticality == 'Business Critical' || applicationDetails.applicationCriticality == 'Mission Critical' || deploymentArchitectureOfTheApplication.environmentOfApplication == 'Production') {
      if (enterpriseBackupConfiguration.excelFile[0] == undefined)
        isBackUpRequestFile = false;
      else
        isBackUpRequestFile = true;
    }
    else
      isBackUpRequestFile = true;

    if (activeStep == 0) {

      if (isNameOfRequester && isBusinessName && isCurrentModeOfOperation && iscspSelection && isworkDescription && isSubscriptionName)
        return true;
      else
        return false;

    }
    else if (activeStep == 1) {

      if (isApplicationName && isNatureOfTheApplication)
        return true;
      else
        return false;
    }
    else if (activeStep == 2) {

      if (isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile)
        return true;
      else
        return false;
    }
    else if (activeStep == 3) {

      if (isCidrRange && isnetworkInfraConnectivityFile)
        return true;
      else
        return false;
    }
    else if (activeStep == 4) {
      if (applicationImplementation.customDomainURL.trim())
        return true;
      else
        return false;
    }
    else if (activeStep == 5) {
      return isBackUpRequestFile;
    }
    else if (activeStep == 6) {
      return isZPAVPNOnboardingFile;
    }
    else if (activeStep == 10) {
      // if(isNameOfRequester && isBusinessName && isCurrentModeOfOperation && iscspSelection && isworkDescription && isApplicationName && isNatureOfTheApplication && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isCidrRange && isnetworkInfraConnectivityFile && applicationImplementation.customDomainURL.trim())
      // //   console.log(true);
      // // else
      // //   console.log(false);

      if (isNameOfRequester && isBusinessName && isCurrentModeOfOperation && iscspSelection && isworkDescription && isSubscriptionName && isApplicationName && isNatureOfTheApplication && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isCidrRange && isnetworkInfraConnectivityFile && applicationImplementation.customDomainURL.trim() && isZPAVPNOnboardingFile && isBackUpRequestFile)
        return true;
      else
        return false;
    }
    else
      return true;

  }

  // function for stoping the exection for defined seconds important
  function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // function for opening the view dailog box for requests
  async function openViewDilaog(requestId: any) {

      let flag = await fetchRequestByRequestId(requestId);
  
      if (flag)
        setIsViewOpen(true);
  }

  // function for closing the view dailog box
  function closeViewDialog() {
      setIsViewOpen(false);
  }

  // generic function to download the file (xlsx, xlsm, pdf, png)
  const handleFileDownload = (base64String: string, fileName: string, type: string) => {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: type });
      const url = URL.createObjectURL(blob);
  
      // Create a link element to download the Excel file
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
  }
  

  // BELOW ARE THE FUNCTIONS WHERE THE APIS ARE CALLED
  // function to invoke fetchSubscriptoin function
  async function getSubs() {
    try {
      let adid = sessionStorage.getItem('userEmail');
      let cloud = informationGathering.cspSelection;

      let response = await getCloudSubscriptions(cloud,adid);

      if (response) {
        if (response.ok) {
          let data = await response.json();
          setSubs(data.data);
        }
        else
          setSubs([]);
      }
      else {
        setSubs([])
      }
    }
    catch (e) {
      console.log(e);
      setSubs([]);
    }
  }

  // function to create a request
  async function createRequest(data: any) {
    setButtonLoader(true);
    await sleep(1000);
    try {
      let response = await sendRequest(data);

      if (response.status == 201) {
        let data = await response.json();
        console.log(data);
        await fetchCloudServiceSheetTable();

        return true;
      }
      else {
        return false;
      }

    }
    catch (e) {
      console.log(e);
      return false;
    }
    finally {
      setButtonLoader(false);
    }

    return false;
  }

  // function to save data in stepper form entered by user
  async function handleSaveAll() {
    let body: any;
    body = {}
    body.adId = sessionStorage.getItem("userEmail");
    body.informationGathering = informationGathering;
    body.informationGathering.subsAccId = informationGathering.subscriptionName;

    delete body.informationGathering.subscriptionName;

    body.applicationDetails = applicationDetails;
    body.deploymentArchitectureOfTheApplication = deploymentArchitectureOfTheApplication;
    body.networkInfraConnectivity = networkInfraConnectivity;
    body.applicationImplementation = applicationImplementation;

    // checking wheather file is empty or not
    if (enterpriseBackupConfiguration.excelFile[0] == null)
      body.enterpriseBackupConfiguration = { excelFile: [] };
    else
      body.enterpriseBackupConfiguration = enterpriseBackupConfiguration;

    body.zpavpnOnBoarding = ZPAVPNOnboarding;

    body.deploymentArchitectureOfTheApplication.excelFile = body.deploymentArchitectureOfTheApplication.excelFile.filter((element: any) => {
      if (element)
        return true;
      else
        return false;
    });

    console.log(body);

    if (await createRequest(body)) {
      toast.success("Request Raised Successfully",
        {
          position: "bottom-right",
          autoClose: 2000,
        });

      setIsOpen(false);
      refreshDialog();
    }
    else {
      toast.error("Some Error Occurred, try again",
        {
          position: "bottom-right",
          autoClose: 2000,
        });

      setIsOpen(false);
      refreshDialog();
    }

  }

  // function for fetching the data for table
  async function fetchCloudServiceSheetTable() {
    let adid = sessionStorage.getItem("userEmail");
    try {
      let response = await getRequestTableData(adid)

      if (response.status == 200) {
        let data = await response.json();
        console.log(data[0].table.data);
        console.log(data);
        setTableData(data[0].table);
        setTableArray(data[0].table.data.reverse());
      }
      else if (response.status == 404) {
        console.log("error");
      }
    }
    catch (e) {
      console.log("error");
    }
  }

  // function for fetching the request information using request id
  async function fetchRequestByRequestId(requestId: any) {
    try {
      setIsLoading(true);
      await sleep(500);
      let response = await getRequestByRequestId(requestId);
      if (response.status == 200) {
        let data = await response.json();
        console.log(data);
        setIsLoading(false);
        setRequestInformation(data);
        return true;
      }
      else if (response.status == 404) {
        setIsLoading(false);
        console.log("error");
        toast.error("Some error occured, try again",
          {
            position: "bottom-right",
            autoClose: 2000,
          });
        return false;
      }
    }
    catch (e) {
      setIsLoading(false);
      toast.error("Some error occured, try again",
        {
          position: "bottom-right",
          autoClose: 2000,
        });
      return false;
    }

    return false;
  }

    // function to send/save/upload admin added documents
  const saveAdminCloudDocument = async () => {

    let data = { ...adminCloudDocuments };
    let id = data.requestId;
    delete data.requestId;

    // apply button loader here
    setButtonLoader(true);
    await sleep(1000);
    try {
      let response = await sendAdminCloudDocuments(id,data);

      if (response.status == 200) {
        let data = await response.json();
        // show toast here
        console.log(data);
        // console.log(data.message);

        // getting new data after upload
        await fetchCloudServiceSheetTable();

        toast.success(data.message,
          {
            position: "bottom-right",
            autoClose: 2000,
          });


      }
      else {
        toast.error("Some error occured, try again",
          {
            position: "bottom-right",
            autoClose: 2000,
          });
      }

    }
    catch (e) {
      toast.error("Some error occured, try again",
        {
          position: "bottom-right",
          autoClose: 2000,
        });
    }
    finally {
      setButtonLoader(false);
      closeAdminDocumentModal();
    }
  }

  // function to handle accept or reject from the business user
  const sendApproval = async (requestId: any, status: any) => {
    try {
      const response = await approveAdminCloudDocuments(requestId,status)

      if (response.status == 200) {
        let data = await response.json();

        // getting new data after upload
        await fetchRequestByRequestId(requestId);
        await fetchCloudServiceSheetTable();

        toast.success(data.message,
          {
            position: "bottom-right",
            autoClose: 2000,
          });
      }
      else {
        toast.error("Some error occured, try again",
          {
            position: "bottom-right",
            autoClose: 2000,
          });
      }
    }
    catch (e) {
      toast.error("Some error occured, try again",
        {
          position: "bottom-right",
          autoClose: 2000,
        });
    }
  }


  let dailogClass: any;

  if (activeStep == 10 || isViewOpen)
    dailogClass = "w-full max-w-7xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen";
  else
    dailogClass = "w-full max-w-6xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen";

  return (
    access &&
    <div className="">

      <div className="text-xl px-4 border-b-2 border-slate-400 pb-2 flex justify-between items-center">
        <span>Cloud Projects</span>
      </div>

      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>

      <div className="flex justify-between px-4 ">

        {/* Global search for table */}
        <FilterBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} setCurrentPage={setCurrentPage} />

        {/* button for opening and the request form (stepper form) */}
        <div className=" mt-6">
          <button
            onClick={() => setIsOpen(true)}
            className="btn  rounded-md  px-4 py-1 text-white font-semibold hover:bg-red-800"
            style={{
              background:
                "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
            }}
          >
            Raise a request
          </button>
        </div>

      </div>

      {/* Table component for showing all the request */}
      <Table userRole={userRole} currentData={currentData} itemsPerPage={itemsPerPage} currentPage={currentPage} openViewDilaog={openViewDilaog} setIsUploadOpen={setIsUploadOpen} setAdminCloudDocuments={setAdminCloudDocuments} setCurrentPage={setCurrentPage} totalPages={totalPages} />

      {/* loader */}
      {
        isLoading &&
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black bg-opacity-50">
            <CircularProgress />
        </div>
      }


      {/* Modal for opening the upload dialog box for admin cloud documents*/}
      {isUploadOpen && <AdminDocumentDialog closeAdminDocumentModal={closeAdminDocumentModal} handleFileUploadAdminCloudDocuments={handleFileUploadAdminCloudDocuments} adminCloudDocuments={adminCloudDocuments} handleAdminCloudDocuments={handleAdminCloudDocuments} saveAdminCloudDocument={saveAdminCloudDocument} buttonLoader={buttonLoader} />}


      {/* Stepper modal (service request modal) rendering code */}
      {
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

          <div className={dailogClass}>

            <div
              className=" px-4 py-2 flex items-center justify-between"
              style={{
                background:
                  "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
              }}
            >
              <h3 className="text-xl text-white font-bold">
                Raise a request
              </h3>
              <button
                className="p-2 text-2xl text-white"
                onClick={closeDailog}
              >
                <CloseIcon />
              </button>
            </div>

            {(activeStep != 10) &&
              <div className="my-10 mx-2">

                <Stepper alternativeLabel activeStep={activeStep}>
                  <Step>
                    <StepLabel>
                      Information Gathering
                    </StepLabel>
                  </Step>

                  <Step>
                    <StepLabel>
                      Application Details
                    </StepLabel>
                  </Step>


                  <Step>
                    <StepLabel>
                      Deployment Architecture of the application
                    </StepLabel>
                  </Step>

                  <Step>
                    <StepLabel>
                      Network/Infra Connectivity
                    </StepLabel>
                  </Step>

                  <Step>
                    <StepLabel>
                      Application Implementation
                    </StepLabel>
                  </Step>

                  <Step>
                    <StepLabel>
                      Enterprise Backup Configuration
                    </StepLabel>
                  </Step>

                  <Step>
                    <StepLabel>
                      ZPA VPN Onboarding
                    </StepLabel>
                  </Step>

                </Stepper>

              </div>
            }

            <div className="h-full overflow-scroll">

              {
                (activeStep == 10) &&
                <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Information Gathering</div>
              }
              {
                <div className="mx-3" style={{ display: (activeStep == 0 || activeStep == 10) ? 'block' : 'none' }}>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Name of Requester :
                      </label>
                      <input
                        name="nameOfRequester"
                        type="text"
                        placeholder="Type here"
                        value={informationGathering.nameOfRequester}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleInformationGatheringChange}
                        required
                      />
                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> CSP Selection :
                      </label>

                      <div className="flex justify-start flex-wrap gap-5 px-4 py-2">
                        <div>
                          <input
                            type="radio"
                            value="AWS"
                            name="cspSelection"
                            onChange={handleInformationGatheringChange}
                          />
                          <label className="text-md ml-2">AWS</label>
                        </div>

                        <div>
                          <input
                            type="radio"
                            value="Azure"
                            name="cspSelection"
                            onChange={handleInformationGatheringChange}
                          />
                          <label className="text-md ml-2">Azure</label>
                        </div>

                        {/* <div>
                                <input 
                                type="radio" 
                                value="GCP" 
                                name="cspSelection"
                                onChange={handleInformationGatheringChange}
                                />
                                <label className="text-md ml-2">GCP</label>
                              </div>
                    
                              <div>                        
                                <input 
                                type="radio" 
                                value="Oracle" 
                                name="cspSelection"
                                onChange={handleInformationGatheringChange}
                                />
                                <label className="text-md ml-2">Oracle</label>
                              </div> */}

                      </div>
                    </div>

                  </div>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">
                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Business Name :
                      </label>
                      <input
                        name="businessName"
                        type="text"
                        placeholder="Type here"
                        value={informationGathering.businessName}
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleInformationGatheringChange}
                        required
                        readOnly
                      />
                    </div>

                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Current Mode of operation :
                      </label>

                      <div className="relative">
                        <input
                          name="currentModeOfOperation"
                          type="text"
                          placeholder="Type here"
                          value={informationGathering.currentModeOfOperation}
                          className="w-full py-2 border border-gray-300 rounded shadow px-4"
                          onChange={handleInformationGatheringChange}
                          required
                        />

                        <Tooltip title="Understand how existing cloud applications are currently utilized within the business operations." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-2">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                  </div>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">
                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Subscription name :
                      </label>

                      <div className="relative">
                        <select
                          name="subscriptionName"
                          placeholder="Type here"
                          value={informationGathering.subscriptionName}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleInformationGatheringChange}
                          required
                        >

                          {/* condtional rendering based on state of subs for select option */}
                          {
                            subs == undefined && <option value="" disabled>Please Select CSP</option>
                          }
                          {
                            subs && subs.length == 0 && <option value="" disabled>Please Select CSP</option>
                          }
                          {
                            subs && subs.length > 0 && <option value="" disabled>Select Subscription</option>
                          }
                          {
                            subs && subs.length && subs.map((sub: any) => {
                              return <option key={sub.subsAccId} value={sub.subsAccId}>{sub.subsAccName}</option>
                            })
                          }
                        </select>

                        <Tooltip title="Enter the name of the Cloud subscription associated with the deployment." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>
                      </div>

                    </div>

                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Work Description :
                      </label>

                      <div className="relative">
                        <input
                          name="workDescription"
                          type="text"
                          placeholder="Type here"
                          value={informationGathering.workDescription}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleInformationGatheringChange}
                          required
                        />

                        <Tooltip title="Provide a detailed description scope of work of the projects, or activities associated with the deployment or optimization of cloud services or applications." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>
                    </div>

                  </div>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">
                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        Name of Sponser :
                      </label>
                      <input
                        name="nameOfSponsor"
                        type="text"
                        placeholder="Type here"
                        value={informationGathering.nameOfSponsor}
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleInformationGatheringChange}
                        required
                      />
                    </div>

                    <div className="mb-3 flex-1">

                    </div>
                  </div>

                </div>
              }


              {
                (activeStep == 10) &&
                <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Application Details</div>
              }

              {

                <div className="mx-3" style={{ display: (activeStep == 1 || activeStep == 10) ? 'block' : 'none' }}>
                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    {/* <div className="mb-3 flex-1">

                            <label className="block text-md font-semibold mb-2">
                             <span className="text-red-500 text-md font-bold">*</span> Preferred Cloud Provider :
                            </label>
                            <select
                              // name="preferredCloudProvider"
                              // value={applicationDetails.preferredCloudProvider}
                              onChange={handleApplicationDetailsChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              required
                              >
                                <option value="" disabled>
                                  Select Cloud Provider
                                </option>
                                <option value="AWS">AWS</option>
                                <option value="Azure">Azure</option>
                                <option value="Oracle Cloud">Oracle Cloud</option>
                                <option value="Google Cloud">Google Cloud</option>
                                <option value="Others">Others</option>
                              </select>

                          </div> */}


                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Application Name :
                      </label>
                      <input
                        name="applicationName"
                        type="text"
                        placeholder="Type here"
                        value={applicationDetails.applicationName}
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleApplicationDetailsChange}
                        required
                      />

                    </div>

                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        Purpose of the application :
                      </label>

                      <div className="relative">
                        <input
                          name="purposeOfTheApplication"
                          type="text"
                          placeholder="Type here"
                          value={applicationDetails.purposeOfTheApplication}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleApplicationDetailsChange}
                          required
                        />

                        <Tooltip title="Define the primary objective or function of the application within the business context." placement="top-end">
                          <button className="absolute top-0 right-4 p-2 bg-transparent cursor-pointer">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>
                    </div>


                  </div>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">


                    {/* <div className="mb-3 flex-1">
                            <label className="block text-md font-semibold mb-2">
                            Application version (Existing) :
                            </label>
                            <input
                              // name="applicationVersionExisting"
                              type="text"
                              placeholder="Type here"
                              // value={applicationDetails.applicationVersionExisting}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              onChange={handleApplicationDetailsChange}
                              required
                            />
                          </div> */}

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        Application Criticality :
                      </label>

                      <div className="relative">
                        <select
                          name="applicationCriticality"
                          value={applicationDetails.applicationCriticality}
                          onChange={handleApplicationDetailsChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        >
                          <option value="" disabled>
                            Select Application Criticality
                          </option>
                          <option value="Business Critical">Business Critical</option>
                          <option value="Mission Critical">Mission Critical</option>
                          <option value="Low Criticality">Low Criticality</option>
                          <option value="Medium Criticality">Medium Criticality</option>
                          <option value="High Criticality">High Criticality</option>
                        </select>

                        <Tooltip title="Assess the level of importance of the application to the business operations to determine prioritization and resource allocation." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>


                      </div>

                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Nature of the application :
                      </label>

                      <div className="relative">
                        <select
                          name="natureOfTheApplication"
                          value={applicationDetails.natureOfTheApplication}
                          onChange={handleApplicationDetailsChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        >
                          <option value="" disabled>
                            Select Nature
                          </option>
                          <option value="Web Application">Web Application</option>
                          <option value="API Based">API Based</option>
                          <option value="Serverless">Serverless</option>
                          <option value="Containerized">Containerized</option>
                          <option value="Others">Others</option>
                        </select>

                        <Tooltip title="Categorize the application based on its type or function (e.g., CRM, ERP, collaboration) for better management and resource allocation." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                  </div>

                  {/* <div className="my-5 mx-2 flex justify-evenly gap-10">

                          <div className="mb-3 flex-1">
                            <label className="block text-md font-semibold mb-2">
                              Application version (New) :
                            </label>
                            <input
                              name="applicationVersionNew"
                              type="text"
                              placeholder="Type here"
                              value={applicationDetails.applicationVersionNew}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              onChange={handleApplicationDetailsChange}
                              required
                            />
                          </div>
                        
                        </div> */}

                  {/* <div className="my-5 mx-2 flex justify-evenly gap-10">

                          <div className="mb-3 flex-1">
                      
                            <label className="block text-md font-semibold mb-2">
                              <span className="text-red-500 text-md font-bold">*</span> Nature of the application :
                            </label>
                            <select
                              name="natureOfTheApplication"
                              value={applicationDetails.natureOfTheApplication}
                              onChange={handleApplicationDetailsChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              required
                              >
                                <option value="" disabled>
                                  Select Nature
                                </option>
                                <option value="Standalone">Standalone</option>
                                <option value="Multi-tier">Multi-tier</option>
                              </select>

                          </div>
                      
                          <div className="mb-3 flex-1">
                      
                            <label className="block text-md font-semibold mb-2">
                              <span className="text-red-500 text-md font-bold">*</span> Modules of Application :
                            </label>
                            <select
                              // name="modulesOfApplication"
                              // value={applicationDetails.modulesOfApplication}
                              onChange={handleApplicationDetailsChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              required
                              >
                                <option value="" disabled>
                                  Select Module
                                </option>
                                <option value="App">App</option>
                                <option value="Database">Database</option>
                                <option value="Jump Box">Jump Box</option>
                              </select>

                          </div>
                      
                        </div> */}

                </div>
              }



              {
                (activeStep == 10) &&
                <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Deployement Architecuture of the application</div>
              }


              {

                <div className="mx-3" style={{ display: (activeStep == 2 || activeStep == 10) ? 'block' : 'none' }}>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Application Internet exposed :
                      </label>

                      <div className="relative">
                        <select
                          name="applicationInternetExposed"
                          value={deploymentArchitectureOfTheApplication.applicationInternetExposed}
                          onChange={handleDeploymentArchitectureChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>


                        <Tooltip title="Confirm whether the application needs to be accessible over the internet for users outside the organization or not." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Environment of application :
                      </label>

                      <div className="relative">
                        <select
                          name="environmentOfApplication"
                          value={deploymentArchitectureOfTheApplication.environmentOfApplication}
                          onChange={handleDeploymentArchitectureChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        >
                          <option value="" disabled>
                            Select Environment
                          </option>
                          <option value="Production">Production</option>
                          <option value="Development">Development</option>
                          <option value="Testing">Testing</option>
                          <option value="Staging">Staging</option>
                          <option value="UAT">UAT</option>
                          <option value="POC">POC</option>
                          <option value="Pilot">Pilot</option>
                        </select>

                        <Tooltip title="Specify the deployment environment of the application, such as development, testing, or production, to manage resources effectively." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> High Availability Required :
                      </label>

                      <div className="flex gap-2">

                        <div className="relative flex-1">
                          <select
                            name="highAvailabilityRequired"
                            value={deploymentArchitectureOfTheApplication.highAvailabilityRequired}
                            onChange={handleDeploymentArchitectureChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow flex-1"
                            placeholder="Type Here"
                          >

                            <option value="" disabled>Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>

                          </select>

                          <Tooltip title="Determine if the application requires high availability architecture to ensure uninterrupted access and reliability." placement="top-end">
                            <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                              <InfoOutlinedIcon />
                            </button>
                          </Tooltip>

                        </div>

                        <input
                          type="text"
                          name="highAvailabilityRequiredText"
                          value={deploymentArchitectureOfTheApplication.highAvailabilityRequiredText}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow flex-1"
                          onChange={handleDeploymentArchitectureChange}
                          placeholder="Type Here" />

                      </div>

                    </div>

                  </div>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        Disaster Recovery Requirement :
                      </label>

                      <div className="relative">
                        <input
                          name="disasterRecoveryRequirement"
                          type="text"
                          placeholder="Type here"
                          value={deploymentArchitectureOfTheApplication.disasterRecoveryRequirement}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleDeploymentArchitectureChange}
                          required
                        />

                        <Tooltip title="Define the disaster recovery strategy or requirements for the application to mitigate risks and ensure business continuity." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>
                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Access management :
                      </label>
                      <input
                        value={deploymentArchitectureOfTheApplication.accessManagement}
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        list="accessManagement"
                        placeholder="Type Here"
                        name="accessManagement"
                        onChange={handleDeploymentArchitectureChange}
                      />
                      <datalist id="accessManagement">
                        <option value="Reader">Reader</option>
                        <option value="Read-write">Read-write</option>
                        <option value="Owner">Owner</option>
                      </datalist>


                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        Future Mode of Operation :
                      </label>

                      <div className="relative">
                        <input
                          name="futureModeOfOperation"
                          type="text"
                          placeholder="Type here"
                          value={deploymentArchitectureOfTheApplication.futureModeOfOperation}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleDeploymentArchitectureChange}
                          required
                        />

                        <Tooltip title="Outline the envisioned future state or upgrades for business applications to align with evolving business needs and technological advancements." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.5rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                  </div>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">
                        Virutal Network Name :
                      </label>
                      <input
                        name="virtualNetworkName"
                        type="text"
                        placeholder="Type here"
                        value={deploymentArchitectureOfTheApplication.virtualNetworkName}
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleDeploymentArchitectureChange}
                        required
                      />
                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        Additional Comments :
                      </label>
                      <input
                        name="additionalComments"
                        type="text"
                        placeholder="Type here"
                        value={deploymentArchitectureOfTheApplication.additionalComments}
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleDeploymentArchitectureChange}
                        required
                      />

                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        Attachments :
                      </label>

                      <div className="relative">
                        <input
                          name="attachments"
                          type="file"
                          placeholder="Type here"

                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleAttachmentChange}
                        />

                        <Tooltip title="Allow users to upload relevant documents or files related to the application for reference and documentation purposes.(Eg. Application diagram, etc)" placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.5rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                  </div>

                  {excelArray.map((element, index: number) => {
                    return <div key={index} className="mt-5 mx-2 flex justify-evenly gap-10">

                      <div className="mb-3 flex-1">

                        <label className="block text-md font-semibold mb-2">
                          Cloud Provisioning :
                        </label>
                        <select
                          name="cloudProvisioning"
                          value={excelArray[index]}
                          onChange={(event) =>
                            handleExcelSelectChange(event, index)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        >
                          <option value="" disabled>
                            Select
                          </option>

                          <option value="Virtual Machine">Virtual Machine</option>
                          <option value="Version Control">Version Control</option>
                          <option value="Application Gateway">Application Gateway</option>
                          <option value="App Service">App Service</option>
                          <option value="PaaS DB">PaaS DB</option>
                          <option value="Kubernetes">Kubernetes</option>
                          <option value="Key Vault">Key Vault</option>
                          <option value="Storage Account">Storage Account</option>
                          <option value="Databricks">Databricks</option>
                          <option value="Data Factory">Data Factory</option>
                          <option value="Event Hub">Event Hub</option>
                          <option value="Function App">Function App</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Logic Apps">Logic Apps</option>
                          <option value="API Management Service">API Management Service</option>
                          <option value="Container Registry">Container Registry</option>
                          <option value="Open AI">Open AI</option>
                          <option value="AI Search">AI Search</option>
                          <option value="AI Document Intelligence">AI Document Intelligence</option>
                          <option value="Web PubSub">Web PubSub</option>
                        </select>

                      </div>

                      <div className="mb-3 flex-1">

                        <label className="block text-md font-semibold mb-2">
                          Cloud Provisioning Template :
                        </label>

                        <a href={"/" + excelArray[index].replace(/\s/g, '') + ".xlsx"} download={excelArray[index].replace(/\s/g, '') + ".xlsx"}>
                          <button className="w-full px-4 py-2 border border-gray-300 rounded shadow disabled:cursor-not-allowed" disabled={!excelArray[index]}> Download Excel Template</button>
                        </a>

                      </div>

                      <div className="flex-1">


                        <label className="text-md font-semibold flex justify-between">
                          <p>
                            {
                              (index == 0) &&
                              <span className="text-red-500 text-md font-bold">* </span>
                            }
                            Upload Excel Sheet
                          </p>
                          {
                            (index > 0) &&
                            <button className="font-bold text-2xl" onClick={() => { decrementFileCount(index) }}>-</button>
                          }
                        </label>

                        <input
                          type="file"
                          disabled={!excelArray[index]}
                          className=" w-full px-4 py-2 border border-gray-300 rounded shadow disabled:cursor-not-allowed"
                          onChange={(event) => { handleDeploymentArchitectureOfTheApplicationFileUpload(event, index) }}
                        />

                      </div>

                    </div>

                  })}

                  <div className="flex justify-end mb-5 mx-2">
                    <button className="font-bold text-2xl" title="add more" onClick={incrementFileCount}>+</button>
                  </div>

                </div>
              }

              {
                (activeStep == 10) &&
                <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Network Infra Connectivity</div>
              }

              {
                <div className="mx-3" style={{ display: (activeStep == 3 || activeStep == 10) ? 'block' : 'none' }}>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> CIDR Range :
                      </label>

                      <div className="relative">

                        <select
                          name="cidrRange"
                          value={networkInfraConnectivity.cidrRange}
                          onChange={handleNetworkInfraConnectivityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="/29">/29</option>
                          <option value="/28">/28</option>
                          <option value="/27">/27</option>
                          <option value="/26">/26</option>
                          <option value="/25">/25</option>
                          <option value="/24">/24</option>
                          <option value="/23">/23</option>
                          <option value="/22">/22</option>

                        </select>

                        <Tooltip title="Specify the Classless Inter-Domain Routing (CIDR) network range for the application to control network traffic." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        Port Opening Form :
                      </label>

                      <a href="/fireWallChangeRequestFile.xlsm" download="fireWallChangeRequestFile.xlsm">
                        <div className="relative">
                          <button
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow">
                            Download Excel Template
                          </button>

                          <Tooltip title="Provide details for opening specific ports required for the application to communicate with external systems or services securely." placement="top-end">
                            <div className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                              <InfoOutlinedIcon />
                            </div>
                          </Tooltip>
                        </div>
                      </a>

                    </div>


                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Upload
                      </label>

                      <input type="file" className="my-2" onChange={handleFireWallChangeRequestFileUpload} />

                    </div>

                  </div>

                </div>
              }


              {
                (activeStep == 10) &&
                <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Application Implementation</div>
              }

              {
                <div className="mx-3" style={{ display: (activeStep == 4 || activeStep == 10) ? 'block' : 'none' }}>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">* </span> Custom Domain URL :
                      </label>

                      <div className="relative">
                        <input
                          name="customDomainURL"
                          type="text"
                          placeholder="Type here"
                          value={applicationImplementation.customDomainURL}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleApplicationImplementationChange}
                          required
                        />

                        <Tooltip title="Define a custom domain name or URL for accessing the application to enhance branding and user experience." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>
                      </div>

                    </div>

                    <div className="mb-3 flex-1">


                      <label className="block text-md font-semibold mb-2">
                        Apply SSL Certificate :
                      </label>

                      <div className="relative">

                        <select
                          name="applySSLCertificate"
                          placeholder="Type here"
                          value={applicationImplementation.applySSLCertificate}
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          onChange={handleApplicationImplementationChange}
                          required
                        >
                          <option value="" disabled>Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>

                        <Tooltip title="Specify whether a custom SSL certificate will be provided by the user or if a cloud-managed certificate service will be utilized." placement="top-end">
                          <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                            <InfoOutlinedIcon />
                          </button>
                        </Tooltip>

                      </div>

                    </div>

                    <div className="mb-3 flex-1">
                      <label className="block text-md font-semibold mb-2">SSL Info</label>
                      <input
                        name="sslCertificateInfo"
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        type="text"
                        placeholder="Type here"
                        onChange={handleApplicationImplementationChange}
                      />
                    </div>

                  </div>

                </div>
              }


              {
                (activeStep == 10) &&
                <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Enterprise Backup Configuration</div>
              }

              {
                <div className="mx-3" style={{ display: (activeStep == 5 || activeStep == 10) ? 'block' : 'none' }}>

                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        Back up Request Template :
                      </label>

                      <a href="/backupRequestFile.xlsx" download="backupRequestFile.xlsx">
                        <div className="relative">
                          <button className="w-full px-4 py-2 border border-gray-300 rounded shadow"> Download Excel Template</button>
                          <Tooltip title="Specify backup preferences and frequency for application data to ensure data integrity and resilience against data loss." placement="top-end">
                            <div className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                              <InfoOutlinedIcon />
                            </div>
                          </Tooltip>
                        </div>
                      </a>

                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        {/* if buiness critical/ mission critical / production then back up request file is mandatory */}
                        {(applicationDetails.applicationCriticality == 'Business Critical' || applicationDetails.applicationCriticality == 'Mission Critical' || deploymentArchitectureOfTheApplication.environmentOfApplication == 'Production') &&
                          <span className="text-red-500 text-md font-bold">* </span>}
                        Upload Back Up Request Excel Sheet
                      </label>

                      <input
                        type="file"
                        className=" w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleEnterpriseBackupConfigurationFileUpload} />

                    </div>

                  </div>

                </div>
              }

              {
                (activeStep == 10) &&
                <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">ZPA VPN Onboarding</div>
              }

              {
                <div className="mx-3" style={{ display: (activeStep == 6 || activeStep == 10) ? 'block' : 'none' }}>
                  <div className="my-5 mx-2 flex justify-evenly gap-10">

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        ZPA VPN Template :
                      </label>

                      <a href="/zpaVpnFile.xlsx" download="zpaVpnFile.xlsx">
                        <div className="relative">
                          <button className="w-full px-4 py-2 border border-gray-300 rounded shadow"> Download Excel Template</button>
                          <Tooltip title="Initiate the setup and onboarding process for Virtual Private Network (VPN) connections if required for secure access to the application." placement="top-end">
                            <div className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                              <InfoOutlinedIcon />
                            </div>
                          </Tooltip>
                        </div>
                      </a>

                    </div>

                    <div className="mb-3 flex-1">

                      <label className="block text-md font-semibold mb-2">
                        <span className="text-red-500 text-md font-bold">*</span> Upload ZPA VPN Excel Sheet
                      </label>

                      <input
                        type="file"
                        className=" w-full px-4 py-2 border border-gray-300 rounded shadow"
                        onChange={handleZPAVPNOnboardingFileUpload}
                      />

                    </div>

                  </div>
                </div>
              }

            </div>

            <div className="flex justify-end my-3">

              {
                (activeStep > 0 && activeStep < 7) &&
                <button
                  onClick={backward}
                  style={{
                    background:
                      "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
                  }}
                  className="text-white p-2 rounded-lg w-24 mx-2">
                  Previous
                </button>
              }

              {
                (activeStep < 6) &&
                <button
                  onClick={forward}
                  disabled={!validate()}
                  style={{
                    background: (validate()) ? "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)" : "	#DCDCDC"
                  }}
                  className="text-white p-2 rounded-lg w-24 mx-2"
                >
                  Next
                </button>
              }

              {
                (activeStep == 6) &&
                <button
                  onClick={() => { setActiveStep(10) }}
                  disabled={!validate()}
                  style={{
                    background: (validate()) ? "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)" : "	#DCDCDC"
                  }}
                  className="text-white p-2 rounded-lg w-24 mx-2"
                >
                  Save
                </button>
              }

              {
                (activeStep == 10) &&
                <button
                  disabled={!validate()}
                  style={{
                    background: (validate()) ? "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)" : "	#DCDCDC"
                  }}
                  className="text-white p-2 rounded-lg w-24 mx-2 flex justify-center item-center"
                  onClick={handleSaveAll}
                >
                  {buttonLoader ? <CircularProgress size="1.7rem" color="inherit" /> : <p>Save All</p>}
                </button>
              }

            </div>

          </div>

        </div>
      }

      {/* Modal to view the request detail */}
      {isViewOpen && <ViewRequest dailogClass={dailogClass} closeViewDialog={closeViewDialog} requestInformation={requestInformation} downloadFile={downloadFile} sendApproval={sendApproval} userRole={userRole} />}

    </div>
  )
}


export default Request;