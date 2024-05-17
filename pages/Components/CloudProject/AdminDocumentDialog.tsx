import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';

function AdminDocumentDialog(props:any)
{
    const {closeAdminDocumentModal,handleFileUploadAdminCloudDocuments,adminCloudDocuments,handleAdminCloudDocuments,saveAdminCloudDocument,buttonLoader} = props;
    return(
        adminCloudDocuments &&
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
                    className="text-white p-2 rounded-lg w-24 mx-2 flex justify-center item-center"
                    style={{
                      background: !buttonLoader ? "linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)" : "#DCDCDC",
                    }}
                    onClick={saveAdminCloudDocument}
                    >
                      {buttonLoader ? <CircularProgress size="1.7rem" color="inherit" /> : <p>Upload</p>}

                    </button>
                  </div>

                </div>

              </div>
    );
}

export default AdminDocumentDialog;