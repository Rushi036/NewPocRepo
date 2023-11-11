import { finopsBaseUrl, finopsServerBaseUrl, localHostBaseUrl } from "@/const";
import { useState } from "react";

export const getAllUsers = async () => {
  let retData: any;
  // console.log("details in  api", cloud);
  const res = await fetch(`${localHostBaseUrl}/allOwners`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(body),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      retData = data;
    });
  // console.log(retData);

  return retData;
};
