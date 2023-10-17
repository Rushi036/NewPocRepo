import { finopsBaseUrl, finopsServerBaseUrl } from "@/const";
import { useState } from "react";

export const getAllSubscriptions = async (cloud: any) => {
  let retData: any;
  console.log("details in  api", cloud);
  const res = await fetch(
    `${finopsServerBaseUrl}/GetAllcloudSubsriptionsNameandIds?cloud=${cloud}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(body),
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      retData = data;
    });
  // console.log(retData);

  return retData;
};
