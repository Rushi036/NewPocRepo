import { finopsBaseUrl, finopsServerBaseUrl } from "@/const";
import { useState } from "react";

export const getAllUsers = async () => {
  let retData: any;
  // console.log("details in  api", cloud);
  const res = await fetch("http://localhost:9201/all", {
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
