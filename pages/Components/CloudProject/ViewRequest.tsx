import CloseIcon from '@mui/icons-material/Close';

function ViewRequest(props:any)
{
    const {dailogClass,closeViewDialog,requestInformation,downloadFile,sendApproval,userRole} = props;
    return(
        
        requestInformation &&
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
                                onClick={()=>{downloadFile(requestInformation.deploymentArchitectureOfTheApplication.excelFile[index].name + ".xlsx", requestInformation.deploymentArchitectureOfTheApplication.excelFile[index].fileString)}}
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
                              onClick={()=>{downloadFile(requestInformation.networkInfraConnectivity.excelFile[0].name+".xlsm", requestInformation.networkInfraConnectivity.excelFile[0].fileString)}}> 
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
                              onClick={()=>{downloadFile(requestInformation.enterpriseBackupConfiguration.excelFile[0].name+".xlsx",requestInformation.enterpriseBackupConfiguration.excelFile[0].fileString)}}> 
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
                              onClick={()=>{downloadFile(requestInformation.zpavpnOnBoarding.excelFile[0].name + ".xlsx", requestInformation.zpavpnOnBoarding.excelFile[0].fileString)}}
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
                              onClick={()=>{downloadFile(requestInformation.adminCloudDocuments.designDocument.name, requestInformation.adminCloudDocuments.designDocument.fileString)}}>
                                  {requestInformation.adminCloudDocuments.designDocument.name}
                              </button>
                            </div>

                            <div className="mb-3 flex-1">
                              <label className="block text-md font-semibold mb-2">Another Document</label>
                              <button  
                              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                              onClick={()=>{downloadFile(requestInformation.adminCloudDocuments.anotherDocument.name, requestInformation.adminCloudDocuments.anotherDocument.fileString)}}
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
    )
}

export default ViewRequest;