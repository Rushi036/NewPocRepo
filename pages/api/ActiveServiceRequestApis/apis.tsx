import { finopsServerBaseUrl } from "@/const";

const javaUrl = "https://29f4-103-79-102-235.ngrok-free.app/";

export async function raiseRequest(body:any)
{
    let resData: any;
    try
    {
        resData = await fetch(
            `http://192.168.0.103:1010/api/request`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        resData = await resData.json();
    }
    catch
    {
        resData = "";
    }

    return resData;
}

export async function updateRequest(body:any,id:any)
{
    let resData: any;
    try
    {
        resData = await fetch(
            `http://192.168.0.103:1010/api/updateRequest/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        resData = await resData.json();
    }
    catch
    {
        resData = "";
    }

    return resData;
}

export async function fetchSubcriptions(adid:any,cloud:any)
{
    let resData: any;

    try
    {
        resData = await fetch(`${finopsServerBaseUrl}/getUserCloudSubsriptionNameandIds?cloud=${cloud}&adid=${adid}`);

        if(resData.ok)
        {
            resData =  await resData.json();
        }

    }
    catch
    {
        resData = null;
    }

    return resData;
}

export async function fetchUsers()
{
    let resData:any

    try
    {
        resData = await fetch(`http://192.168.0.103:1010/api/users`);

        if(resData.ok)
        {
            resData =  await resData.json();
        }

    }
    catch
    {
        resData = null;
    }

    return resData;
}

export async function fetchCloudServiceSheet(adid:any)
{
    let resData: any;
    try
    {
        resData = await fetch(
            `http://192.168.0.103:1010/api/getRequest/${adid}`,
        );

        resData = await resData.json();
    }
    catch
    {
        resData = "";
    }

    return resData;
}

export async function fetchCloudServiceRequestById(requestId:any)
{
    let resData: any;
    try
    {
        resData = await fetch(
            `http://192.168.43.14:1010/api/getRequestByRequestId/${requestId}`,
        );

        resData = await resData.json();
    }
    catch
    {
        resData = "";
    }

    return resData;
}

export async function fetchCloudServiceSheetTable(adid:any)
{
    let resData: any;
    try
    {
        resData = await fetch(
            `http://192.168.43.14:1010/api/getRequestDataInTable/${adid}`,
        );

        resData = await resData.json();
    }
    catch
    {
        resData = "";
    }

    return resData;
}
