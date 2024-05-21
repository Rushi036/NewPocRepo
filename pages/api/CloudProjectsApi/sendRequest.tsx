import { javaServerBaseUrl } from "@/const";

export const sendRequest = async (data:any) =>
{
    return await fetch(`${javaServerBaseUrl}/createRequest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
}