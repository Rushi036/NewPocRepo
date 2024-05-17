import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

function Table(props:any)
{
    const {userRole, currentData, itemsPerPage, currentPage, openViewDilaog, setIsUploadOpen, setAdminCloudDocuments, setCurrentPage, totalPages} = props;
    return (
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
    )
}

export default Table;