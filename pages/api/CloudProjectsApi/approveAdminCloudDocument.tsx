
import { javaServerBaseUrl } from "@/const";

export const approveAdminCloudDocuments = async (requestId:any, status:any) =>
{
    return await fetch(`${javaServerBaseUrl}/${requestId}/status?status=${status}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      }
    }
    );
}