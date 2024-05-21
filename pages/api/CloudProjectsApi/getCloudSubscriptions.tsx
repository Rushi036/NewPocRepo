import { javaServerBaseUrl } from "@/const";
import { finopsServerBaseUrl } from "@/const";

export const getCloudSubscriptions = async (cloud:any, adid:any) =>
{
    return await fetch(`${finopsServerBaseUrl}/getUserCloudSubsriptionNameandIds?cloud=${cloud}&adid=${adid}`);
}