
import { javaServerBaseUrl } from "@/const";

export const getRequestByRequestId = async (requestId:any) =>
{
    return await fetch(`${javaServerBaseUrl}/getRequestByRequestId/${requestId}`);
}