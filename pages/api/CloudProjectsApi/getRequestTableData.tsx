
import { javaServerBaseUrl } from "@/const";

export const getRequestTableData = async (adid:any) =>
{
    return await fetch(`${javaServerBaseUrl}/getRequestDataInTable/${adid}`);
}