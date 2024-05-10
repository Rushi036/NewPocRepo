"use client"
import { Stepper,Step,StepLabel, Input, dialogClasses} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
// import InfoOutlinedIcon from '@mui/icons-material/InfoRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import React, {useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Truculenta } from "next/font/google";
import { fetchSubcriptions } from "@/pages/api/ActiveServiceRequestApis/apis";
import { fetchUsers, raiseRequest, fetchCloudServiceSheet,updateRequest} from "@/pages/api/ActiveServiceRequestApis/apis";
import { fileURLToPath } from "url";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { finopsServerBaseUrl } from "@/const";



function Request()
{

    // state for stroring the user role
    const [userRole,setUserRole] = useState<any>('');
    // state for opening and closing the modal
    const [isOpen, setIsOpen] = useState(false);

    // state for openeing and closing the upload document for admin for uploading the document
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // state for opening and closing view request info modal
    const [isViewOpen,setIsViewOpen] = useState(false);

    // state for storing the name of file selected to upload
    const [excelArray,setExcelArray] = useState(['']);

    // state for stepper active state // 10 is active step for preview of all the form
    const [activeStep,setActiveStep] = useState(0);

    // state for storing search (filter)
    const [searchQuery,setSearchQuery] = useState<any>('')

    // state for storing subscritptions 
    const [subs,setSubs] = useState<any>([]);

    // state for storing request information
    const [requestInformation,setRequestInformation] = useState<any>(null);

    // states for storing table data
    const [tableData,setTableData] = useState<any>({});
    const [tableArray,setTableArray] = useState<any>([]);

    const [currentPage, setCurrentPage] = useState<any>(1);
    const [itemsPerPage] = useState<any>(5);

    // states setting loading on and off
    const [isLoading,setIsLoading] = useState<any>(false);

    // filtering the data based on search query
    const filteredData = 
    tableArray && tableArray.filter((d:any,i:any)=>
    {
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
  
    interface InformatioGathering
    {
      nameOfRequester:string,
      nameOfSponsor:string,
      businessName:string,
      currentModeOfOperation:string,
      cspSelection:string,
      workDescription:string
      subscriptionName:string
    }

  
    // states for storing the data (Information Gathering)
    const [informationGathering,setInformationGathering] = useState<InformatioGathering>({
      nameOfRequester:"",
      nameOfSponsor:"",
      businessName:"",
      currentModeOfOperation:"",
      cspSelection:"",
      workDescription:"",
      subscriptionName:""
    });
  
    // states for storing the data (Application Details)
    const [applicationDetails,setApplicationDetails] = useState({
      // preferredCloudProvider:"",
      applicationName:"",
      purposeOfTheApplication:"",
      // applicationVersionExisting:"",
      // applicationVersionNew:"",
      applicationCriticality:"",
      natureOfTheApplication:"",
      // modulesOfApplication:""
    });
  
  
    // data type of DeploymentArchitectureOfTheApplication useState
    interface DeploymentArchitectureOfTheApplication
    {
        applicationInternetExposed:string,
        environmentOfApplication:string,
        highAvailabilityRequired:string,
        highAvailabilityRequiredText:string,
        disasterRecoveryRequirement:string,
        accessManagement:string,
        futureModeOfOperation:string,
        additionalComments:string,
        virtualNetworkName:string,
        attachments:{name:string,type:string,fileString:string},
        excelFile:{name:string,fileString:string}[]
    }
  
    // states for storing the data 
    const [deploymentArchitectureOfTheApplication,setDeploymentArchitectureOfTheApplication] = useState<DeploymentArchitectureOfTheApplication>(
      {
        applicationInternetExposed:"",
        environmentOfApplication:"",
        highAvailabilityRequired:"",
        highAvailabilityRequiredText:"",
        disasterRecoveryRequirement:"",
        accessManagement:"",
        futureModeOfOperation:"",
        additionalComments:"",
        virtualNetworkName:"",
        attachments: {name:"",type:"",fileString:""},
        excelFile:[] = new Array(20)
      }
    );
  
  
    interface NetworkInfraConnectivityState {
      cidrRange: string;
      excelFile: {name:string,fileString:string}[];
    }
  
    // state for storing the data (network infra connectivity)
    const [networkInfraConnectivity,setNetworkInfraConnectivity] = useState<NetworkInfraConnectivityState>({
      cidrRange:"",
      excelFile:[] = new Array(1)
    })
  
  
    // states for storing the data (application implementation)
    const [applicationImplementation,setApplicationImplementation] = useState({
      customDomainURL:"",
      applySSLCertificate:"",
      sslCertificateInfo:""
      // dnsMapping:""
    })
  
  
    interface EnterpriseBackupConfiguration{
      // numberOfServersDatabases:string,
      excelFile: {name:string,fileString:string}[];
    }
  
    // state for storing data (enterprise Backup Configuration)
    const [enterpriseBackupConfiguration,setEnterpriseBackupConfiguration] = useState<EnterpriseBackupConfiguration>({
      // numberOfServersDatabases:"",
      excelFile:[] = new Array(1)
    })
  
  
  
    interface zPAVPNOnboarding{
      excelFile: {name:string,fileString:string}[];
    }
    // state for storing data (ZPA VPN Onboarding)
    const [ZPAVPNOnboarding,setZPAVPNOnboarding] = useState<zPAVPNOnboarding>({
      excelFile:[] = new Array(1)
    })


    // state for the storing design document and more
    interface CloudDocuments {
      requestId?:string,
      designDocument:{name:string,fileString:string},
      anotherDocument:{name:string,fileString:string},
      comment:string
    }

    const [adminCloudDocuments,setAdminCloudDocuments] = useState<CloudDocuments>({
      requestId:"",
      designDocument:{name:"",fileString:""},
      anotherDocument:{name:"",fileString:""},
      comment:""
    });

    // function for getting extension of the file
    const handleAdminFileDonwload = (fileName:any,fileString:any) =>
    {
      const fileParts = fileName.split('.').pop();

      switch(fileParts)
      {
        case "xlsx":
          // function to be invoked for xlsx
          convertStringToExcelFile(fileString,fileName);
        break;

        case "xlsm":
          // function to be invoked for xlsm
          convertStringToXLSMFile(fileString,fileName);
        break;

        case "pdf":
          //function to be invoked for pdf
        break;
      }
    }
  

    // function to change the state of cloudDocments
    const handleAdminCloudDocuments = (e:any) =>
    {
      const {name,value} = e.target;

      setAdminCloudDocuments((prevData)=>({
        ...prevData,
        [name]: value
      }))
    }

    // function to handle the upload documents of admin cloud documents
    const handleFileUploadAdminCloudDocuments = (e:any) =>
    {
      
      const name = e.target.name;
      const selectedFile = e.target.files && e.target.files[0];
      const fileName = selectedFile && selectedFile.name;

      if(selectedFile)
      {
        console.log("converting");
        let base64String: any;
        const reader = new FileReader();
        reader.onload = () => {
            base64String = reader.result?.toString().split(',')[1];

            let object = {name:fileName,fileString:base64String}
            console.log(base64String);

            setAdminCloudDocuments((prevData)=>({
              ...prevData,
              [name]: object
            }))
          
        };
        reader.readAsDataURL(selectedFile);
      }
      
    }

    const closeAdminDocumentModal = () =>
    {
      setIsUploadOpen(false);
      const obj:CloudDocuments = 
      {
        requestId:"",
        designDocument:{name:"",fileString:""},
        anotherDocument:{name:"",fileString:""},
        comment:""
      }

      setAdminCloudDocuments(obj);
    }

    // function to send/save/upload admin added documents
    const saveAdminCloudDocument = async () =>
    {
      
      let data = {...adminCloudDocuments};
      let id = data.requestId;
      delete data.requestId;

      try
      {
        let response = await fetch(`http://192.168.2.102:1010/api/uploadDocument/${id}`,
          {
            method: "PUT",
            body:JSON.stringify({adminCloudDocuments:data}),
            headers: {
              "Content-Type": "application/json",
          },
          }
        );

        if(response.status == 200)
        {
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
        else
        {
          toast.error("Some error occured, try again", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });
        }

      }
      catch(e)
      {
        toast.error("Some error occured, try again", 
        {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
      finally
      {
        closeAdminDocumentModal();
      }
    }

    // function to handle accept or reject from the business user
    const sendApproval = async (requestId:any,status:any) =>
    {
      try
      {
        const response = await fetch(`http://192.168.2.102:1010/api/${requestId}/status?status=${status}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        if(response.status == 200)
        {
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
        else
        {
          toast.error("Some error occured, try again", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      }
      catch(e)
      {
        toast.error("Some error occured, try again", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });
      }
    }
  
    // funcion to change state of intomation gathering change
    const handleInformationGatheringChange = (e: any) =>
    {
      const {name,value} = e.target;
      setInformationGathering((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  
    // function to change the state of application details
    const handleApplicationDetailsChange = (e: any) =>
    {
      const {name,value} = e.target;
      setApplicationDetails((prevData) => ({
        ...prevData,
        [name]:value
      }))
    }
  
    // function to change deployement architecture details
    const handleDeploymentArchitectureChange = (e:any) =>
    {
      const {name,value} = e.target;
      setDeploymentArchitectureOfTheApplication((prevData) => ({
        ...prevData,
        [name]:value
      }))
    }

    const handleNetworkInfraConnectivityChange = (e:any) =>
    {
      const {name,value} = e.target;
      setNetworkInfraConnectivity((prevData) => ({
        ...prevData,
        [name]:value
      }))
    }
  
    // function to change application implementation
    const handleApplicationImplementationChange = (e:any) =>
    {
      const {name, value} = e.target;
      setApplicationImplementation((prevData) => ({
        ...prevData,
        [name]:value
      }))
    }
  
    // function to convert excel file to string
    function converExcelToString(selectedFile:any)
    {
        if(selectedFile)
        {
          console.log("converting");
          let base64String: any;
          const reader = new FileReader();
          reader.onload = () => {
              base64String = reader.result?.toString().split(',')[1];
              // setFileString(base64String || '');
          };
          reader.readAsDataURL(selectedFile);
        }
    }
  
    // function for uploading excel file (firewallChangeRequestFile)
    const handleFireWallChangeRequestFileUpload = (event:any) =>
    {
      const selectedFile = event.target.files && event.target.files[0];
      
      let array = [...networkInfraConnectivity.excelFile];
  
      if(selectedFile)
      {
          let base64String: any;
          const reader = new FileReader();
          reader.onload = () => {
              base64String = reader.result?.toString().split(',')[1];
  
              array = array.map((record,i) =>
              {
                
                if(i == 0)
                {
                  console.log("yes")
                  return {name:"fireWallChangeRequestFile",fileString:base64String}
                }
                else 
                {
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
    const handleZPAVPNOnboardingFileUpload = (event:any) =>
    {
      const selectedFile = event.target.files && event.target.files[0];
  
      let array = [...ZPAVPNOnboarding.excelFile];
  
      if(selectedFile)
      {
          console.log("converting");
          let base64String: any;
          const reader = new FileReader();
          reader.onload = () => {
              base64String = reader.result?.toString().split(',')[1];
  
              array = array.map((record,i) =>
              {
                
                if(i == 0)
                {
                  console.log("yes")
                  return {name:"zpaVpnFile",fileString:base64String}
                }
                else 
                {
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
    const handleEnterpriseBackupConfigurationFileUpload = (event:any) =>
    {
      const selectedFile = event.target.files && event.target.files[0];
  
      let array = [...enterpriseBackupConfiguration.excelFile];
  
      if(selectedFile)
      {
          console.log("converting");
          let base64String: any;
          const reader = new FileReader();
          reader.onload = () => {
              base64String = reader.result?.toString().split(',')[1];
  
              array = array.map((record,i) =>
              {
                
                if(i == 0)
                {
                  console.log("yes")
                  return {name:"backupRequestFile",fileString:base64String}
                }
                else 
                {
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
    const handleDeploymentArchitectureOfTheApplicationFileUpload = (event:any,index:number) =>
    {
      const selectedFile = event.target.files && event.target.files[0];
  
      let array = [...deploymentArchitectureOfTheApplication.excelFile];

      const regex = /\.[^.]*$/;
  
      if(selectedFile)
      {
          console.log("converting");
          let base64String: any;
          const reader = new FileReader();
          reader.onload = () => {
              base64String = reader.result?.toString().split(',')[1];
  
              array = array.map((record,i) =>
              {
                
                if(i == index)
                {
                  return {name:selectedFile.name.replace(regex, ''),fileString:base64String}
                }
                else 
                {
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
    const incrementFileCount = () =>
    {
      if(excelArray.length < 20)
      {
        setExcelArray(prev => [...prev , ""]);
      }
    }

    const decrementFileCount = (index:any) =>
    {
      let array = [...excelArray];
      
      // array = array.filter((i) =>
      // {
      //   if(index == i)
      //     return false;
      //   else
      //     return true;
      // });

      array.splice(index,1);

      // console.log(array);

      setExcelArray([...array]);

      let temp = [...deploymentArchitectureOfTheApplication.excelFile];

      console.log(temp);

      temp.splice(index,1);

      console.log(temp);

      let newArray = new Array(20);

      for(let i = 0; i < temp.length; i++)
      {
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
    function handleExcelSelectChange(e:any,index:number)
    {
      let name= e.target.value;
      let array = [...excelArray];
      array[index] = name;
      setExcelArray(array);
    }

    function handleAttachmentChange(event:any)
    {
      const selectedFile = event.target.files && event.target.files[0];

      let obj = {...deploymentArchitectureOfTheApplication.attachments};
      obj.name = selectedFile.name;
      const fileNameParts = selectedFile.name.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
      obj.type = fileExtension;

      if(selectedFile)
      {
        console.log("converting");
        let base64String: any;
        const reader = new FileReader();
        reader.onload = () => 
        {
          base64String = reader.result?.toString().split(',')[1];
  
          obj.fileString = base64String;
            
  
          setDeploymentArchitectureOfTheApplication(prevState => ({
              ...prevState,
              attachments:obj
             }));
        };

        reader.readAsDataURL(selectedFile);
      }
          
    }

   
    function forward()
    {
      if(activeStep < 6)
        setActiveStep(prev => prev + 1);
    }
  
    function backward()
    {
      if(activeStep > 0)
        setActiveStep(prev => prev - 1);
    }
  
    const refreshDialog = () =>
    {
      setActiveStep(0);
      setExcelArray(['']);
   
      setInformationGathering({
        nameOfRequester: sessionStorage.getItem("userName") || "",
        nameOfSponsor:"",
        businessName: sessionStorage.getItem("businessName") || "",
        currentModeOfOperation:"",
        cspSelection:"",
        workDescription:"",
        subscriptionName:""
      })

      setApplicationDetails({
        // preferredCloudProvider:"",
        applicationName:"",
        purposeOfTheApplication:"",
        // applicationVersionExisting:"",
        // applicationVersionNew:"",
        applicationCriticality:"",
        natureOfTheApplication:"",
        // modulesOfApplication:""
      });

      setDeploymentArchitectureOfTheApplication({
        applicationInternetExposed:"",
        environmentOfApplication:"",
        highAvailabilityRequired:"",
        highAvailabilityRequiredText:"",
        disasterRecoveryRequirement:"",
        accessManagement:"",
        futureModeOfOperation:"",
        additionalComments:"",
        virtualNetworkName:"",
        attachments:{name:"",type:"",fileString:""},
        excelFile:[] = new Array(20)
      })

      setNetworkInfraConnectivity({
        cidrRange:"",
        excelFile:[] = new Array(1)
      });

      setApplicationImplementation({
        customDomainURL:"",
        applySSLCertificate:"",
        sslCertificateInfo:""
        // dnsMapping:""
      });

      setEnterpriseBackupConfiguration({
        // numberOfServersDatabases:"",
        excelFile:[] = new Array(1)
      });

      setZPAVPNOnboarding({
        excelFile:[] = new Array(1)
      });

      setSubs([]);
    }
  
    const closeDailog = () =>
    {
      setIsOpen(false);
      refreshDialog();
    }

    // function to validate the required validations
    const validate = () =>
    {
      let isNameOfRequester = informationGathering.nameOfRequester.trim();
      let isBusinessName = informationGathering.businessName.trim();
      let isCurrentModeOfOperation = informationGathering.currentModeOfOperation.trim();
      let iscspSelection = informationGathering.cspSelection.trim();
      let isworkDescription = informationGathering.workDescription.trim();
      let isSubscriptionName = informationGathering.subscriptionName.trim();

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


      if(deploymentArchitectureOfTheApplication.excelFile[0] == undefined)
        isDeploymentArchitectureOfTheApplicationFile = false;
      else
        isDeploymentArchitectureOfTheApplicationFile = true;

      if(networkInfraConnectivity.excelFile.length == 1)
      {
        if(networkInfraConnectivity.excelFile[0] == undefined)
          isnetworkInfraConnectivityFile = false;
        else
          isnetworkInfraConnectivityFile = true;
      }

      if(ZPAVPNOnboarding.excelFile.length == 1)
      {
        if(ZPAVPNOnboarding.excelFile[0] == undefined)
          isZPAVPNOnboardingFile = false;
        else
          isZPAVPNOnboardingFile = true;
      }


      if(applicationDetails.applicationCriticality == 'Business Critical' || applicationDetails.applicationCriticality =='Mission Critical' || deploymentArchitectureOfTheApplication.environmentOfApplication == 'Production')
      {
        if(enterpriseBackupConfiguration.excelFile[0] == undefined)
          isBackUpRequestFile = false;
        else
          isBackUpRequestFile = true;
      }
      else
        isBackUpRequestFile = true;

      if(activeStep == 0)
      {
        
        if(isNameOfRequester && isBusinessName && isCurrentModeOfOperation && iscspSelection && isworkDescription && isSubscriptionName)
          return true;
        else
          return false;
  
      }
      else if(activeStep == 1)
      {

        if(isApplicationName && isNatureOfTheApplication)
          return true;
        else
          return false;
      }
      else if(activeStep == 2)
      {

        if(isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile)
          return true;
        else
          return false;
      }
      else if(activeStep == 3)
      {

        if(isCidrRange && isnetworkInfraConnectivityFile)
          return true;
        else
          return false;
      }
      else if(activeStep == 4)
      {
        if(applicationImplementation.customDomainURL.trim())
          return true;
        else 
          return false;
      }
      else if(activeStep == 5)
      {
        return isBackUpRequestFile;
      }
      else if(activeStep == 6)
      {
        return isZPAVPNOnboardingFile;
      }
      else if(activeStep == 10)
      {
        // if(isNameOfRequester && isBusinessName && isCurrentModeOfOperation && iscspSelection && isworkDescription && isApplicationName && isNatureOfTheApplication && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isCidrRange && isnetworkInfraConnectivityFile && applicationImplementation.customDomainURL.trim())
        // //   console.log(true);
        // // else
        // //   console.log(false);

        if(isNameOfRequester && isBusinessName && isCurrentModeOfOperation && iscspSelection && isworkDescription && isSubscriptionName && isApplicationName && isNatureOfTheApplication && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isapplicationInternetExposed && environmentOfApplication && highAvailabilityRequired && isAccessManagment && isDeploymentArchitectureOfTheApplicationFile && isCidrRange && isnetworkInfraConnectivityFile && applicationImplementation.customDomainURL.trim() && isZPAVPNOnboardingFile && isBackUpRequestFile)
          return true;
        else 
          return false;
      }
      else
        return true;

    }

    // function to invoke fetchSubscriptoin function
    async function getSubs()
    {
      try
      {
        let adid = sessionStorage.getItem('userEmail');
        let cloud = informationGathering.cspSelection;

        let response = await fetch(`${finopsServerBaseUrl}/getUserCloudSubsriptionNameandIds?cloud=${cloud}&adid=${adid}`);

        if(response)
        {
          if(response.ok)
          {
            let data = await response.json();
            setSubs(data.data);
          }
          else
            setSubs([]);
        }
        else
        {
          setSubs([])
        }
      }
      catch(e)
      {
        console.log(e);
        setSubs([]);
      }
    }

    useEffect(()=>
    {
      getSubs();
      setInformationGathering((prevState)=>({
        ...prevState,
        subscriptionName:""
      }));

    },[informationGathering.cspSelection]);

    // function for sending data using fetch for raise request module
    async function handleSaveAll()
    {
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
      if(enterpriseBackupConfiguration.excelFile[0] == null)
        body.enterpriseBackupConfiguration = {excelFile:[]};
      else
        body.enterpriseBackupConfiguration = enterpriseBackupConfiguration;

      body.zpavpnOnBoarding = ZPAVPNOnboarding;

      body.deploymentArchitectureOfTheApplication.excelFile = body.deploymentArchitectureOfTheApplication.excelFile.filter((element:any)=>
      {
        if(element)
          return true;
        else
          return false;
      });

      console.log(body);

      if(await createRequest(body))
      {
          toast.success("Request Raised Successfully", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });

          setIsOpen(false);
          refreshDialog();
      }
      else
      {
          toast.error("Some Error Occurred, try again", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });

          setIsOpen(false);
          refreshDialog();
      }

    }

    // useEffect for assigning all the initial values for required string
    useEffect(() =>
    {
      console.log(sessionStorage.getItem('userRole'));
      let name = sessionStorage.getItem("userName");
      let businessName = sessionStorage.businessName;
      setUserRole(sessionStorage.getItem('userRole'));

      setInformationGathering((prevData) => ({
        ...prevData,
        nameOfRequester:name || ""
      }));

      setInformationGathering((prevData) => ({
        ...prevData,
        businessName:businessName || ""
      }));

    },[]);

    useEffect(()=>
    {
      fetchCloudServiceSheetTable();
    },[]);


    // function to update status of request (not in use currently)
    async function updateStatus(requestId:any,status:any)
    {
      try
      { 
        let response = await fetch(`http://192.168.2.102:1010/api/${requestId}/status?status=${status}`,
        {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
        }
        );

        if(response.status == 200)
        {
          let data = await response.json();
          // show toast here
          console.log(data);
          // console.log(data.message);
          toast.success("Status Updated Successfully", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });

          await fetchCloudServiceSheetTable();
        }
        else
        {
          toast.error("Some error occured, try again", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      }
      catch(error)
      {
        toast.error("Some error occured, try again", 
        {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    }

    // function to create a request
    async function createRequest(data:any)
    {
      try
      {
        let response = await fetch(`http://192.168.2.102:1010/api/createRequest`,
        {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if(response.status == 201)
        {
          let data = await response.json();
          console.log(data);

          await fetchCloudServiceSheetTable();
          
          return true;
        }
        else
          return false;

      }
      catch(e)
      {
        console.log(e);
        return false;
      }

      return false;
    }

    // function for fetching the data for table
    async function fetchCloudServiceSheetTable()
    {
        let adid = sessionStorage.getItem("userEmail");
        try
        {
          let response = await fetch(`http://192.168.2.102:1010/api/getRequestDataInTable/${adid}`);
          
          if(response.status == 200)
          {
            let data = await response.json();
            console.log(data[0].table.data);
            console.log(data);
            setTableData(data[0].table); 
            setTableArray(data[0].table.data.reverse());
          }
          else if(response.status == 404)
          {
            console.log("error");
          }
        }
        catch(e)
        {
          console.log("error");
        }
    }

    // function for fetching the request information using request id
    async function fetchRequestByRequestId(requestId:any)
    {
      try
      {
        setIsLoading(true);
        let response = await fetch(`http://192.168.2.102:1010//api/getRequestByRequestId/${requestId}`);
        if(response.status == 200)
        {
          let data = await response.json();
          console.log(data);
          setRequestInformation(data);
          return true;
        }
        else if(response.status == 404)
        {
          console.log("error");
          toast.error("Some error occured, try again", 
          {
            position: "bottom-right",
            autoClose: 2000,
          });
          return false;
        }
      }
      catch(e)
      {
        console.log(e);
        toast.error("Some error occured, try again", 
        {
          position: "bottom-right",
          autoClose: 2000,
        });
        return false;
      }
      finally
      {
        setIsLoading(false);
      }

      return false;
    }

    // function for opening the view dailog box for requests
    async function openViewDilaog(requestId:any)
    {

      let flag = await fetchRequestByRequestId(requestId);

      if(flag)
      setIsViewOpen(true);
    }

    // function for closing the view dailog box
    function closeViewDialog()
    {
      setIsViewOpen(false);
    }

    // function for converting base 64 encoded string to excel file (xlsx)
    function convertStringToExcelFile(fileString:any,name:any)
    {
        console.log("invoked");
        if (fileString) {
            const byteCharacters = atob(fileString);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);

            // Create a link element to download the Excel file
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();

            // Clean up
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } else {
            console.error('No file selected');
        }
    }

    // function for converting base 64 encoded string to excel file (xlsm)
    function convertStringToXLSMFile(fileString:any, name:any) {
      console.log("invoked");
      if (fileString) {
          const byteCharacters = atob(fileString);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/vnd.ms-excel.sheet.macroEnabled.12' }); // Changed MIME type for XLSM
          const url = URL.createObjectURL(blob);
  
          // Create a link element to download the Excel file
          const link = document.createElement('a');
          link.href = url;
          link.download = name;
          document.body.appendChild(link);
          link.click();
  
          // Clean up
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
      } else {
          console.error('No file selected');
      }
    }

    // funtcion for downloading the file uploaded
    const handleDownload = (base64String:any,fileName:any) => {
      try {
        const extension = fileName.split('.').pop()?.toLowerCase() || 'bin';
        const contentType = getContentType(extension);
        
        const binaryData = atob(base64String);
        const blob = new Blob([binaryData], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
        // setErrorMessage('Failed to download file.');
      }
    };


    const getContentType = (extension: string) => 
    {
      const contentTypeMap: { [key: string]: string } = {
        txt: 'text/plain',
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        png: 'image/png',
        // Add more mappings as needed
      };
  
      return contentTypeMap[extension] || 'application/octet-stream';
    };

  
    let dailogClass: any;

    if(activeStep == 10 || isViewOpen)
      dailogClass = "w-full max-w-7xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen";
    else
      dailogClass = "w-full max-w-6xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen";

    return (
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
                <div className="mt-6">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border px-2 py-1 rounded-md"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                    />
                </div>
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

            
            <div className="items-center pb-4 px-4 ">
              <div className="relative overflow-x-auto mt-6 rounded-md">
                    <table className="w-full text-sm text-center text-gray-800">
                        <thead
                            className="text-xs text-white uppercase "
                            style={{
                              background:
                                "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
                            }}
                        >

                        <tr>
                            <th scope="col" className="px-2 py-3">
                              Sr.No.
                            </th>
                            <th scope="col" className="px-auto py-3">
                              Type of Request
                            </th>
                            {
                              userRole == "ADMIN" &&
                              <th scope="col" className="px-auto py-3">
                                Business Name
                              </th>
                            }
                            <th scope="col" className="px-auto py-3">
                              Description
                            </th>
                            <th scope="col" className="px-auto py-3">
                              No of Services
                            </th>
                            <th scope="col" className="px-auto py-3">
                              Status
                            </th>
                            <th scope="col" className="px-auto py-3">
                              Action
                            </th>
                        </tr>

                        </thead>
                        <tbody>
                          {
                            currentData && currentData.length != 0 ? (currentData.map((element:any,index:any)=>
                            {
                              let srNo = index + 1;
                              if((srNo > (currentPage - 1) * itemsPerPage) && (index < (currentPage * itemsPerPage)))
                              {
                                return (
                                  <tr key={index} className="bg-white border-b text-center">
                                    <td className="px-auto py-3">{index  + 1}</td>
                                    <td className="px-auto py-3">{element[1]}</td>
                                    { 
                                      userRole == 'ADMIN' && 
                                      <td className="px-auto py-3">{element[2]}</td>
                                    }
                                    <td className="px-auto py-3">{element[3]}</td>
                                    <td className="px-auto py-3">{element[4]}</td>
                                    <td className="px-auto py-3">{element[5]}</td>
                            

                                    <td className="px-auto py-3 flex justify-center items-center gap-4 cursor-pointer">
                                      <VisibilityIcon onClick={()=>{openViewDilaog(element[0])}}/>

                                      {
                                        userRole == 'ADMIN' &&
                                        <DriveFolderUploadIcon onClick={()=>
                                          {
                                            setIsUploadOpen(true); 
                                            setAdminCloudDocuments((prevData:any)=>({
                                            ...prevData,
                                            requestId:element[0]
                                          }))
                                        }}/>
                                      }
                                    </td>
                                  </tr>
                                )
                              }
                              
                            })):
                            ( 
                            <tr className="bg-white border-b text-center ">
                            <td className="px-auto py-3 " colSpan={7}>
                              No Data Found
                            </td>
                            </tr>
                            )
                          }
                        </tbody>

                    </table>

                    <div className="mt-2 table-pagination w-full flex items-center justify-end gap-2">
                      <button
                        className="py-1 px-2 rounded border disabled:text-slate-400"
                        onClick={() =>
                          setCurrentPage((prevPage:any) => Math.max(prevPage - 1, 1))
                        }
                        disabled={currentPage === 1}
                          >
                          Prev
                        </button>
                        <span>{`Page ${currentPage} of ${totalPages}`}</span>
                        <button
                        className="py-1 px-2 rounded border disabled:text-slate-400"
                        onClick={()=>
                        {
                          setCurrentPage((prev:any)=>prev + 1);
                        }}
                        disabled={currentPage === totalPages}
                        >
                        Next
                      </button>
                    </div>

              </div>
            </div>

            {/* loader */}
            {
              isLoading &&
              <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black bg-opacity-50">
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              </div>
            }

          
            {/* Modal for opening the upload dialog box */}
            
            {
              isUploadOpen &&
              <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">

                <div className="w-[40vw] my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">

                  <div
                    className=" px-4 py-2 flex items-center justify-between"
                    style={{
                      background:
                        "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
                    }}
                  >
                    <h3 className="text-xl text-white font-bold">
                      Upload Documents
                    </h3>
                    <button
                      className="p-2 text-2xl text-white cursor-pointer"
                      onClick={closeAdminDocumentModal}
                    >
                      <CloseIcon />
                    </button>
                  </div>


                  <div className="my-5 mx-5">

                    <label className="block text-md font-semibold mb-2">
                      <span className="text-red-500 text-md font-bold">*</span> Design Document :
                    </label>
                    <input 
                    type="file"
                    name="designDocument"
                    className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                    onChange={handleFileUploadAdminCloudDocuments}
                    />

                  </div>

                  <div className="my-5 mx-5">

                    <label className="block text-md font-semibold mb-2">
                      <span className="text-red-500 text-md font-bold">*</span> Another Document :
                    </label>
                    <input 
                    type="file"
                    name="anotherDocument"
                    className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                    onChange={handleFileUploadAdminCloudDocuments}
                    />

                  </div>

                  <div className="my-5 mx-5">
                    <label className="block text-md font-semibold mb-2">
                      Comment :
                    </label>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                      name="comment"
                      value={adminCloudDocuments.comment}
                      onChange={handleAdminCloudDocuments}
                    />
                  </div>

                  <div className="px-5 py-5 w-full flex justify-end">
                    <button 
                    className="text-white rounded-md px-5 py-2"
                    style={{
                      background:
                        "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
                    }}
                    onClick={saveAdminCloudDocument}
                    >
                      Upload
                    </button>
                  </div>

                </div>

              </div>
            }


            {/* Modal rendering code */}
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
    
                  { (activeStep != 10) &&
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
                    <div className="mx-3" style={{display: (activeStep == 0 || activeStep == 10) ? 'block':'none'}}>
                    
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
                                  <InfoOutlinedIcon/>
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
                                subs && subs.length && subs.map((sub:any)=>
                                {
                                  return <option key={sub.subsAccId} value={sub.subsAccId}>{sub.subsAccName}</option>
                                })
                              }
                              </select>
                              
                              <Tooltip title="Enter the name of the Cloud subscription associated with the deployment." placement="top-end">
                                <button className="absolute top-0 right-4 bg-transparent cursor-pointer p-[0.4rem]">
                                  <InfoOutlinedIcon/>
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
                                <InfoOutlinedIcon/>
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

                      <div className="mx-3" style={{display: (activeStep == 1 || activeStep == 10) ? 'block':'none'}}>
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
                                  <InfoOutlinedIcon/>
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
                                      <InfoOutlinedIcon/>
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
                                  <InfoOutlinedIcon/>
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
                    
                      <div className="mx-3" style={{display: (activeStep == 2 || activeStep == 10) ? 'block':'none'}}>
                      
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
                                    <InfoOutlinedIcon/>
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
                                    <InfoOutlinedIcon/>
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
                                    <InfoOutlinedIcon/>
                                  </button>
                                </Tooltip>

                              </div>
                    
                              <input 
                                type="text" 
                                name="highAvailabilityRequiredText"
                                value={deploymentArchitectureOfTheApplication.highAvailabilityRequiredText}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow flex-1" 
                                onChange={handleDeploymentArchitectureChange}
                                placeholder="Type Here"/>

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
                                    <InfoOutlinedIcon/>
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
                                      <InfoOutlinedIcon/>
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
                                    <InfoOutlinedIcon/>
                                  </button>
                                </Tooltip>

                              </div>

                          </div>
                    
                        </div>
                    
                        {excelArray.map((element,index: number)=>
                        {
                          return <div key={index} className="mt-5 mx-2 flex justify-evenly gap-10">
                          
                          <div className="mb-3 flex-1">

                              <label className="block text-md font-semibold mb-2">
                                Cloud Provisioning :
                              </label>
                              <select
                              name="cloudProvisioning"
                              value={excelArray[index]}
                              onChange={(event) =>
                                handleExcelSelectChange(event,index)
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
                                <button className="font-bold text-2xl" onClick={()=>{decrementFileCount(index)}}>-</button>
                              }
                            </label>
                            
                            <input 
                            type="file"
                            disabled={!excelArray[index]}
                            className=" w-full px-4 py-2 border border-gray-300 rounded shadow disabled:cursor-not-allowed"
                            onChange={(event)=>{handleDeploymentArchitectureOfTheApplicationFileUpload(event,index)}}
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
                      <div className="mx-3" style={{display: (activeStep == 3 || activeStep == 10) ? 'block':'none'}}>
                      
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
                                    <InfoOutlinedIcon/>
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
                                      <InfoOutlinedIcon/>
                                    </div>
                                  </Tooltip>
                                </div>
                              </a>
                    
                            </div>
                    
                    
                            <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                              <span className="text-red-500 text-md font-bold">*</span> Upload 
                              </label>

                              <input type="file" className="my-2" onChange={handleFireWallChangeRequestFileUpload}/>

                            </div>
                    
                        </div>
                    
                      </div>
                    }

                  
                    {
                      (activeStep == 10) &&
                          <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Application Implementation</div>
                    }

                    {
                      <div className="mx-3" style={{display: (activeStep == 4 || activeStep == 10) ? 'block':'none'}}>
                      
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
                                    <InfoOutlinedIcon/>
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
                                      <InfoOutlinedIcon/>
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
                      <div className="mx-3" style={{display: (activeStep == 5 || activeStep == 10) ? 'block':'none'}}>
                      
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
                                    <InfoOutlinedIcon/>
                                  </div>
                                </Tooltip>
                              </div>
                            </a>
                    
                        </div>
                    
                        <div className="mb-3 flex-1">
                    
                            <label className="block text-md font-semibold mb-2">
                              {/* if buiness critical/ mission critical / production then back up request file is mandatory */}
                              {(applicationDetails.applicationCriticality == 'Business Critical' || applicationDetails.applicationCriticality =='Mission Critical' || deploymentArchitectureOfTheApplication.environmentOfApplication == 'Production') && 
                              <span className="text-red-500 text-md font-bold">* </span>} 
                              Upload Back Up Request Excel Sheet
                            </label>
                    
                            <input 
                            type="file" 
                            className=" w-full px-4 py-2 border border-gray-300 rounded shadow"
                            onChange={handleEnterpriseBackupConfigurationFileUpload}/>

                        </div>
                    
                      </div>
                    
                      </div>
                    }

                    {
                      (activeStep == 10) &&
                        <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">ZPA VPN Onboarding</div>
                    }

                    {
                      <div className="mx-3" style={{display: (activeStep == 6 || activeStep == 10) ? 'block':'none'}}>
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
                                      <InfoOutlinedIcon/>
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
                    style={{background:
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
                    style={{background: (validate()) ? "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)": "	#DCDCDC"
                      }}
                      className="text-white p-2 rounded-lg w-24 mx-2"
                      >
                      Next
                    </button>
                    }
    
                    {
                    (activeStep == 6) &&
                    <button 
                    onClick={()=>{setActiveStep(10)}}
                    disabled={!validate()}
                    style={{background: (validate()) ? "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)": "	#DCDCDC"
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
                      style={{background: (validate()) ? "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)": "	#DCDCDC"
                      }}
                      className="text-white p-2 rounded-lg w-24 mx-2"
                      onClick={handleSaveAll}
                      >
                        Save All
                      </button>
                    }
    
                  </div>
    
                </div>
    
            </div>
        }

        {/* Modal to view the request detail */}
        {
          isViewOpen &&
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            
                <div className={dailogClass}>
    
                    <div
                      className="px-4 py-2 flex items-center justify-between"
                      style={{
                        background:
                          "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
                      }}
                    >
                      <h3 className="text-xl text-white font-bold">
                        Request Information
                      </h3>
                      <button
                        className="p-2 text-2xl text-white"
                        onClick={closeViewDialog}
                      >
                        <CloseIcon />
                      </button>
                    </div>

                  <div className="h-full overflow-scroll">
    
                    
                    <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Information Gathering</div>
                    
                    {
                    <div className="mx-3">
                    
                      <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                        <div className="mb-3 flex-1">
                          <label className="block text-md font-semibold mb-2">
                            Name of Requester :
                          </label>
                          <input
                            name="nameOfRequester"
                            type="text"
                            defaultValue={requestInformation.informationGatheringResponse.nameOfRequester}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          />
                        </div>
                    
                        <div className="mb-3 flex-1">
                    
                            <label className="block text-md font-semibold mb-2">
                                CSP Selection :
                            </label>
                    
                            <input
                            type="text"
                            defaultValue={requestInformation.informationGatheringResponse.cspSelection}
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                            readOnly
                            />
                        </div>
                    
                      </div>
                    
                      <div className="my-5 mx-2 flex justify-evenly gap-10">
                          <div className="mb-3 flex-1">
                            <label className="block text-md font-semibold mb-2">
                             Business Name :
                            </label>
                            <input
                              name="businessName"
                              type="text"
                              defaultValue={requestInformation.informationGatheringResponse.businessName}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              // onChange={handleInformationGatheringChange}
                              // required
                              readOnly
                            />
                          </div>
                    
                          <div className="mb-3 flex-1">
                            <label className="block text-md font-semibold mb-2">
                              Current Mode of operation :
                            </label>
                            <input
                              name="currentModeOfOperation"
                              type="text"
                              placeholder="Type here"
                              defaultValue={requestInformation.informationGatheringResponse.currentModeOfOperation}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              // onChange={handleInformationGatheringChange}
                              // required
                              readOnly
                            />
                          </div>
                    
                      </div>
                    
                      <div className="my-5 mx-2 flex justify-evenly gap-10">
                        <div className="mb-3 flex-1">
                            <label className="block text-md font-semibold mb-2">
                              Subscription name :
                            </label>
                            <input
                            type="text"
                            defaultValue={requestInformation.informationGatheringResponse.subscriptionName}
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                            readOnly
                            />
                          
                        </div>
                          
                        <div className="mb-3 flex-1">
                          <label className="block text-md font-semibold mb-2">
                            Work Description :
                          </label>
                          <input
                            name="workDescription"
                            type="text"
                            // placeholder="Type here"
                            defaultValue={requestInformation.informationGatheringResponse.workDescription}
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                            // onChange={handleInformationGatheringChange}
                            // required
                            readOnly
                          />
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
                            // placeholder="Type here"
                            defaultValue={requestInformation.informationGatheringResponse.nameOfSponsor}
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                            // onChange={handleInformationGatheringChange}
                            // required
                            readOnly
                          />
                        </div>
                          
                        <div className="mb-3 flex-1">
                          
                        </div>
                      </div>
                          
                    </div>
                    }
                            
                    <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Application Details</div>
                    
                    {

                      <div className="mx-3">
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                          <div className="mb-3 flex-1">
                        
                              <label className="block text-md font-semibold mb-2">
                                Application Name :
                              </label>
                              <input
                                name="applicationName"
                                type="text"                         
                                defaultValue={requestInformation.applicationDetails.applicationName}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />

                          </div>
                        
                          <div className="mb-3 flex-1">
                            <label className="block text-md font-semibold mb-2">
                              Purpose of the application :
                            </label>
                            <input
                              name="purposeOfTheApplication"
                              type="text"
                              value={requestInformation.applicationDetails.purposeOfTheApplication}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              // onChange={handleApplicationDetailsChange}
                              // required
                              readOnly
                            />
                          </div>
                        
                        
                        </div>
                        
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                        

                          <div className="mb-3 flex-1">

                              <label className="block text-md font-semibold mb-2">
                                Application Criticality :
                              </label>
                              <input
                                type="text"
                                defaultValue={requestInformation.applicationDetails.applicationCriticality}  
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />

                            </div>
                        
                            <div className="mb-3 flex-1">
                        
                            <label className="block text-md font-semibold mb-2">
                              Nature of the application :
                            </label>
                            <input
                              type="text"
                              defaultValue={requestInformation.applicationDetails.natureOfTheApplication}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              readOnly
                            />

                          </div>
                        
                        </div>
                        

                      </div>
                    }

                  
                    <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Deployement Architecuture of the application</div>
                    
                    {
                    
                      <div className="mx-3">
                      
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                          <div className="mb-3 flex-1">
                    
                            <label className="block text-md font-semibold mb-2">
                              Application Internet exposed :
                            </label>
                            <input
                              type="text"
                              defaultValue={requestInformation.deploymentArchitectureOfTheApplication.applicationInternetExposed}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              readOnly
                            />

                          </div>
                    
                          <div className="mb-3 flex-1">
                    
                            <label className="block text-md font-semibold mb-2">
                              Environment of application :
                            </label>
                            <input
                              type="text"
                              defaultValue={requestInformation.deploymentArchitectureOfTheApplication.environmentOfApplication}
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              readOnly
                            />
                    
                          </div>
                    
                          <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                                High Availability Required :
                              </label>
                    
                              <div className="flex gap-2 justify-center"> 

                              <input
                                type="text"
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.highAvailabilityRequired} 
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow flex-1"
                                readOnly
                              />
                    
                              <input 
                                type="text" 
                                name="highAvailabilityRequiredText"
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.highAvailabilityRequiredText}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow flex-1" 
                                readOnly
                                />

                              </div>

                          </div>
                    
                        </div>
                    
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                          <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                                Disaster Recovery Requirement :
                              </label>
                              <input
                                name="disasterRecoveryRequirement"
                                type="text"
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.disasterRecoveryRequirement}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />
                          </div>
                    
                          <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                                Access management :
                              </label>
                              <input
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.accessManagement}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow" 
                                readOnly
                              />
                    
                          </div>
                    
                          <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                                Future Mode of Operation :
                              </label>
                              <input
                                name="futureModeOfOperation"
                                type="text"
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.futureModeOfOperation}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />

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
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.virtualNetworkName}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />
                          </div>
                    
                          <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                                Additional Comments :
                              </label>
                              <input
                                name="additionalComments"
                                type="text"
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.additionalComments}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />

                          </div>
                    
                          <div className="mb-3 flex-1">

                              {/* <label className="block text-md font-semibold mb-2">
                                Attachments :
                              </label>
                              <input
                                name="attachments"
                                type="file"
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.attach}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                onChange={handleAttachmentChange}
                              /> */}
                          </div>
                    
                        </div>
                    
                        <div>
                            <label className="block text-md font-semibold mb-2 mx-2">
                              Cloud Provisioning Excel Files:
                            </label>
                        </div>

                        {requestInformation.deploymentArchitectureOfTheApplication.excelFile.map((element:any,index: number)=>
                        {
                          return <div key={index} className="mt-5 mx-2 flex justify-evenly gap-10">
                          
                          <div className="mb-3 flex-1">
                              <input
                                type="text"
                                defaultValue={requestInformation.deploymentArchitectureOfTheApplication.excelFile[index].name} 
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />

                          </div>
                              
                          <div className="mb-3 flex-1">
                              <button 
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                onClick={()=>{convertStringToExcelFile(requestInformation.deploymentArchitectureOfTheApplication.excelFile[index].fileString,requestInformation.deploymentArchitectureOfTheApplication.excelFile[index].name)}}
                              >
                                Download
                              </button>
                          </div>
                            
                        </div>

                        })}
                      
                      </div>
                    }


                    <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Network Infra Connectivity</div>
                    

                    {
                      <div className="mx-3">
                      
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                            <div className="mb-3 flex-1">

                              <label className="block text-md font-semibold mb-2">
                                CIDR Range :
                              </label>
                              <input
                                type="text"
                                defaultValue={requestInformation.networkInfraConnectivity.cidrRange}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              />

                            </div>

                            <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                                Port Opening Form :
                              </label>
                    
                              
                              <button 
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              onClick={()=>{convertStringToXLSMFile(requestInformation.networkInfraConnectivity.excelFile[0].fileString,requestInformation.networkInfraConnectivity.excelFile[0].name)}}> 
                              Download File
                              </button>
                            
                            </div>
                    
                        </div>
                    
                      </div>
                    }

                  
              
                    <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Application Implementation</div>
                    

                    {
                      <div className="mx-3">
                      
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                          <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                                Custom Domain URL :
                              </label>
                              <input
                                name="customDomainURL"
                                type="text"
                                defaultValue={requestInformation.applicationImplementation.customDomainURL}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                readOnly
                              />

                          </div>
                    
                          <div className="mb-3 flex-1">
                    

                                <label className="block text-md font-semibold mb-2">
                                  Apply SSL Certificate :
                                </label>
                                <input
                                  name="applySSLCertificate"                             
                                  value={requestInformation.applicationImplementation.applySSLCertificate}
                                  className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                  readOnly
                                />

                          </div>
                    
                          <div className="mb-3 flex-1">
                                <label className="block text-md font-semibold mb-2">SSL Info</label>
                                <input 
                                  name="sslCertificateInfo"
                                  className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                  type="text"
                                  defaultValue={requestInformation.applicationImplementation.sslCertificateInfo}
                                  readOnly
                                />
                          </div>
                    
                    
                          {/* <div className="mb-3 flex-1">

                              <label className="block text-md font-semibold mb-2">
                                DNS Mapping :
                              </label>
                              <input
                                // name="dnsMapping"
                                type="text"
                                placeholder="Type here"
                                // value={applicationImplementation.dnsMapping}
                                className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                                onChange={handleApplicationImplementationChange}
                                required
                              />
                    
                          </div> */}

                        </div>
                        
                      </div>
                    }

                  
                    
                  {
                  requestInformation && requestInformation.enterpriseBackupConfiguration && requestInformation.enterpriseBackupConfiguration.excelFile && requestInformation.enterpriseBackupConfiguration.excelFile[0] &&
                  <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Enterprise Backup Configuration</div>
                  }
                    

                    {
                      requestInformation && requestInformation.enterpriseBackupConfiguration && requestInformation.enterpriseBackupConfiguration.excelFile && requestInformation.enterpriseBackupConfiguration.excelFile[0] && (
                      <div className="mx-3">
                      
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                        <div className="mb-3 flex-1 w-2/4">
                    
                            <label className="block text-md font-semibold mb-2">
                            Back up Request Template :
                            </label>
                  
                            <button 
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              onClick={()=>{convertStringToExcelFile(requestInformation.enterpriseBackupConfiguration.excelFile[0].fileString,requestInformation.enterpriseBackupConfiguration.excelFile[0].name)}}> 
                              Download Excel File
                            </button>
                          
                        </div>
              
                      </div>
                    
                      </div>
                      )
                    }

                  
                    <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">ZPA VPN Onboarding</div>
                    

                    {
                      <div className="mx-3">
                        <div className="my-5 mx-2 flex justify-evenly gap-10">
                    
                          <div className="mb-3 flex-1">
                    
                              <label className="block text-md font-semibold mb-2">
                              ZPA VPN Template :
                              </label>
                    
                              <button 
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              onClick={()=>{convertStringToExcelFile(requestInformation.zpavpnOnBoarding.excelFile[0].fileString,requestInformation.zpavpnOnBoarding.excelFile[0].name)}}
                              > Download Excel File
                              </button>
                        
                          </div>
                        </div>
                      </div>
                    }



                    {
                    requestInformation && requestInformation.adminCloudDocuments &&
                    <div className="text-xl pb-2 flex justify-between items-center mx-5 mt-10 font-bold">Admin Cloud Documents</div>
                    }

                    {requestInformation && requestInformation.adminCloudDocuments &&

                      <>
                        <div className="mx-3">

                          <div className="my-5 mx-2 flex justify-evenly gap-10">

                            <div className="mb-3 flex-1">
                              <label className="block text-md font-semibold mb-2">Design Document</label>
                              <button 
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow" 
                              onClick={()=>{handleAdminFileDonwload(requestInformation.adminCloudDocuments.designDocument.name, requestInformation.adminCloudDocuments.designDocument.fileString)}}>
                                  {requestInformation.adminCloudDocuments.designDocument.name}
                              </button>
                            </div>

                            <div className="mb-3 flex-1">
                              <label className="block text-md font-semibold mb-2">Another Document</label>
                              <button  
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              onClick={()=>{handleAdminFileDonwload(requestInformation.adminCloudDocuments.anotherDocument.name, requestInformation.adminCloudDocuments.anotherDocument.fileString)}}
                              >
                                {requestInformation.adminCloudDocuments.anotherDocument.name}
                              </button>
                            </div>

                          </div>

                        </div>

                        {
                          (requestInformation && (requestInformation.status == 'Document uploaded') && (userRole == 'BE')) &&
                          <>
                            <div className="p-2 ml-4 text-md font-semibold">
                              Above are the documents uploaded please verify them by accepting or rejecting
                            </div>

                            <div className="mx-5 flex gap-3">

                              <div>
                                <button 
                                className="text-white bg-green-600 w-full px-4 py-1 rounder-sm"
                                onClick={()=>{sendApproval(requestInformation.requestId,"Accepted")}}
                                >Accept</button>
                              </div>

                              <div>
                                <button 
                                onClick={()=>{sendApproval(requestInformation.requestId,"Rejected")}}
                                className="text-white bg-red-600 w-full px-4 py-1 rounded-sm"
                                >Reject</button>
                              </div>

                            </div>
                          </>
                        }
                      </>

                    } 

                    {/* close view dialog button */}

                    <div className="flex justify-end">
                      <button
                      className="text-white p-2 rounded-lg w-24 mx-4"
                      onClick={closeViewDialog} 
                      style={{
                        background:"linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
                      }}>
                        Close
                      </button>
                    </div>

                  </div>
  
    
                </div>
    
            </div>
        }
            
        </div>
    )
}

export default Request;