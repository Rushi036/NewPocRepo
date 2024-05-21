import { javaServerBaseUrl } from "@/const";

export const sendAdminCloudDocuments = async (id:any,data:any) =>
{   
    return await fetch(`${javaServerBaseUrl}/uploadDocument/${id}`,{
      method: "PUT",
      body: JSON.stringify({ adminCloudDocuments: data }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}